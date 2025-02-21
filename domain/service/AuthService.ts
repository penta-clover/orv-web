import { AuthRepository } from "../repository/AuthRepository";
import { NicknameValidation } from "@/domain/model/NicknameValidation";
import { JoinInfo } from "@/domain/model/JoinInfo";

export class AuthService {
  constructor(private authRepository: AuthRepository) {}
  
  async validateNickname(nickname: string): Promise<NicknameValidation> {
    const result = await this.authRepository.validateNickname(nickname);
    if (result.statusCode !== "200") throw new Error(result.message);
    return result.data;
  }
  
  async join(info: JoinInfo): Promise<boolean> {
    const authToken = this.authRepository.getAuthToken();
    const result = await this.authRepository.join(info, authToken!);
    if (result.statusCode !== "200") throw new Error(result.message);
    return result.data;
  }
  
  setToken(authToken: string) {
    this.authRepository.setAuthToken(authToken);
  }
}