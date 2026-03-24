export interface FraudDetectionResponseDto {
    fraud_probability: number;
    is_fraud: boolean;
    explanation: string[];
}