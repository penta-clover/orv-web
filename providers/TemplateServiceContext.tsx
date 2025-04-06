"use client";

import { MemberRepository } from "@/domain/repository/MemberRepository";
import {
  TemplateService,
  TemplateServiceImpl,
} from "@/domain/service/TemplateService";
import { createContext, ReactNode, useContext } from "react";
import { useMemberRepository } from "./MemberRepositoryContext";

const TemplateServiceContext = createContext<TemplateService | null>(null);

interface TemplateServiceProviderProps {
  children: ReactNode;
}

export function TemplateServiceProvider({
  children,
}: TemplateServiceProviderProps) {
  const memberRepository: MemberRepository = useMemberRepository();

  const templateService: TemplateService = new TemplateServiceImpl(
    memberRepository
  );

  return (
    <TemplateServiceContext.Provider value={templateService}>
      {children}
    </TemplateServiceContext.Provider>
  );
}

export function useTemplateService(): TemplateService {
  const templateService = useContext(TemplateServiceContext);
  if (!templateService) {
    throw new Error("TemplateService not found");
  }
  return templateService;
}