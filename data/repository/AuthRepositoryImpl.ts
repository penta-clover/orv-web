import { AuthRepository } from "@/domain/repository/AuthRepository";
import { Api } from "../Api";
import { NicknameValidation } from "@/domain/model/NicknameValidation";
import { JoinInfo } from "@/domain/model/JoinInfo";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private api: Api) {}
  
  async validateNickname(nickname: string): Promise<NicknameValidation> {
    const requestPath = `/auth/nicknames?nickname=${encodeURIComponent(nickname)}`;
    const result = await this.api.get<NicknameValidation>(requestPath);
    // ..?
    return result.data;
  }
  
  async join(info: JoinInfo): Promise<boolean> {
    const result = await this.api.post<boolean>(`/auth/join`, info);
    return result.data;
  }
}