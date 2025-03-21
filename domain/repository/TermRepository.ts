export interface TermRepository {
  updateTermAgreement(term: string, agreement: boolean): Promise<string>;
}
