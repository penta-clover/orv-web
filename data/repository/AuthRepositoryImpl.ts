import { AuthRepository } from "@/domain/repository/AuthRepository";
import { Api } from "../Api";
import { NicknameValidation } from "@/domain/model/NicknameValidation";
import { JoinInfo } from "@/domain/model/JoinInfo";

// TODO: 예외 처리
export class AuthRepositoryImpl implements AuthRepository {
  constructor(private api: Api) {}
  
  async validateNickname(nickname: string): Promise<NicknameValidation> {
    const requestPath = `/auth/nicknames?nickname=${encodeURIComponent(nickname)}`;
    const result = await this.api.get<NicknameValidation>(requestPath);

    if (result.statusCode !== "200") {
      throw new Error(
        `[API Error] AuthRepositoryImpl.validateNickname\n` +
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
    const result = await this.api.post<boolean>(`/auth/join`, info);

    if (result.statusCode !== "200") {
      throw new Error(
        `[API Error] AuthRepositoryImpl.join\n` +
          `Parameters:\n` +
          `  - info: ${info}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }
    return true;
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const result = await this.api.get<unknown>(`/member/my-info`);
      return result.statusCode === "200";
    } catch {
      return false;
    }
  }

  async logout(): Promise<void> {
    const result = await this.api.post<null>(`/auth/logout`, {});

    if (result.statusCode !== "200") {
      throw new Error(
        `[API Error] AuthRepositoryImpl.logout\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }
  }
}
