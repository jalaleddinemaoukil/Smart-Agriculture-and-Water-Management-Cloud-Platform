export {};

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_KEY: string;
    readonly VITE_API_BASE_URL: string;
    readonly AZURE_SUBSCRIPTION_ID: string;
    readonly AZURE_TENANT_ID: string;
    readonly EVENTHUB_CONNECTION_STR: string;
    readonly EVENTHUB_NAME: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}