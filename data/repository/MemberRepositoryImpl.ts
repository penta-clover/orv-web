import { MemberRepository } from "@/domain/repository/MemberRepository";
import { Api } from "../Api";
import { Storage } from "../Storage";
import { MyInfo } from "@/domain/model/MyInfo";
import { MemberProfile } from "@/domain/model/MemberProfile";

// TODO: 예외 처리
export class MemberRepositoryImpl implements MemberRepository {
  constructor(private api: Api, private storage: Storage) {}

  async getMyInfo(): Promise<MyInfo> {
    const result = await this.api.get<MyInfo>(`/member/my-info`, {
      Authorization: `Bearer ${this.storage.getAuthToken()}`,
    });

    if (result.statusCode !== "200" || result.data === null) {
      throw new Error(
        `[API Error] MemberRepositoryImpl.getMyInfo\n` +
          `Headers:\n` +
          `  - Authorization: ${this.storage.getAuthToken()}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }
    
    return result.data;
  }

  async getMemberProfile(memberId: string): Promise<MemberProfile> {
    const result = await this.api.get<MemberProfile>(`/member/${memberId}/profile`, {
      Authorization: `Bearer ${this.storage.getAuthToken()}`,
    });

    if (result.statusCode !== "200" || result.data === null) {
      throw new Error(
        `[API Error] MemberRepositoryImpl.getMemberProfile\n` +
          `Headers:\n` +
          `  - Authorization: ${this.storage.getAuthToken()}\n` +
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
