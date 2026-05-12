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
  body_html: string;
};

export type Workflow = {
  slug: string;
  name: string;
  description: string;
  path: string;
  body_html: string;
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

export type Supplier = {
  id: string;
  company_name: string;
  company_type: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  website: string;
  email: string;
  primary_contact_first: string;
  primary_contact_last: string;
  primary_contact_title: string;
  fda_registration_number: string;
  fda_registration_status: string;
  dea_registration: string;
  state_pharmacy_license: string;
  state_pharmacy_status: string;
  nabp_accreditation: string;
  pcab_accreditation: string;
  iso_certification: string;
  cgmp_certified: string;
  last_audit_date: string;
  products_carried: string;
  specialties: string;
  capacity_signal: string;
  moq: string;
  pricing_tier_signal: string;
  ship_to_states: string;
  ship_to_countries: string;
  existing_clients_signal: string;
  partnership_readiness_score: number;
  partner_tier: string;
  source_url: string;
  sourced_at: string;
  notes: string;
  verify_queue: string;
  source_csv: string;
  category: string;
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

export type KBDoc = {
  slug: string;
  section: string;
  section_label: string;
  title: string;
  description: string;
  voice_safe: boolean;
  email_safe: boolean;
  provider_only: boolean;
  compliance_pre_scrubbed: boolean;
  counsel_review_required: boolean;
  source_cited: string[];
  composed_by: string[];
  last_reviewed: string;
  next_review: string;
  word_count: number;
  path: string;
  body_html: string;
};

export type Manifest = {
  version: string;
  built_at: string;
  stats: {
    skills: number;
    workflows: number;
    departments: number;
    leads: number;
    suppliers: number;
    crons: number;
    approvals: number;
    kb_docs: number;
    kb_sections: number;
    kb_words: number;
    kb_section_counts: Record<string, number>;
    supplier_categories: Record<string, number>;
    supplier_tiers: Record<string, number>;
  };
  departments: Department[];
  skills: Skill[];
  workflows: Workflow[];
  leads: Lead[];
  suppliers: Supplier[];
  crons: Cron[];
  approvals: Approval[];
  kb_docs: KBDoc[];
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
