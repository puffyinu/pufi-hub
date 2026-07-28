"use client";

import { useWorldVerify } from "@/app/hooks/useWorldVerify";

interface WorldVerifyDialogProps {
  open: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function WorldVerifyDialog({
  open,
  onClose,
  onSuccess,
}: WorldVerifyDialogProps) {
  const {
    loading,
    error,
    configured,
    verify,
  } = useWorldVerify();

  if (!open) return null;

  async function handleVerify() {
    const result = await verify();

    if (result.success) {
      onSuccess?.();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#171727] p-6 shadow-2xl">

        <div className="mb-5 text-center">
          <div className="text-2xl">🌍</div>

          <h2 className="mt-3 text-xl font-bold text-white">
            Verify with World ID
          </h2>

          <p className="mt-2 text-sm text-gray-300">
            Verify your human identity before continuing.
          </p>
        </div>

        {!configured && (
          <div className="mb-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-sm text-yellow-300">
            World ID is not configured.
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          type="button"
          disabled={!configured || loading}
          onClick={handleVerify}
          className="w-full rounded-xl bg-purple-600 px-4 py-3 font-semibold text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify World ID"}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={onClose}
          className="mt-3 w-full rounded-xl border border-white/10 px-4 py-3 text-white transition hover:bg-white/5"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}