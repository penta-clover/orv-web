import { AuthRepository } from "@/domain/repository/AuthRepository";
import { Api } from "../Api";
import { ApiResult } from '../ApiResult';
import { Storage } from "../Storage";
import { NicknameValidation } from "@/domain/model/NicknameValidation";
import { JoinInfo } from "@/domain/model/JoinInfo";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private api: Api, private storage: Storage) {}
  
  async validateNickname(nickname: string): Promise<ApiResult<NicknameValidation>> {
    const requestPath = `/auth/nicknames?nickname=${encodeURIComponent(nickname)}`;
    const result = await this.api.get<NicknameValidation>(requestPath);
    return result;
  }
  
  async join(info: JoinInfo, authToken: string): Promise<ApiResult<boolean>> {
    const result = await this.api.post<boolean>(`/auth/join`, info, {
      'Authorization': `Bearer ${authToken}`
    });
    return result;
  }
  
  getAuthToken(): string | null {
    return this.storage.get("authToken");
  }
  
  setAuthToken(authToken: string) {
    this.storage.set("authToken", authToken);
  }
}