"use client";

interface WorldVerifyDialogProps {
  open: boolean;
}

export default function WorldVerifyDialog({
  open,
}: WorldVerifyDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-2xl bg-[#1b1b2f] p-6 text-center shadow-xl">
        <h2 className="text-xl font-bold text-white">
          World ID Verification
        </h2>

        <p className="mt-3 text-sm text-gray-300">
          Verification flow will be integrated in the next build step.
        </p>
      </div>
    </div>
  );
}