import { TermRepository } from "@/domain/repository/TermRepository";
import { Api } from "../Api";
import { Storage } from "../Storage";

export class TermRepositoryImpl implements TermRepository {
  constructor(private api: Api, private storage: Storage) {}

  async updateTermAgreement(term: string, agreement: boolean): Promise<string> {
    const result = await this.api.post<string>(
      "/term/agreement",
      {
        term: term,
        value: agreement ? "Y" : "N",
      },
      {
        Authorization: `Bearer ${this.storage.getAuthToken()}`,
      }
    );

    if (result.statusCode !== "201" || result.data === null) {
      throw new Error(result.message);
    }

    return result.data;
  }
}
