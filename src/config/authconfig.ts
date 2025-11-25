import { type Configuration, LogLevel } from "@azure/msal-browser";

// Instead of checking env variables which might be undefined, 
// we simply ask the browser "Where are we right now?"
// This resolves to "http://localhost:5173" locally and your domain in prod.
const currentOrigin = window.location.origin;

export const msalConfig: Configuration = {
  auth: {
    // We add a fallback string "MISSING_CLIENT_ID" to prevent the "undefined" crash
    // if the env variable is not loaded.
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "MISSING_CLIENT_ID",
    authority: import.meta.env.VITE_AZURE_AUTHORITY || "https://login.microsoftonline.com/common",
    
    
    redirectUri: currentOrigin, 
    postLogoutRedirectUri: currentOrigin,
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
            
            break;
          case LogLevel.Verbose:
            
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
  
  scopes: [import.meta.env.VITE_API_SCOPE || "User.Read"],
};

export const graphConfig = { 
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me" 
};