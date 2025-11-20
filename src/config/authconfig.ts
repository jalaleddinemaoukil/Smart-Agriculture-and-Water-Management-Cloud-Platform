import { type Configuration, LogLevel } from "@azure/msal-browser";


const redirectUri =
  window.location.hostname === "localhost"
    ? import.meta.env.VITE_AZURE_REDIRECT_URI
    : import.meta.env.VITE_AZURE_REDIRECT_URI_PROD;

const postLogoutRedirectUri =
  window.location.hostname === "localhost"
    ? "http://localhost:5173"
    : "https://swamp.azurewebsites.net";


export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID!,
    authority: import.meta.env.VITE_AZURE_AUTHORITY!,
    redirectUri,
    postLogoutRedirectUri,
  },
  cache: {
    cacheLocation: "localStorage", 
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            break;
          case LogLevel.Info:
            console.info(message);
            break;
          case LogLevel.Verbose:
            console.debug(message);
            break;
          case LogLevel.Warning:
            console.warn(message);
            break;
        }
      },
    },
  },
};


export const loginRequest = { scopes: ["User.Read"] };


export const apiRequest = {
  scopes: [import.meta.env.VITE_API_SCOPE!],
};


export const graphConfig = { graphMeEndpoint: "https://graph.microsoft.com/v1.0/me" };
