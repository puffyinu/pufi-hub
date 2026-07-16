"use client";

interface RewardVideoProps {
  isOpen: boolean;
  videoSrc?: string;
  poster?: string;
  onFinish: () => void;
}

export default function RewardVideo({ isOpen, videoSrc, poster, onFinish }: RewardVideoProps) {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        flex-col
        items-center
        justify-center
        bg-black
        backdrop-blur-xl
        px-6
        transition-opacity
        duration-500
        opacity-100
      "
    >
      <div className="w-full max-w-lg text-center">
        {/* Header - Kept from original layout */}
        <h2 className="text-2xl font-bold text-white">
          Reward Animation
        </h2>
        <p className="mt-1 text-zinc-400">
          Preparing your Daily Reward...
        </p>

        {/* Video or Placeholder (16:9) */}
        <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 flex items-center justify-center">
          {videoSrc ? (
            <video
              src={videoSrc}
              poster={poster}
              autoPlay
              muted
              playsInline
              preload="auto"
              controls={false}
              disablePictureInPicture
              controlsList="nodownload noplaybackrate noremoteplayback"
              onEnded={onFinish}
              onError={onFinish}
              className="h-full w-full object-cover rounded-2xl"
            />
          ) : (
            <div className="text-sm font-medium italic text-zinc-700">
              Reward Video Loading...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}