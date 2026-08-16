import React, { useMemo, useState } from "react";
import { X, Database, Search, ArrowRight } from "lucide-react";

interface CustomDatasetModalProps {
  onClose: () => void;
  onUseDataset: (datasetReference: string) => Promise<void> | void;
}

interface PreviewResponse {
  datasetId: string;
  datasetUrl: string;
  endpoint: string;
  sampleRows: Record<string, unknown>[];
  fieldHints: {
    boroughField?: string;
    dateField?: string;
    locationField?: string;
    subjectField?: string;
    agencyField?: string;
    sampleKeys: string[];
  };
  rowCount: number;
  status: "ready";
}

const EXAMPLE_DATASETS = [
  "erm2-nwe9",
  "https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9",
  "bkfu-528j",
  "tg4x-b46p",
];

export const CustomDatasetModal: React.FC<CustomDatasetModalProps> = ({
  onClose,
  onUseDataset,
}) => {
  const [input, setInput] = useState("");
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedDatasets, setSavedDatasets] = useState<Array<{ dataset_id: string; dataset_name: string }>>([]);

  React.useEffect(() => {
    // Fetch registered custom datasets from Supabase database
    fetch("/api/custom-datasets")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setSavedDatasets(data);
        }
      })
      .catch(() => {});
  }, []);

  const canSubmit = input.trim().length > 0 && !isLoading;

  const fieldSummary = useMemo(() => {
    if (!preview)
      return [] as Array<{
        key: string;
        label: string;
        value: string | string[];
      }>;

    return [
      { key: "boroughField", label: "Borough field" },
      { key: "dateField", label: "Date field" },
      { key: "locationField", label: "Location field" },
      { key: "subjectField", label: "Subject field" },
      { key: "agencyField", label: "Agency field" },
    ]
      .map(({ key, label }) => ({
        key,
        label,
        value: preview.fieldHints[key as keyof typeof preview.fieldHints] as
          | string
          | string[]
          | undefined,
      }))
      .filter(({ value }) => Boolean(value)) as Array<{
      key: string;
      label: string;
      value: string | string[];
    }>;
  }, [preview]);

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/custom-dataset/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataset: input.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Unable to preview dataset.");
      }
      setPreview(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to preview dataset.",
      );
      setPreview(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseCurrentDataset = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      await onUseDataset(input.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load dataset.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#FBF9F4] border-[2.5px] border-zinc-900 rounded-[24px] shadow-[8px_8px_0px_#18181b] flex flex-col overflow-hidden text-zinc-900">
        <div className="p-4 sm:p-5 border-b-2 border-zinc-900 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl border-2 border-zinc-900 bg-rose-200 text-rose-900 shadow-[2px_2px_0px_#18181b]">
              <Database size={18} />
            </span>
            <div>
              <h3 className="font-sans-clean font-bold text-base sm:text-lg">
                Custom dataset input
              </h3>
              <p className="text-xs text-zinc-500 font-sans-clean">
                Paste a Socrata ID or full NYC Open Data URL
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl border-2 border-zinc-900 hover:bg-zinc-100 active:translate-x-[1px] active:translate-y-[1px] shadow-[2px_2px_0px_#18181b] cursor-pointer"
            aria-label="Close custom dataset modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
          <div className="p-4 rounded-2xl border-2 border-zinc-900 bg-[#FEF9C3] shadow-[3px_3px_0px_#18181b]">
            <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed font-medium">
              This preview flow accepts a generic Socrata dataset reference and
              checks whether it has the fields needed for the app’s mapping
              logic. It does not replace the default NYC feed set; it simply
              lets you try another public dataset.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
              Dataset reference
            </label>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="erm2-nwe9 or https://data.cityofnewyork.us/.../erm2-nwe9"
                className="flex-1 min-w-0 bg-white border-2 border-zinc-900 rounded-xl px-3 py-2 text-sm font-medium text-zinc-900 shadow-[2px_2px_0px_#18181b] outline-none placeholder:text-zinc-400"
              />

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-sans-clean font-bold text-xs py-2 px-3 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] cursor-pointer"
              >
                <Search size={14} />
                <span>{isLoading ? "Checking..." : "Preview"}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {EXAMPLE_DATASETS.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setInput(example)}
                className="text-[11px] font-bold text-zinc-800 bg-white border-2 border-zinc-900 rounded-full px-2.5 py-1 shadow-[1.5px_1.5px_0px_#18181b] cursor-pointer hover:bg-zinc-100"
              >
                {example}
              </button>
            ))}
          </div>

          {savedDatasets.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Saved in Supabase database:
              </span>
              <div className="flex flex-wrap gap-2">
                {savedDatasets.map((ds) => (
                  <button
                    key={ds.dataset_id}
                    type="button"
                    onClick={() => setInput(ds.dataset_id)}
                    className="text-[11px] font-bold text-emerald-900 bg-emerald-50 border border-emerald-600 rounded-full px-2.5 py-1 cursor-pointer hover:bg-emerald-100 shadow-[1px_1px_0px_rgba(0,0,0,0.1)]"
                  >
                    📦 {ds.dataset_id}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl border-2 border-rose-500 bg-rose-50 px-3 py-2 text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          {preview && (
            <div className="space-y-4">
              <div className="rounded-2xl border-2 border-zinc-900 bg-white p-4 shadow-[3px_3px_0px_#18181b]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                      Resolved dataset
                    </div>
                    <div className="text-sm font-bold text-zinc-900">
                      {preview.datasetId}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-400 rounded-full px-2 py-1">
                    Ready
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs text-zinc-700 font-medium break-all">
                  <div>
                    <strong>Open Data URL:</strong> {preview.datasetUrl}
                  </div>
                  <div>
                    <strong>Resource endpoint:</strong> {preview.endpoint}
                  </div>
                  <div>
                    <strong>Rows previewed:</strong> {preview.rowCount}
                  </div>
                </div>
              </div>

              {fieldSummary.length > 0 && (
                <div className="rounded-2xl border-2 border-zinc-900 bg-[#E0F2FE] p-4 shadow-[3px_3px_0px_#18181b]">
                  <div className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Detected fields
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {fieldSummary.map(({ label, value }) => (
                      <span
                        key={label}
                        className="inline-flex items-center bg-white border-2 border-zinc-900 rounded-full px-2.5 py-1 text-[11px] font-bold text-zinc-800 shadow-[1.5px_1.5px_0px_#18181b]"
                      >
                        {label}: {String(value)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {preview.fieldHints.sampleKeys.length > 0 && (
                <div className="rounded-2xl border-2 border-zinc-900 bg-white p-4 shadow-[3px_3px_0px_#18181b]">
                  <div className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Sample keys
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {preview.fieldHints.sampleKeys.map((key) => (
                      <span
                        key={key}
                        className="inline-flex items-center bg-zinc-100 border border-zinc-900 rounded-full px-2 py-1 text-[11px] font-semibold text-zinc-700"
                      >
                        {key}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {preview.sampleRows.length > 0 && (
                <div className="rounded-2xl border-2 border-zinc-900 bg-white p-4 shadow-[3px_3px_0px_#18181b]">
                  <div className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider mb-2">
                    Sample rows
                  </div>
                  <div className="space-y-2">
                    {preview.sampleRows.map((row, index) => (
                      <div
                        key={`${preview.datasetId}-${index}`}
                        className="rounded-xl border border-zinc-300 bg-zinc-50 p-2 text-[11px] text-zinc-700 font-mono overflow-x-auto"
                      >
                        {JSON.stringify(row)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t-2 border-zinc-900 bg-white flex items-center justify-end gap-2">
          {preview && (
            <button
              type="button"
              onClick={handleUseCurrentDataset}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 bg-rose-400 hover:bg-rose-300 disabled:opacity-60 text-zinc-900 font-sans-clean font-bold text-xs py-2 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] cursor-pointer"
            >
              <ArrowRight size={14} />
              <span>Use this dataset</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-sans-clean font-bold text-xs py-2 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_#18181b] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
