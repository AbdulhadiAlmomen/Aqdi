"use server";

import { getDb } from "@/db";
import { currentOffice } from "@/lib/dal";
import {
  checkDraft,
  classifyId,
  draftFromExtraction,
  hasBlocking,
  mergeFlags,
  TEXT_FIELDS,
  type Draft,
  type Flags,
  type IdType,
  type TextField,
} from "@/lib/contracts/checks";
import { ExtractionError, getExtractor, type ExtractionErrorCode } from "@/lib/contracts/extractor";
import { DuplicateContractError, saveImportedContract } from "@/lib/contracts/save";
import { FREE_CONTRACT_LIMIT } from "@/lib/offices";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel caps request bodies at 4.5 MB.

export type ReadResult =
  | { ok: true; draft: Draft; flags: Flags }
  | { ok: false; error: ExtractionErrorCode | "notPdf" | "tooLarge" | "limit" };

type OfficeData = Awaited<ReturnType<typeof currentOffice>>["data"];

async function atLimit(data: OfficeData) {
  const office = await data.office();
  return !office?.paid && (await data.contractCount()) >= FREE_CONTRACT_LIMIT;
}

// Reads one uploaded PDF with AI and returns a draft for review. Nothing is saved, and the PDF is not kept.
export async function readContract(form: FormData): Promise<ReadResult> {
  const { member, data } = await currentOffice();
  const file = form.get("file");
  if (!(file instanceof File)) return { ok: false, error: "notPdf" };
  if (file.size > MAX_BYTES) return { ok: false, error: "tooLarge" };
  const bytes = new Uint8Array(await file.arrayBuffer());
  // A real PDF starts with "%PDF", whatever its name or declared type.
  if (String.fromCharCode(...bytes.slice(0, 4)) !== "%PDF") return { ok: false, error: "notPdf" };
  if (await atLimit(data)) return { ok: false, error: "limit" };

  try {
    const extraction = await (await getExtractor()).extract(bytes);
    const { draft, flags } = draftFromExtraction(extraction);
    if (draft.fields.contractNumber && (await data.hasContractNumber(draft.fields.contractNumber))) {
      mergeFlags(flags, { contractNumber: ["duplicate"] });
    }
    return { ok: true, draft, flags };
  } catch (error) {
    if (error instanceof ExtractionError) {
      console.error(`contract read failed for office ${member.officeId}: ${error.code} ${error.message}`);
      return { ok: false, error: error.code };
    }
    console.error("contract read failed", error);
    return { ok: false, error: "failed" };
  }
}

export type SaveState = { saved?: boolean; flags?: Flags; error?: "fixFirst" | "limit" | "failed" };

function draftFromForm(form: FormData): Draft {
  const text = (name: string) => {
    const v = form.get(name);
    return typeof v === "string" ? v.trim() : "";
  };
  const fields = Object.fromEntries(TEXT_FIELDS.map((k) => [k, text(k)])) as Record<TextField, string>;
  const dues = form.getAll("installmentDue").map(String);
  const amounts = form.getAll("installmentAmount").map(String);

  // A re-typed full ID replaces the extracted one; only its type and last 4 digits are kept.
  const typed = text("tenantIdNumber");
  let tenantId: Draft["tenantId"];
  if (typed) {
    const id = classifyId(typed);
    tenantId = { type: id.valid ? id.type : "other", last4: id.last4, needsEntry: false };
  } else {
    tenantId = { type: (text("tenantIdType") as IdType) || "other", last4: text("tenantIdLast4"), needsEntry: text("tenantIdNeedsEntry") === "1" };
  }

  return {
    fields,
    tenantId,
    installments: dues.map((dueDate, i) => ({ dueDate: dueDate.trim(), amount: (amounts[i] ?? "").trim() })),
    printedHijri: { start: null, end: null },
  };
}

// Saves an approved draft after running every check again on what the office submitted.
export async function saveContract(_prev: SaveState, form: FormData): Promise<SaveState> {
  const { data, member } = await currentOffice();
  const draft = draftFromForm(form);
  const flags = checkDraft(draft);
  if (draft.fields.contractNumber && (await data.hasContractNumber(draft.fields.contractNumber))) {
    mergeFlags(flags, { contractNumber: ["duplicate"] });
  }
  if (hasBlocking(flags)) return { error: "fixFirst", flags };
  if (await atLimit(data)) return { error: "limit" };

  try {
    await saveImportedContract(getDb(), member.officeId, draft);
    return { saved: true };
  } catch (error) {
    // Two saves racing past the check above are caught by the unique index.
    const code = (error as { code?: string; cause?: { code?: string } }).code ?? (error as { cause?: { code?: string } }).cause?.code;
    if (error instanceof DuplicateContractError || code === "23505") return { error: "fixFirst", flags: { contractNumber: ["duplicate"] } };
    console.error("contract save failed", error);
    return { error: "failed" };
  }
}
