import { TermRepository } from "@/domain/repository/TermRepository";
import { Api } from "../Api";

export class TermRepositoryImpl implements TermRepository {
  constructor(private api: Api) {}

  async updateTermAgreement(term: string, agreement: boolean): Promise<string> {
    const result = await this.api.post<string>(
      "/term/agreement",
      {
        term: term,
        value: agreement ? "Y" : "N",
      }
    );

    if (result.statusCode !== "201" || result.data === null) {
      throw new Error(
        `[API Error] TermRepositoryImpl.updateTermAgreement\n` +
          `Parameters:\n` +
          `  - term: ${term}\n` +
          `  - agreement: ${agreement}\n` +
          `Response:\n` +
          `  - Status: ${result.statusCode}\n` +
          `  - Message: ${result.message}`
      );
    }

    return result.data;
  }
}
