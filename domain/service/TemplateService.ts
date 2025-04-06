import { useMemberRepository } from "@/providers/MemberRepositoryContext";
import { MemberRepository } from "../repository/MemberRepository";
import { MyInfo } from "../model/MyInfo";

export interface TemplateService {
  getTemplateData(): Promise<{ key: string; value: string }[]>;
}

export class TemplateServiceImpl implements TemplateService {
  constructor(private memberRepository: MemberRepository) {}

  async getTemplateData(): Promise<{ key: string; value: string }[]> {
    const myInfo: MyInfo = await this.memberRepository.getMyInfo();

    return [{ key: "name", value: myInfo.nickname }];
  }
}
