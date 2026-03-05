export interface CheckLogs {
    severity: string;
    affectedComponent: string;
    rootCauses: string[];
    solutions: string[];
    fixCommands: string[];
    confidenceScore: number;
}