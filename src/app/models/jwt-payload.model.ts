export interface JwtPayload {
  roles?: string[];
  exp?: number;
  sub?: string;
}