import { NicknameValidation } from "../model/NicknameValidation";
import { JoinInfo } from "../model/JoinInfo";
import { ApiResult } from '@/data/ApiResult';

export interface AuthRepository {
  validateNickname(nickname: string): Promise<ApiResult<NicknameValidation>>;
  join(info: JoinInfo, authToken: string): Promise<ApiResult<boolean>>;
  getAuthToken(): string | null;
  setAuthToken(authToken: string): void;
}