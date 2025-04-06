import { ApiProvider } from "@/providers/ApiContext";
import { ArchiveRepositoryProvider } from "@/providers/ArchiveRepositoryContext";
import { AuthRepositoryProvider } from "@/providers/AuthRepositoryContext";
import { EarlybirdRepositoryProvider } from "@/providers/EarlybirdRepositoryContext";
import { FirebaseProvider } from "@/providers/FirebaseContext";
import { MemberRepositoryProvider } from "@/providers/MemberRepositoryContext";
import { ReservationRepositoryProvider } from "@/providers/ReservationRepositoryContext";
import { StorageProvider } from "@/providers/StorageContext";
import { StoryboardRepositoryProvider } from "@/providers/StoryboardRepositoryContext";
import { TemplateServiceProvider } from "@/providers/TemplateServiceContext";
import { TermRepositoryProvider } from "@/providers/TermRepositoryContext";
import { TopicRepositoryProvider } from "@/providers/TopicRepositoryContext";
import { TempBlobRepositoryProvider } from "@/providers/TempBlobRepositoryContext";
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
                    <TopicRepositoryProvider>
                      <StoryboardRepositoryProvider>
                        <ReservationRepositoryProvider>
                          <TemplateServiceProvider>
                            <TempBlobRepositoryProvider>
                              {children}
                            </TempBlobRepositoryProvider>
                          </TemplateServiceProvider>
                        </ReservationRepositoryProvider>
                      </StoryboardRepositoryProvider>
                    </TopicRepositoryProvider>
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
