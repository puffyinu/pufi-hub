// ============================================
// PUFI HUB
// Module 1.0
// World Authentication Types
// ============================================

export interface WorldUser {
  walletAddress: string
    username?: string
      verified: boolean
      }

      export interface WorldSession {
        isAuthenticated: boolean
          user: WorldUser | null
            expiresAt?: number
            }

            export interface WorldAuthState {
              loading: boolean
                authenticated: boolean
                  error: string | null
                    session: WorldSession | null
                    }

                    export interface VerifyResult {
                      success: boolean
                        proof?: string
                          nullifierHash?: string
                          }

                          export interface WalletAuthResult {
                            address: string
                              signature?: string
                              }