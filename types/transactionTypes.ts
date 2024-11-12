
export type MoneyRequest = {
    id: string;
    receiver: string;
    sender: string;
    message: string;
    amount: number;
    requestedAt: Date;
}

export type Transaction = {
    id: string;
    receiver: string;
    sender: string;
    message: string;
    amount: number;
    sentAt: Date;
}