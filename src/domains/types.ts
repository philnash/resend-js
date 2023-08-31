export type DomainRegion = "us-east-1" | "eu-west-1" | "sa-east-1";

export type CreateDomainOptions = {
  name: string;
  region?: DomainRegion;
};

export type DomainNameservers =
  | "Amazon Route 53"
  | "Cloudflare"
  | "Digital Ocean"
  | "GoDaddy"
  | "Google Domains"
  | "Namecheap"
  | "Unidentified"
  | "Vercel";

export type DomainStatus =
  | "pending"
  | "verified"
  | "failed"
  | "temporary_failure"
  | "not_started";

export type DomainRecords = DomainSpfRecord | DomainDkimRecord;

export interface DomainSpfRecord {
  record: "SPF";
  name: string;
  value: string;
  type: "MX" | "TXT";
  ttl: string;
  status: DomainStatus;
  routing_policy?: string;
  priority?: number;
  proxy_status?: "enable" | "disable";
}

export interface DomainDkimRecord {
  record: "DKIM";
  name: string;
  value: string;
  type: "CNAME";
  ttl: string;
  status: DomainStatus;
  routing_policy?: string;
  priority?: number;
  proxy_status?: "enable" | "disable";
}

export type CreateDomainResponse = {
  id: string;
  name: string;
  created_at: Date;
  status: DomainStatus;
  records: Array<DomainRecords>;
  region: DomainRegion;
};

export type GetDomainResponse = {
  object: "domain";
  id: string;
  name: string;
  status: DomainStatus;
  created_at: Date;
  region: DomainRegion;
};
