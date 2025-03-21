import { ApiProvider } from "@/providers/ApiContext";
import { ArchiveRepositoryProvider } from "@/providers/ArchiveRepositoryContext";
import { AuthRepositoryProvider } from "@/providers/AuthRepositoryContext";
import { EarlybirdRepositoryProvider } from "@/providers/EarlybirdRepositoryContext";
import { FirebaseProvider } from "@/providers/FirebaseContext";
import { MemberRepositoryProvider } from "@/providers/MemberRepositoryContext";
import { StorageProvider } from "@/providers/StorageContext";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <FirebaseProvider>
      <ApiProvider>
        <StorageProvider>
          <AuthRepositoryProvider>
            <EarlybirdRepositoryProvider>
              <ArchiveRepositoryProvider>
                <MemberRepositoryProvider>
                  {children}
                </MemberRepositoryProvider>
              </ArchiveRepositoryProvider>
            </EarlybirdRepositoryProvider>
          </AuthRepositoryProvider>
        </StorageProvider>
      </ApiProvider>
    </FirebaseProvider>
  );
}
