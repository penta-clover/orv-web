import { MemberProfile } from "../model/MemberProfile";
import { MyInfo } from "../model/MyInfo";

export interface MemberRepository {
  getMyInfo(): Promise<MyInfo>;
  getMemberProfile(memberId: string): Promise<MemberProfile>;
}