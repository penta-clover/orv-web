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
      throw new Error(result.message);
    }

    return result.data;
  }

  async getMemberProfile(memberId: string): Promise<MemberProfile> {
    const result = await this.api.get<MemberProfile>(`/member/${memberId}/profile`);

    if (result.statusCode !== "200" || result.data === null) {
      throw new Error(result.message);
    }

    return result.data;
  }
}
