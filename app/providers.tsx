import { ApiProvider } from "@/providers/ApiContext";
import { AuthRepositoryProvider } from "@/providers/AuthRepositoryContext";
import { EarlybirdRepositoryProvider } from "@/providers/EarlybirdRepositoryContext";
import { FirebaseProvider } from "@/providers/FirebaseContext";
import { StorageProvider } from "@/providers/StorageContext";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <FirebaseProvider>
      <ApiProvider>
        <StorageProvider>
          <AuthRepositoryProvider>
            <EarlybirdRepositoryProvider>
              {children}
            </EarlybirdRepositoryProvider>
          </AuthRepositoryProvider>
        </StorageProvider>
      </ApiProvider>
    </FirebaseProvider>
  );
}
