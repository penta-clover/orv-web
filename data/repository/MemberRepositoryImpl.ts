import { MemberRepository } from "@/domain/repository/MemberRepository";
import { Api } from "../Api";
import { MyInfo } from "@/domain/model/MyInfo";
import { MemberProfile } from "@/domain/model/MemberProfile";

// TODO: 예외 처리
export class MemberRepositoryImpl implements MemberRepository {
  constructor(private api: Api) {}

  async getMyInfo(): Promise<MyInfo> {
    const result = await this.api.get<MyInfo>(`/member/my-info`);

    if (result.statusCode !== "200" || result.data === null) {
      throw new Error(
        `[API Error] MemberRepositoryImpl.getMyInfo\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }
    
    return result.data;
  }

  async getMemberProfile(memberId: string): Promise<MemberProfile> {
    const result = await this.api.get<MemberProfile>(`/member/${memberId}/profile`);

    if (result.statusCode !== "200" || result.data === null) {
      throw new Error(
        `[API Error] MemberRepositoryImpl.getMemberProfile\n` +
          `Parameters:\n` +
          `  - memberId: ${memberId}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }

    return result.data;
  }
}
