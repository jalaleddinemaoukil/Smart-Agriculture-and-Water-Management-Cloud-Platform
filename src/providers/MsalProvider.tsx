import { MsalProvider } from "@azure/msal-react"
import { PublicClientApplication } from "@azure/msal-browser"

import { msalConfig } from "../config/authconfig"

type MsAuthWindow = Window &
  typeof globalThis & {
    _pca?: PublicClientApplication
  }

const msalWindow = window as MsAuthWindow
const pca = msalWindow._pca ?? new PublicClientApplication(msalConfig)
msalWindow._pca = pca

export function MsalAuthProvider({ children }: { children: React.ReactNode }) {
  return <MsalProvider instance={pca}>{children}</MsalProvider>
}
