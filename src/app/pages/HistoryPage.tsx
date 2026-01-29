/**
 * History: Premium list with GSAP animations, view/delete with modal.
 */

import { useCallback, useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { useHistory } from "../hooks/useHistory";
import { useI18n } from "../hooks/useI18n";
import { Modal } from "../components/Modal";
import { Tabs, type TabItem } from "../components/Tabs";
import { SummaryCard } from "../components/SummaryCard";
import { 
  HiClock, 
  HiTrash, 
  HiEye, 
  HiDocumentText, 
  HiSparkles,
  HiClipboardDocumentList,
  HiUsers,
  HiCheckCircle,
  HiFolder,
} from "react-icons/hi2";
import type { HistoryItem } from "../lib/storage";
import { PDF_EXPORT_ENABLED } from "../lib/constants";

const FLAGS: Record<string, string> = {
  en: "🇺🇸",
  he: "🇮🇱",
  fr: "🇫🇷",
  es: "🇪🇸",
  ar: "🇸🇦",
};

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function HistoryDetail({ item, onClose }: { item: HistoryItem; onClose: () => void }) {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("summary");
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const el = detailRef.current;
    if (el) {
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  }, []);

  const tabs: TabItem[] = [
    {
      id: "summary",
      label: t.summary,
      icon: HiSparkles,
      panel: <SummaryCard summary={item.summary || t.none} t={t} bare />,
    },
    {
      id: "clean",
      label: t.cleanTranscript,
      icon: HiDocumentText,
      panel: (
        <div className="max-h-[400px] overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-200/60 bg-zinc-50/50 px-5 py-4 text-base leading-relaxed text-zinc-700 dark:border-zinc-700/60 dark:bg-zinc-800/50 dark:text-zinc-300">
          {item.transcriptClean || t.none}
        </div>
      ),
    },
    {
      id: "original",
      label: t.originalTranscript,
      panel: (
        <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap rounded-xl border border-zinc-200/60 bg-zinc-100/80 px-5 py-4 text-sm text-zinc-600 dark:border-zinc-700/60 dark:bg-zinc-800/80 dark:text-zinc-400">
          {item.transcriptRaw || t.none}
        </pre>
      ),
    },
    {
      id: "decisions",
      label: t.decisionsActions,
      icon: HiClipboardDocumentList,
      panel: (
        <div className="space-y-6">
          {!item.participants?.length && !item.decisions?.length && !item.actionItems?.length ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600">
                <HiClipboardDocumentList className="h-7 w-7" />
              </span>
              <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{t.decisionsEmpty}</p>
            </div>
          ) : (
            <>
              {item.participants?.length > 0 && (
                <div className="rounded-xl border border-zinc-200/60 bg-zinc-50/50 p-4 dark:border-zinc-800/60 dark:bg-zinc-800/30">
                  <div className="flex items-center gap-2 mb-3">
                    <HiUsers className="h-5 w-5 text-indigo-500" />
                    <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">{t.participants}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.participants.map((p, i) => (
                      <span key={i} className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm dark:bg-zinc-800 dark:text-zinc-300">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.decisions?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <HiCheckCircle className="h-5 w-5 text-emerald-500" />
                    <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">{t.decisions}</h3>
                  </div>
                  <ul className="space-y-2">
                    {item.decisions.map((d, i) => (
                      <li key={i} className="flex items-start gap-3 rounded-xl border border-emerald-200/60 bg-emerald-50/50 p-3 dark:border-emerald-800/40 dark:bg-emerald-950/20">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
                          <HiCheckCircle className="h-3 w-3" />
                        </span>
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.actionItems?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <HiClipboardDocumentList className="h-5 w-5 text-violet-500" />
                    <h3 className="font-semibold text-zinc-800 dark:text-zinc-200">{t.actionItems}</h3>
                  </div>
                  <ul className="space-y-2">
                    {item.actionItems.map((a, i) => (
                      <li key={i} className="flex items-start gap-3 rounded-xl border border-violet-200/60 bg-violet-50/50 p-3 dark:border-violet-800/40 dark:bg-violet-950/20">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600 dark:bg-violet-900/50 dark:text-violet-400">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-zinc-700 dark:text-zinc-300">{a.description}</p>
                          {a.owner ? (
                            <span className="mt-1 inline-flex items-center gap-1 rounded-md bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                              <HiUsers className="h-3 w-3" />
                              {a.owner}
                            </span>
                          ) : (
                            <span className="mt-1 inline-flex text-xs text-zinc-500 dark:text-zinc-400">
                              {t.ownerUnassigned}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div ref={detailRef} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between rounded-2xl border border-zinc-200/60 bg-white/80 px-6 py-4 shadow-sm backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/80">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white">
            <HiDocumentText className="h-6 w-6" />
          </span>
          <div>
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{item.fileName}</p>
            <p className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <HiClock className="h-4 w-4" />
              {formatDate(item.createdAt)}
              <span className="text-base">{FLAGS[item.outputLanguage] || ""}</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          {t.backToList}
        </button>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeId={activeTab} onChange={setActiveTab} aria-label="History detail tabs" />
    </div>
  );
}

function HistoryCard({ 
  item, 
  index,
  onView, 
  onDelete 
}: { 
  item: HistoryItem; 
  index: number;
  onView: () => void; 
  onDelete: () => void;
}) {
  const { t } = useI18n();
  const cardRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const card = cardRef.current;
    if (card) {
      gsap.fromTo(
        card,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", delay: index * 0.05 }
      );
    }
  }, [index]);

  const preview = (s: string, max: number) => {
    const text = (s || "").trim();
    if (text.length <= max) return text;
    return text.slice(0, max) + "…";
  };

  return (
    <li
      ref={cardRef}
      className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-indigo-200 dark:border-zinc-800/60 dark:bg-zinc-900/80 dark:hover:border-indigo-800/50"
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-linear-to-r from-indigo-500/5 via-transparent to-violet-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          {/* Icon */}
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-100 to-violet-100 text-indigo-600 dark:from-indigo-900/40 dark:to-violet-900/40 dark:text-indigo-400">
            <HiDocumentText className="h-6 w-6" />
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-zinc-800 dark:text-zinc-200">{item.fileName}</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <HiClock className="h-4 w-4" />
                {formatDate(item.createdAt)}
              </span>
              <span className="flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium dark:bg-zinc-800">
                <span>{FLAGS[item.outputLanguage] || ""}</span>
                {item.outputLanguage.toUpperCase()}
              </span>
              {item.exports.word && (
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  DOCX
                </span>
              )}
              {PDF_EXPORT_ENABLED && item.exports.pdf && (
                <span className="rounded-md bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  PDF
                </span>
              )}
            </div>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {preview(item.summary, 150)}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={onView}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-indigo-600 dark:hover:bg-indigo-950/30 dark:hover:text-indigo-400"
          >
            <HiEye className="h-4 w-4" />
            {t.view}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="cursor-pointer rounded-xl p-2.5 text-zinc-400 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30 dark:hover:text-red-400"
            aria-label={t.delete}
          >
            <HiTrash className="h-5 w-5" />
          </button>
        </div>
      </div>
    </li>
  );
}

function EmptyHistory({ t }: { t: ReturnType<typeof useI18n>["t"] }) {
  const emptyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const el = emptyRef.current;
    if (el) {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div
      ref={emptyRef}
      className="flex flex-col items-center justify-center rounded-2xl border border-zinc-200/60 bg-white/80 py-20 text-center shadow-sm backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/80"
    >
      <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-600">
        <HiFolder className="h-10 w-10" />
      </span>
      <p className="mt-4 text-lg font-medium text-zinc-600 dark:text-zinc-400">{t.historyEmpty}</p>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
        Your analyzed meetings will appear here
      </p>
    </div>
  );
}

export function HistoryPage() {
  const { t } = useI18n();
  const { items, remove } = useHistory();
  const [viewing, setViewing] = useState<HistoryItem | null>(null);
  const [deleting, setDeleting] = useState<HistoryItem | null>(null);

  const handleDelete = useCallback(() => {
    if (deleting) {
      remove(deleting.id);
      setDeleting(null);
    }
  }, [deleting, remove]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white">
          <HiClock className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{t.historyTitle}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {items.length} {items.length === 1 ? t.meetingSaved : t.meetingsSaved}
          </p>
        </div>
      </div>

      {viewing ? (
        <HistoryDetail item={viewing} onClose={() => setViewing(null)} />
      ) : (
        <>
          {items.length === 0 ? (
            <EmptyHistory t={t} />
          ) : (
            <ul className="space-y-4">
              {items.map((item, index) => (
                <HistoryCard
                  key={item.id}
                  item={item}
                  index={index}
                  onView={() => setViewing(item)}
                  onDelete={() => setDeleting(item)}
                />
              ))}
            </ul>
          )}
        </>
      )}

      {/* Delete confirmation modal */}
      {deleting && (
        <Modal
          title={t.deleteConfirm}
          cancelLabel={t.cancel}
          confirmLabel={t.confirm}
          confirmDanger
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        >
          {t.deleteConfirmBody}
        </Modal>
      )}
    </div>
  );
}
