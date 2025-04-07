import { MemberRepository } from "../repository/MemberRepository";
import { MemberProfile } from "../model/MemberProfile";
import { MyInfo } from "../model/MyInfo";

export interface TemplateService {
  getTemplateData(memberId?: string): Promise<{ key: string; value: string }[]>;
}

export class TemplateServiceImpl implements TemplateService {
  constructor(private memberRepository: MemberRepository) {}

  async getTemplateData(memberId?: string): Promise<{ key: string; value: string }[]> {
    if (memberId) {
      const memberProfile: MemberProfile = await this.memberRepository.getMemberProfile(memberId);
      return [{ key: "name", value: memberProfile.nickname }];
    }

    const myInfo: MyInfo = await this.memberRepository.getMyInfo();
    return [{ key: "name", value: myInfo.nickname }];
  }
}
