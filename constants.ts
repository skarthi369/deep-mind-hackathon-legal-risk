import { RegionCode, RegionConfig, ScraperStatus } from './types';

export const REGIONS: Record<RegionCode, RegionConfig> = {
  [RegionCode.INDIA]: {
    code: RegionCode.INDIA,
    name: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    laws: ['Indian Contract Act 1872', 'Data Protection Act 2023', 'Companies Act 2013', 'GST Rules'],
    sources: ['mca.gov.in', 'meity.gov.in', 'gst.gov.in']
  },
  [RegionCode.SINGAPORE]: {
    code: RegionCode.SINGAPORE,
    name: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    laws: ['Contract Act (Cap. 23)', 'PDPA 2012', 'Employment Act (Cap. 91)'],
    sources: ['agc.gov.sg', 'pdpc.gov.sg', 'mom.gov.sg']
  },
  [RegionCode.MALAYSIA]: {
    code: RegionCode.MALAYSIA,
    name: 'Malaysia',
    flag: '🇲🇾',
    currency: 'MYR',
    laws: ['Contract Act 1950', 'PDPA 2010', 'Employment Act 1955'],
    sources: ['agc.gov.my', 'pdp.gov.my', 'ssm.com.my']
  },
  [RegionCode.UAE]: {
    code: RegionCode.UAE,
    name: 'UAE',
    flag: '🇦🇪',
    currency: 'AED',
    laws: ['UAE Civil Code 1985', 'PDPL 2021', 'Labor Law 1980', 'Sharia Compliance Principles'],
    sources: ['moj.gov.ae', 'u.ae']
  },
  [RegionCode.HONG_KONG]: {
    code: RegionCode.HONG_KONG,
    name: 'Hong Kong',
    flag: '🇭🇰',
    currency: 'HKD',
    laws: ['Sale of Goods Ordinance', 'PDPO (Privacy)', 'Employment Ordinance'],
    sources: ['doj.gov.hk', 'pcpd.org.hk', 'labour.gov.hk']
  }
};

export const INITIAL_SCRAPER_STATUS: ScraperStatus[] = [
  { region: 'India', status: 'active', lastUpdate: '10 mins ago', docsCount: 5240 },
  { region: 'Singapore', status: 'active', lastUpdate: '2 mins ago', docsCount: 3120 },
  { region: 'Malaysia', status: 'active', lastUpdate: '1 hour ago', docsCount: 2890 },
  { region: 'UAE', status: 'syncing', lastUpdate: 'Just now', docsCount: 1540 },
  { region: 'Hong Kong', status: 'active', lastUpdate: '45 mins ago', docsCount: 2100 },
];