import { useState } from "react";
import type { WorldAuthState } from "@/app/types/world";

const initialState: WorldAuthState = {
  loading: false,
  authenticated: false,
  error: null,
  session: null,
};

export function useWorldAuth() {
  const [state] = useState<WorldAuthState>(initialState);

  return {
    ...state,
  };
}
