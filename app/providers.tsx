import { ApiProvider } from "@/providers/ApiContext";
import { ArchiveRepositoryProvider } from "@/providers/ArchiveRepositoryContext";
import { AuthRepositoryProvider } from "@/providers/AuthRepositoryContext";
import { EarlybirdRepositoryProvider } from "@/providers/EarlybirdRepositoryContext";
import { FirebaseProvider } from "@/providers/FirebaseContext";
import { MemberRepositoryProvider } from "@/providers/MemberRepositoryContext";
import { StoryboardRepositoryProvider } from "@/providers/StoryboardRepositoryContext";
import { StorageProvider } from "@/providers/StorageContext";
import { TermRepositoryProvider } from "@/providers/TermRepositoryContext";
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
                  <TermRepositoryProvider>
                    <StoryboardRepositoryProvider>
                      {children}
                    </StoryboardRepositoryProvider>
                  </TermRepositoryProvider>
                </MemberRepositoryProvider>
              </ArchiveRepositoryProvider>
            </EarlybirdRepositoryProvider>
          </AuthRepositoryProvider>
        </StorageProvider>
      </ApiProvider>
    </FirebaseProvider>
  );
}
