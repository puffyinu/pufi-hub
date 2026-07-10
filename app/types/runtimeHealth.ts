export interface RuntimeHealth {
  initialized: boolean;
  miniKitReady: boolean;
  sessionAvailable: boolean;
  walletConnected: boolean;
  timestamp: string;
}