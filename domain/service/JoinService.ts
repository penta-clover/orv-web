import { AuthRepository } from "../repository/AuthRepository";
import { NicknameValidation } from "@/domain/model/NicknameValidation";
import { JoinInfo } from "@/domain/model/JoinInfo";

export class JoinService {
  constructor(private authRepository: AuthRepository) {}
  
  async validateNickname(nickname: string): Promise<NicknameValidation> {
    return this.authRepository.validateNickname(nickname);
  }
  
  async join(info: JoinInfo): Promise<boolean> {
    return this.authRepository.join(info);
  }
}