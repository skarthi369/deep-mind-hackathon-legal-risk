export enum RegionCode {
  INDIA = 'IN',
  SINGAPORE = 'SG',
  MALAYSIA = 'MY',
  UAE = 'AE',
  HONG_KONG = 'HK'
}

export interface RegionConfig {
  code: RegionCode;
  name: string;
  flag: string;
  currency: string;
  laws: string[];
  sources: string[];
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface RedFlag {
  issue: string;
  law_violated: string;
  severity: RiskLevel;
  explanation: string;
  suggested_fix: string;
}

export interface AnalysisResult {
  risk_score: number;
  risk_rating: string;
  summary: string;
  red_flags: RedFlag[];
  compliant_points: string[];
  applicable_laws_identified: string[];
}

export interface ScraperStatus {
  region: string;
  status: 'active' | 'syncing';
  lastUpdate: string;
  docsCount: number;
}