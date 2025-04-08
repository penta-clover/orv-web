import { AuthRepository } from "@/domain/repository/AuthRepository";
import { Api } from "../Api";
import { Storage } from "../Storage";
import { NicknameValidation } from "@/domain/model/NicknameValidation";
import { JoinInfo } from "@/domain/model/JoinInfo";

// TODO: 예외 처리
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private api: Api, private storage: Storage) {}
  
  async validateNickname(nickname: string): Promise<NicknameValidation> {
    const requestPath = `/auth/nicknames?nickname=${encodeURIComponent(nickname)}`;
    const result = await this.api.get<NicknameValidation>(requestPath, {
      'Authorization': `Bearer ${this.storage.getAuthToken()}`
    });

    if (result.statusCode !== "200") {
      throw new Error(
        `[API Error] AuthRepositoryImpl.validateNickname\n` +
          `Headers:\n` +
          `  - Authorization: ${this.storage.getAuthToken()}\n` +
          `Parameters:\n` +
          `  - nickname: ${nickname}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }
    return result.data!;
  }

  async join(info: JoinInfo): Promise<boolean> {
    const result = await this.api.post<boolean>(`/auth/join`, info, {
      'Authorization': `Bearer ${this.storage.getAuthToken()}`
    });

    if (result.statusCode !== "200") {
      throw new Error(
        `[API Error] AuthRepositoryImpl.join\n` +
          `Headers:\n` +
          `  - Authorization: ${this.storage.getAuthToken()}\n` +
          `Parameters:\n` +
          `  - info: ${info}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }
    return result.data!;
  }
  
  getAuthToken(): string | null {
    return this.storage.getAuthToken();
  }
  
  setAuthToken(authToken: string) {
    this.storage.setAuthToken(authToken);
  }
}