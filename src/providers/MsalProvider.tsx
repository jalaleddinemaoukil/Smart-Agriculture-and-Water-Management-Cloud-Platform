import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../config/authconfig"


const pca = (window as any)._pca || new PublicClientApplication(msalConfig);
(window as any)._pca = pca;

export function MsalAuthProvider({ children }: { children: React.ReactNode }) {
  return <MsalProvider instance={pca}>{children}</MsalProvider>;
}
