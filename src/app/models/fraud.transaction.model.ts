export interface FraudTransaction {
    transactionDate: string | null;
    amount: number;
    merchantID: number;
    transactionType: string;
    location: string;
}