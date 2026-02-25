export interface RCComplianceResultsDto {
    id: number; //Compliance result ID
    batchId: number;
    batchNo: string;
    productName: string;
    uploadedBy: string;
    uploadDate: string;
    status: string;

    score: number;
    riskLevel: string;
    findings: string;
    reviewedAt: string; // ISO date string
}
