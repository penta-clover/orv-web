import { createContext, useState } from "react";

type AuthTokenContextType = {
  authToken: string | null;
  setAuthToken: (authToken: string) => void;
};

const AuthTokenContext = createContext<AuthTokenContextType>({
  authToken: null,
  setAuthToken: () => {},
});

const AuthTokenProvider = ({ children }: { children: React.ReactNode }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  return (
    <AuthTokenContext.Provider value={{ authToken, setAuthToken }}>
      {children}
    </AuthTokenContext.Provider>
  );
};

export { AuthTokenProvider, AuthTokenContext };
export type { AuthTokenContextType };
