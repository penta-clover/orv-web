import { NicknameValidation } from "../model/NicknameValidation";
import { JoinInfo } from "../model/JoinInfo";

export interface AuthRepository {
  validateNickname(nickname: string): Promise<NicknameValidation>;
  join(info: JoinInfo): Promise<boolean>;
  getAuthToken(): string | null;
  setAuthToken(authToken: string): void;
  isTokenValid(): boolean;
}