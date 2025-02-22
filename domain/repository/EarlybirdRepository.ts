export interface EarlybirdRepository {
    register(data: any): Promise<any>;
    getWaitingNumber(): Promise<number>;
}

