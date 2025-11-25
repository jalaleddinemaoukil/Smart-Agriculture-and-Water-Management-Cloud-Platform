import { useCallback } from "react";
import { useMsal } from "@azure/msal-react";
import { apiRequest } from "../config/authconfig";

export const useAuth = () => {
  const { instance, accounts } = useMsal();

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (accounts.length === 0) {
      return null;
    }

    try {
      const response = await instance.acquireTokenSilent({
        ...apiRequest,
        account: accounts[0],
      });
      return response.accessToken;
    } catch (error) {
      console.error("Silent token acquisition failed:", error);
      return null;
    }
  }, [instance, accounts]);

  return {
    isAuthenticated: accounts.length > 0,
    user: accounts[0],
    getAccessToken,
  };
};
