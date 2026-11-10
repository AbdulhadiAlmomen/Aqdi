"use client";

import { useRef, useState } from "react";
import { readContract, type ReadResult } from "@/app/actions/import";
import { T, type MessageKey } from "@/lib/i18n";
import { ReviewCard } from "./ReviewCard";

type Item = { key: string; fileName: string; status: "reading" | "done"; result?: ReadResult };

// Upload → read each file with AI (one request per file, so big batches stay under upload limits) → review.
export function ImportFlow() {
  const input = useRef<HTMLInputElement>(null);
  const [chosen, setChosen] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);

  async function readAll() {
    const files = Array.from(input.current?.files ?? []);
    if (!files.length || busy) return;
    setBusy(true);
    const batch = files.map((f, i) => ({ key: `${Date.now()}-${i}`, fileName: f.name, status: "reading" as const }));
    setItems((prev) => [...batch, ...prev]);
    for (const [i, file] of files.entries()) {
      const form = new FormData();
      form.append("file", file);
      let result: ReadResult;
      try {
        result = await readContract(form);
      } catch {
        result = { ok: false, error: "failed" };
      }
      setItems((prev) => prev.map((it) => (it.key === batch[i].key ? { ...it, status: "done", result } : it)));
    }
    if (input.current) input.current.value = "";
    setChosen(0);
    setBusy(false);
  }

  return (
    <>
      <div className="import-box">
        <label className="btn btn-quiet import-pick">
          <T k="import.choose" />
          <input
            ref={input}
            type="file"
            accept="application/pdf,.pdf"
            multiple
            onChange={(e) => setChosen(e.target.files?.length ?? 0)}
            disabled={busy}
          />
        </label>
        {chosen > 0 && (
          <span className="dash-muted">
            <T k="import.chosen" vars={{ count: String(chosen) }} />
          </span>
        )}
        <button type="button" className="btn btn-primary" onClick={readAll} disabled={!chosen || busy}>
          <T k={busy ? "common.wait" : "import.read"} />
        </button>
        <p className="import-privacy">
          <T k="import.privacy" />
        </p>
      </div>

      {items.map((item) => (
        <section key={item.key} className="import-item">
          <h2 className="import-file" dir="ltr">
            {item.fileName}
          </h2>
          {item.status === "reading" && (
            <p className="dash-muted import-reading">
              <span className="spinner" aria-hidden="true" />
              <T k="import.reading" />
            </p>
          )}
          {item.result && !item.result.ok && (
            <p className="form-error">
              <T k={`importError.${item.result.error}` as MessageKey} />
            </p>
          )}
          {item.result?.ok && (
            <ReviewCard
              draft={item.result.draft}
              flags={item.result.flags}
              onDiscard={() => setItems((prev) => prev.filter((it) => it.key !== item.key))}
            />
          )}
        </section>
      ))}
    </>
  );
}
