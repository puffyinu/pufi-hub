export function isDevelopmentRuntime(): boolean {
  console.log("[RUNTIME MODE]", {
    NEXT_PUBLIC_RUNTIME_MODE: process.env.NEXT_PUBLIC_RUNTIME_MODE,
    NODE_ENV: process.env.NODE_ENV,
  });

  return process.env.NEXT_PUBLIC_RUNTIME_MODE === "development";
}

export function isProductionRuntime(): boolean {
  return process.env.NEXT_PUBLIC_RUNTIME_MODE === "production";
}