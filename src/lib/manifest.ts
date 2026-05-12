import { promises as fs } from "node:fs";
import path from "node:path";

export type Skill = {
  slug: string;
  name: string;
  description: string;
  intent: string;
  type: string;
  theme: string;
  department: string;
  triggers: string[];
  best_for: string[];
  estimated_time: string;
  path: string;
  status: string;
};

export type Workflow = {
  slug: string;
  name: string;
  description: string;
  path: string;
};

export type Department = {
  slug: string;
  name: string;
  description: string;
  skill_count: number;
  workflow_count: number;
  status: string;
};

export type Lead = {
  id: string;
  first_name: string;
  last_name: string;
  title: string;
  clinic_name: string;
  vertical: string;
  geo_tier: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  website: string;
  practitioner_count: number;
  lead_score: number;
  fit_score: number;
  intent_score: number;
  lead_tier: string;
  source: string;
  clinic_type_primary: string;
  sub_brand_alignment: string;
  provider_specialty: string;
  dnc_status: string;
  multi_location_signal: boolean;
  cash_pay_signal: boolean;
  matrix_product_fit_top3: string;
  notes: string;
  region: string;
};

export type Cron = {
  task_id: string;
  cron: string;
  description: string;
  status: string;
};

export type Approval = {
  id: string;
  title: string;
  category: string;
  who: string;
  blocker: string;
  link?: string;
};

export type Manifest = {
  version: string;
  built_at: string;
  stats: {
    skills: number;
    workflows: number;
    departments: number;
    leads: number;
    crons: number;
    approvals: number;
  };
  departments: Department[];
  skills: Skill[];
  workflows: Workflow[];
  leads: Lead[];
  crons: Cron[];
  approvals: Approval[];
};

let cached: Manifest | null = null;

export async function getManifest(): Promise<Manifest> {
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "public", "manifest.json");
  const raw = await fs.readFile(filePath, "utf-8");
  cached = JSON.parse(raw) as Manifest;
  return cached;
}

export function leadSlug(lead: Lead): string {
  return lead.id;
}
