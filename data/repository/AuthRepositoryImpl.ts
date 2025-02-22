import { AuthRepository } from "@/domain/repository/AuthRepository";
import { Api } from "../Api";
import { Storage } from "../Storage";
import { NicknameValidation } from "@/domain/model/NicknameValidation";
import { JoinInfo } from "@/domain/model/JoinInfo";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(private api: Api, private storage: Storage) {}
  
  async validateNickname(nickname: string): Promise<NicknameValidation> {
    const requestPath = `/auth/nicknames?nickname=${encodeURIComponent(nickname)}`;
    const result = await this.api.get<NicknameValidation>(requestPath);
    return result.data;
  }
  
  async join(info: JoinInfo): Promise<boolean> {
    const result = await this.api.post<boolean>(`/auth/join`, info, {
      'Authorization': `Bearer ${this.storage.getAuthToken()}`
    });
    return result.data;
  }
  
  getAuthToken(): string | null {
    return this.storage.getAuthToken();
  }
  
  setAuthToken(authToken: string) {
    this.storage.setAuthToken(authToken);
  }
}