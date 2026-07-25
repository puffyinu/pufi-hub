"use client";

interface UIFeedbackProps {
  isOpen: boolean;
  type: "alert" | "confirm";
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export default function UIFeedback({
  isOpen,
  type,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
}: UIFeedbackProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-md px-6">
      <div className="relative w-full max-w-[360px] overflow-hidden rounded-[32px] bg-gradient-to-b from-[#1E2036] to-[#0D1125] p-8 ring-1 ring-white/10 shadow-2xl">
        <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-yellow-500/10 blur-[60px]" />
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-xl font-black text-white mb-4">{title}</h2>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            {message}
          </p>

          <div className="flex w-full gap-3">
            {type === "confirm" && (
              <button
                onClick={onCancel}
                className="flex-1 rounded-2xl bg-white/10 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/20 active:scale-95"
              >
                {cancelLabel}
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`rounded-2xl bg-gradient-to-b from-[#FFE580] via-[#FFB323] to-[#E59400] py-3.5 text-sm font-black text-[#171717] shadow-lg transition-all active:scale-95 hover:brightness-110 ${
                type === "confirm" ? "flex-[2]" : "w-full"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
