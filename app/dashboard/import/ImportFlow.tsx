"use client";

import { useRef, useState } from "react";
import { readContract, type ReadResult } from "@/app/actions/import";
import { SAMPLE_CONTRACTS, samplePath } from "@/lib/contracts/samples";
import { messages, T, type MessageKey } from "@/lib/i18n";
import { useLang } from "@/lib/use-lang";
import { ReviewCard } from "./ReviewCard";

type Item = { key: string; fileName: string; status: "reading" | "done"; result?: ReadResult };

// Upload → read each file with AI (one request per file, so big batches stay under upload limits) → review.
export function ImportFlow() {
  const lang = useLang();
  const input = useRef<HTMLInputElement>(null);
  const [chosen, setChosen] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [viewing, setViewing] = useState<string | null>(null);
  const samples = SAMPLE_CONTRACTS.filter((s) => s.lang === lang);

  async function readFiles(files: File[]) {
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
    setBusy(false);
  }

  async function readChosen() {
    await readFiles(Array.from(input.current?.files ?? []));
    if (input.current) input.current.value = "";
    setChosen(0);
  }

  // A sample goes through exactly the same path as an uploaded file.
  async function readSample(file: string) {
    if (busy) return;
    const blob = await fetch(samplePath(file)).then((r) => r.blob());
    setViewing(null);
    await readFiles([new File([blob], `${file}.pdf`, { type: "application/pdf" })]);
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
        <button type="button" className="btn btn-primary" onClick={readChosen} disabled={!chosen || busy}>
          <T k={busy ? "common.wait" : "import.read"} />
        </button>
        <p className="import-privacy">
          <T k="import.privacy" />
        </p>
      </div>

      <section className="samples">
        <h2 className="samples-title">
          <T k="samples.title" />
        </h2>
        <p className="dash-muted">
          <T k="samples.hint" />
        </p>
        <div className="samples-grid">
          {samples.map((s) => (
            <div key={s.file} className={`sample-card${viewing === s.file ? " is-open" : ""}`}>
              <span className="sample-icon" aria-hidden="true">PDF</span>
              <p className="sample-name">
                <T k={s.label} />
                <small dir="ltr">{s.file}.pdf</small>
              </p>
              <div className="sample-actions">
                <button type="button" className="btn btn-quiet" onClick={() => setViewing(viewing === s.file ? null : s.file)} aria-expanded={viewing === s.file}>
                  <T k={viewing === s.file ? "samples.hide" : "samples.view"} />
                </button>
                <button type="button" className="btn btn-primary" onClick={() => readSample(s.file)} disabled={busy}>
                  <T k={busy ? "common.wait" : "samples.read"} />
                </button>
              </div>
            </div>
          ))}
        </div>
        {viewing && (
          <div className="sample-preview">
            <iframe src={samplePath(viewing)} title={messages[lang][samples.find((s) => s.file === viewing)?.label ?? "samples.one"]} />
            <a href={samplePath(viewing)} target="_blank" rel="noreferrer" className="sample-open">
              <T k="samples.open" />
            </a>
          </div>
        )}
      </section>

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
