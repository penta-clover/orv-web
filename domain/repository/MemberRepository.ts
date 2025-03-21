import { MyInfo } from "../model/MyInfo";

export interface MemberRepository {
  getMyInfo(): Promise<MyInfo>;
}