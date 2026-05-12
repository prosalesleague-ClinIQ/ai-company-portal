#!/usr/bin/env tsx
/**
 * Build public/manifest.json from the AI Company OS filesystem.
 *
 * Reads from:
 *   /Users/christomac/Projects/AI Company/
 *   ~/.claude/scheduled-tasks/
 *
 * Output:
 *   public/manifest.json — one self-contained payload the portal renders from.
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import os from "node:os";
import matter from "gray-matter";
import Papa from "papaparse";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

async function md2html(md: string): Promise<string> {
  const file = await remark().use(remarkGfm).use(remarkHtml).process(md);
  return String(file);
}

const AI_COMPANY =
  process.env.AI_COMPANY_PATH || "/Users/christomac/Projects/AI Company";
const SCHEDULED_TASKS_DIR = path.join(os.homedir(), ".claude", "scheduled-tasks");
const OUT_FILE = path.join(process.cwd(), "public", "manifest.json");

type SkillRecord = {
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

type WorkflowRecord = {
  slug: string;
  name: string;
  description: string;
  path: string;
  body_html: string;
};

type DepartmentRecord = {
  slug: string;
  name: string;
  description: string;
  skill_count: number;
  workflow_count: number;
  status: string;
};

type LeadRecord = {
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

type SupplierRecord = {
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

type CronRecord = {
  task_id: string;
  cron: string;
  description: string;
  status: string;
};

type ApprovalItem = {
  id: string;
  title: string;
  category: string;
  who: string;
  blocker: string;
  link?: string;
};

const SKILLS_DIR = path.join(AI_COMPANY, "_Skills Library", "Company-OS-Skills");
const SKILLS_LIBRARY = path.join(AI_COMPANY, "_Skills Library");
const WORKFLOWS_DIR = path.join(AI_COMPANY, "_Workflows");
const PROSPECTS_ROOT = path.join(
  AI_COMPANY,
  "_Logs",
  "outreach",
  "prospect-lists",
);
const SUPPLIERS_ROOT = path.join(
  AI_COMPANY,
  "_Logs",
  "supplier-discovery",
  "extracted",
);

/** Map CSV filename → category key + display label */
const SUPPLIER_CSV_CATEGORY: Record<string, string> = {
  "compounding-pharmacies-503a.csv": "compounding_pharmacy_503a",
  "compounding-pharmacies-503b.csv": "compounding_pharmacy_503b",
  "cgmp-peptide-labs-us.csv": "cgmp_peptide_lab_us",
  "cgmp-peptide-labs-international.csv": "cgmp_peptide_lab_intl",
  "iv-therapy-suppliers.csv": "iv_therapy_supplier",
  "exosomes-manufacturers.csv": "exosomes_manufacturer",
  "sarms-suppliers-research-only.csv": "sarms_supplier",
  "auxiliary-suppliers.csv": "auxiliary",
};

/** Department classification ported from build-ai-company-manifest.sh + agent-registry.md */
function classifyDepartment(slug: string): string {
  const s = slug.toLowerCase();
  if (
    s.startsWith("ea-") ||
    s === "executive-admin-toolkit" ||
    s === "meeting-magic"
  )
    return "executive";
  if (s.includes("voice-") || s.startsWith("retellai-") || s.includes("synthflow") || s.includes("deepgram"))
    return "voice-ai";
  if (
    s.startsWith("ghl-") ||
    s === "workflow-automation-builder" ||
    s === "sms-campaign-builder"
  )
    return "ghl";
  if (
    s.startsWith("ecommerce-") ||
    s.startsWith("product-") ||
    [
      "subscription-manager",
      "tax-calc",
      "payments-engine",
      "fulfillment-shipping",
      "order-lifecycle-manager",
      "inventory-manager",
    ].includes(s)
  )
    return "ecommerce";
  if (s.startsWith("formulation-") || s === "bud-calculator") return "formulation";
  if (
    [
      "ip-lead",
      "trademark-clearance",
      "patent-strategy",
      "ip-counsel-coordination",
      "product-naming-gate",
      "ip-continuous-improvement",
      "prior-art-citation-formatter",
    ].includes(s)
  )
    return "ip";
  if (
    [
      "compliance-officer",
      "compliance-qa",
      "compliance-phrase-detector",
      "security-inspector",
      "pii-redactor",
    ].includes(s)
  )
    return "compliance";
  if (
    [
      "cfo-finance",
      "bookkeeping",
      "pricing-margin",
      "price-margin-check",
      "investor-relations",
      "ghl-affiliate-manager",
      "ar-ap-automation",
      "cash-flow-monitor",
      "commission-calculator",
      "tax-strategist",
    ].includes(s)
  )
    return "finance";
  if (
    [
      "sales-revenue-lead",
      "sales-pipeline-manager",
      "outreach-writer",
      "lead-scoring",
      "discovery-call-prep",
      "closer-support",
      "sales-rep-certification-manager",
      "sales-curriculum-author",
      "sales-comp-plan-designer",
      "competitive-battlecard-builder",
      "clinic-research-agent",
    ].includes(s) ||
    s.startsWith("sales-")
  )
    return "sales";
  if (
    s.includes("customer-success") ||
    s === "account-manager" ||
    s === "customer-onboarding" ||
    s === "customer-health-scoring" ||
    s === "churn-risk-predictor"
  )
    return "customer-success";
  if (
    [
      "engineering-lead",
      "frontend-dev",
      "backend-dev",
      "database-schema",
      "devops-deployment",
      "code-qa",
      "security-inspector",
      "project-scaffolder",
    ].includes(s)
  )
    return "engineering";
  if (
    s.includes("education") ||
    s.includes("curriculum") ||
    s === "quiz-and-assessment-builder" ||
    s === "roleplay-coach-agent" ||
    s === "learner-progress-tracker" ||
    s === "resource-center-curator" ||
    s === "lms-ui-flow-optimizer"
  )
    return "education";
  if (s.includes("nexus")) return "nexus";
  if (
    s.includes("seo") ||
    s === "aeo-specialist" ||
    s === "ai-search-optimizer" ||
    s === "schema-markup-architect" ||
    s === "geo-specialist" ||
    s === "competitor-serp-monitor" ||
    s === "directory-listings-manager" ||
    s === "business-listing-manager"
  )
    return "seo";
  if (
    s.includes("hr-") ||
    s === "recruiting-pipeline" ||
    s === "comp-band-analyst" ||
    s === "performance-review"
  )
    return "hr";
  if (
    s === "content-director" ||
    s === "copywriting" ||
    s === "creative-director" ||
    s === "reputation-manager" ||
    s === "offer-positioning"
  )
    return "content";
  if (
    s === "label-design-lead" ||
    s.includes("label-") ||
    s === "packaging-designer"
  )
    return "label-design";
  if (
    s === "company-os-orchestrator" ||
    s === "pmo-operator" ||
    s === "conversation-channel-router" ||
    s === "skill-builder" ||
    s === "workflow-builder" ||
    s === "agent-cloner" ||
    s === "micro-agent-controller" ||
    s === "micro-agent-team-builder" ||
    s === "reuse-scanner"
  )
    return "meta";
  if (s === "chain-monitor" || s.includes("eval-harness")) return "observability";
  if (s === "analytics-architect") return "analytics";
  if (s === "market-research" || s === "competitor-analysis") return "research";
  return "other";
}

const DEPARTMENT_LABELS: Record<string, { name: string; description: string }> = {
  executive: {
    name: "Executive Command",
    description: "EAs for Leo (CEO) + Christo (COO) + meeting + decision support.",
  },
  "voice-ai": {
    name: "Voice AI & Conversation",
    description: "Outbound + inbound voice agents, scripts, personas, continuous improvement.",
  },
  ghl: {
    name: "GoHighLevel",
    description: "CRM architecture, workflow automation, pipelines, A2P, calendars.",
  },
  ecommerce: {
    name: "E-commerce",
    description: "Storefront, catalog, pricing, fulfillment, lifecycle marketing.",
  },
  formulation: {
    name: "Formulation",
    description: "Steve's chemistry team — market fit, design, compliance, stability, batch records.",
  },
  ip: {
    name: "Intellectual Property",
    description: "Patents, trademarks, copyrights, trade secrets, naming gate.",
  },
  compliance: {
    name: "Compliance",
    description: "503-A/B, DSHEA, MoCRA, HIPAA, TCPA, CAN-SPAM — claim discipline + reviews.",
  },
  finance: {
    name: "Finance",
    description: "CFO, bookkeeping, AR/AP, cash flow, commissions, pricing, taxes.",
  },
  sales: {
    name: "Sales & Revenue",
    description: "Pipeline, outreach, lead scoring, discovery, closer support, comp.",
  },
  "customer-success": {
    name: "Customer Success",
    description: "Onboarding, health scoring, account management, churn risk.",
  },
  engineering: {
    name: "Engineering",
    description: "Software builds — frontend, backend, DB, DevOps, QA.",
  },
  education: {
    name: "Education & Training",
    description: "Matrix Academy LMS — rep certification + provider resource center.",
  },
  nexus: {
    name: "Matrix Nexus",
    description: "Lead-gen engine: source → enrich → route → convert → measure.",
  },
  seo: {
    name: "SEO / AEO / GEO",
    description: "Organic search, voice search, generative-engine optimization.",
  },
  hr: { name: "People & HR", description: "Hiring, comp bands, performance reviews." },
  content: {
    name: "Content & Creative",
    description: "Editorial direction, copywriting, reputation, positioning.",
  },
  "label-design": {
    name: "Label Design",
    description: "Packaging artwork pipeline — vials, droppers, troches, cartons.",
  },
  meta: {
    name: "Meta / Operating System",
    description: "Orchestrators, builders, routers — the OS that runs the OS.",
  },
  observability: {
    name: "Observability & Eval",
    description: "Chain monitoring + eval harnesses across all departments.",
  },
  analytics: {
    name: "Analytics",
    description: "KPI architecture across all departments.",
  },
  research: {
    name: "Market Research",
    description: "Competitor + market + customer-avatar intelligence.",
  },
  other: { name: "Other", description: "Unclassified — pending department mapping." },
};

async function findAllSkillFiles(): Promise<string[]> {
  const found: string[] = [];
  async function walk(dir: string) {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === "node_modules" || e.name.startsWith(".")) continue;
        await walk(full);
      } else if (e.isFile() && e.name === "SKILL.md") {
        found.push(full);
      }
    }
  }
  await walk(SKILLS_LIBRARY);
  return found;
}

/** Tolerant frontmatter parse: if YAML is malformed, do a best-effort regex extraction
 *  rather than dropping the skill entirely. */
function tolerantFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  try {
    const parsed = matter(raw);
    return { data: parsed.data as Record<string, unknown>, content: parsed.content };
  } catch {
    // Best-effort: pull `name:`, `description:`, `type:`, `theme:`, `estimated_time:`
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { data: {}, content: raw };
    const fmRaw = match[1];
    const content = match[2];
    const data: Record<string, unknown> = {};
    const grab = (key: string) => {
      const re = new RegExp(`^${key}:\\s*(.+)$`, "m");
      const m2 = fmRaw.match(re);
      if (m2) data[key] = m2[1].trim().replace(/^["']|["']$/g, "");
    };
    for (const k of ["name", "description", "type", "theme", "estimated_time", "intent"]) grab(k);
    // triggers + best_for: collect lines under the key
    const listKey = (key: string): string[] => {
      const re = new RegExp(`^${key}:\\s*\\n((?:\\s*-\\s.+\\n?)+)`, "m");
      const m2 = fmRaw.match(re);
      if (!m2) return [];
      return m2[1]
        .split("\n")
        .map((l) => l.replace(/^\s*-\s*/, "").trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    };
    data.triggers = listKey("triggers");
    data.best_for = listKey("best_for");
    return { data, content };
  }
}

async function readSkillFromFile(filePath: string): Promise<SkillRecord | null> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const { data, content } = tolerantFrontmatter(raw);
    const parentDir = path.basename(path.dirname(filePath));
    const slug = String(data.name || parentDir).toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const dept = classifyDepartment(slug);
    const displayName = String(data.name || parentDir)
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const body_html = await md2html(content);
    return {
      slug,
      name: displayName,
      description: String(data.description || ""),
      intent: String(data.intent || ""),
      type: String(data.type || "specialist"),
      theme: String(data.theme || ""),
      department: dept,
      triggers: Array.isArray(data.triggers) ? (data.triggers as string[]).map(String) : [],
      best_for: Array.isArray(data.best_for) ? (data.best_for as string[]).map(String) : [],
      estimated_time: String(data.estimated_time || ""),
      path: path.relative(AI_COMPANY, filePath),
      status: "active",
      body_html,
    };
  } catch (e) {
    console.warn(`[manifest] skip ${filePath}: ${String(e).slice(0, 80)}`);
    return null;
  }
}

async function buildSkills(): Promise<SkillRecord[]> {
  const files = await findAllSkillFiles();
  const skillsBySlug = new Map<string, SkillRecord>();
  for (const filePath of files) {
    const s = await readSkillFromFile(filePath);
    if (!s) continue;
    // Prefer Company-OS-Skills version when collision occurs
    const existing = skillsBySlug.get(s.slug);
    if (!existing || filePath.includes("Company-OS-Skills")) {
      skillsBySlug.set(s.slug, s);
    }
  }
  return Array.from(skillsBySlug.values()).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

async function buildWorkflows(): Promise<WorkflowRecord[]> {
  const entries = await fs.readdir(WORKFLOWS_DIR);
  const workflowFiles = entries.filter((f) => f.endsWith(".workflow.md"));
  const out: WorkflowRecord[] = [];
  for (const f of workflowFiles) {
    const slug = f.replace(".workflow.md", "");
    const filePath = path.join(WORKFLOWS_DIR, f);
    const raw = await fs.readFile(filePath, "utf-8");
    // Workflows usually don't have frontmatter; pull first H1 + first blockquote.
    const firstLine = raw.split("\n").find((l) => l.startsWith("# "));
    const blockquote = raw
      .split("\n")
      .find((l) => l.startsWith("> "))
      ?.replace(/^> /, "");
    out.push({
      slug,
      name:
        (firstLine ? firstLine.replace(/^#\s*/, "") : slug)
          .replace(/—.*$/, "")
          .trim(),
      description: blockquote || "Workflow.",
      path: path.relative(AI_COMPANY, filePath),
      body_html: await md2html(raw),
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

async function buildDepartments(
  skills: SkillRecord[],
  workflows: WorkflowRecord[],
): Promise<DepartmentRecord[]> {
  const byDept: Record<string, number> = {};
  for (const s of skills) byDept[s.department] = (byDept[s.department] || 0) + 1;

  // Heuristic: workflow→department by name substring
  const wfByDept: Record<string, number> = {};
  for (const w of workflows) {
    const k = w.slug;
    let dept = "other";
    if (k.includes("voice")) dept = "voice-ai";
    else if (k.includes("ghl")) dept = "ghl";
    else if (k.includes("ecommerce")) dept = "ecommerce";
    else if (k.includes("formulation")) dept = "formulation";
    else if (k.includes("ip-")) dept = "ip";
    else if (k.includes("nexus")) dept = "nexus";
    else if (k.includes("customer") || k.includes("expansion") || k.includes("refund"))
      dept = "customer-success";
    else if (k.includes("seo")) dept = "seo";
    else if (k.includes("new-hire") || k.includes("certification")) dept = "hr";
    else if (k.includes("monthly-close")) dept = "finance";
    else if (k.includes("marketing-campaign") || k.includes("product-launch"))
      dept = "content";
    else if (k.includes("sales") || k.includes("pipeline") || k.includes("outbound") || k.includes("lead-to"))
      dept = "sales";
    else if (k.includes("label")) dept = "label-design";
    else if (k.includes("ai-command-center") || k.includes("software")) dept = "engineering";
    wfByDept[dept] = (wfByDept[dept] || 0) + 1;
  }

  const deps = new Set<string>([...Object.keys(byDept), ...Object.keys(wfByDept)]);
  return Array.from(deps)
    .map((slug) => ({
      slug,
      name: DEPARTMENT_LABELS[slug]?.name || slug,
      description: DEPARTMENT_LABELS[slug]?.description || "",
      skill_count: byDept[slug] || 0,
      workflow_count: wfByDept[slug] || 0,
      status: "active",
    }))
    .sort((a, b) => b.skill_count - a.skill_count);
}

async function buildLeads(): Promise<LeadRecord[]> {
  const out: LeadRecord[] = [];
  const regions = ["norcal-q2-2026", "multistate-q2-q3-2026"];
  for (const region of regions) {
    const dir = path.join(PROSPECTS_ROOT, region, "extracted");
    let files: string[] = [];
    try {
      files = (await fs.readdir(dir)).filter((f) => f.endsWith(".csv"));
    } catch {
      continue;
    }
    for (const f of files) {
      const raw = await fs.readFile(path.join(dir, f), "utf-8");
      const parsed = Papa.parse<Record<string, string>>(raw, {
        header: true,
        skipEmptyLines: true,
      });
      for (const row of parsed.data) {
        if (!row.clinic_name) continue;
        const id = `${region}-${f.replace(".csv", "")}-${row.clinic_name}-${row.city}`
          .toLowerCase()
          .replace(/[^a-z0-9-]+/g, "-")
          .slice(0, 120);
        out.push({
          id,
          first_name: row.first_name || "",
          last_name: row.last_name || "",
          title: row.title || "",
          clinic_name: row.clinic_name || "",
          vertical: row.vertical || "",
          geo_tier: row.geo_tier || "",
          city: row.city || "",
          state: row.state || "",
          phone: row.phone || "",
          email: row.email || "",
          website: row.website || "",
          practitioner_count: Number(row.practitioner_count || 0),
          lead_score: Number(row.lead_score || 0),
          fit_score: Number(row.fit_score || 0),
          intent_score: Number(row.intent_score || 0),
          lead_tier: row.lead_tier || "",
          source: row.source || "",
          clinic_type_primary: row.clinic_type_primary || "",
          sub_brand_alignment: row.sub_brand_alignment || "",
          provider_specialty: row.provider_specialty || "",
          dnc_status: row.dnc_status || "",
          multi_location_signal: row.multi_location_signal === "true",
          cash_pay_signal: row.cash_pay_signal === "true",
          matrix_product_fit_top3: row.matrix_product_fit_top3 || "",
          notes: row.notes || "",
          region,
        });
      }
    }
  }
  return out;
}

function supplierSlug(companyName: string, idx: number, csv: string): string {
  const base = companyName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
  if (base) return base;
  return `${csv.replace(".csv", "")}-${idx}`;
}

/** The source CSVs occasionally have shifted column counts (extra commas).
 *  Recover the partner_tier (P0-P3) + readiness score by scanning all values when
 *  the canonical columns are nonsense. */
function normalizeSupplierRow(row: Record<string, string>): {
  partner_tier: string;
  partnership_readiness_score: number;
} {
  const values = Object.values(row);
  let tier = (row.partner_tier || "").trim();
  let score = Number(row.partnership_readiness_score);
  const tierRe = /^P[0-3](?:\s|$)/;
  if (!tierRe.test(tier)) {
    for (const v of values) {
      const s = String(v || "").trim();
      const m = s.match(/^(P[0-3])(\b|$)/);
      if (m) {
        tier = s;
        break;
      }
    }
  }
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    for (const v of values) {
      const n = Number(String(v || "").trim());
      if (Number.isFinite(n) && n >= 30 && n <= 100) {
        score = n;
        break;
      }
    }
  }
  if (!Number.isFinite(score)) score = 0;
  return { partner_tier: tier, partnership_readiness_score: score };
}

async function buildSuppliers(): Promise<SupplierRecord[]> {
  const out: SupplierRecord[] = [];
  let files: string[] = [];
  try {
    files = (await fs.readdir(SUPPLIERS_ROOT)).filter(
      (f) =>
        f.endsWith(".csv") &&
        !f.includes("-excluded-") &&
        SUPPLIER_CSV_CATEGORY[f],
    );
  } catch {
    return out;
  }
  const seen = new Map<string, number>();
  for (const f of files) {
    const category = SUPPLIER_CSV_CATEGORY[f] || "other";
    const raw = await fs.readFile(path.join(SUPPLIERS_ROOT, f), "utf-8");
    const parsed = Papa.parse<Record<string, string>>(raw, {
      header: true,
      skipEmptyLines: true,
    });
    parsed.data.forEach((row, i) => {
      if (!row.company_name) return;
      let slug = supplierSlug(row.company_name, i, f);
      const seenCount = seen.get(slug) || 0;
      if (seenCount > 0) slug = `${slug}-${seenCount + 1}`;
      seen.set(slug, seenCount + 1);
      const norm = normalizeSupplierRow(row);
      out.push({
        id: slug,
        company_name: row.company_name || "",
        company_type: row.company_type || category,
        address: row.address || "",
        city: row.city || "",
        state: row.state || "",
        country: row.country || "",
        phone: row.phone || "",
        website: row.website || "",
        email: row.email || "",
        primary_contact_first: row.primary_contact_first || "",
        primary_contact_last: row.primary_contact_last || "",
        primary_contact_title: row.primary_contact_title || "",
        fda_registration_number: row.fda_registration_number || "",
        fda_registration_status: row.fda_registration_status || "",
        dea_registration: row.dea_registration || "",
        state_pharmacy_license: row.state_pharmacy_license || "",
        state_pharmacy_status: row.state_pharmacy_status || "",
        nabp_accreditation: row.nabp_accreditation || "",
        pcab_accreditation: row.pcab_accreditation || "",
        iso_certification: row.iso_certification || "",
        cgmp_certified: row.cgmp_certified || "",
        last_audit_date: row.last_audit_date || "",
        products_carried: row.products_carried || "",
        specialties: row.specialties || "",
        capacity_signal: row.capacity_signal || "",
        moq: row.moq || "",
        pricing_tier_signal: row.pricing_tier_signal || "",
        ship_to_states: row.ship_to_states || "",
        ship_to_countries: row.ship_to_countries || "",
        existing_clients_signal: row.existing_clients_signal || "",
        partnership_readiness_score: norm.partnership_readiness_score,
        partner_tier: norm.partner_tier || "",
        source_url: row.source_url || "",
        sourced_at: row.sourced_at || "",
        notes: row.notes || "",
        verify_queue: row.verify_queue || "",
        source_csv: f,
        category,
      });
    });
  }
  return out;
}

async function buildCrons(): Promise<CronRecord[]> {
  const out: CronRecord[] = [];
  let entries: string[] = [];
  try {
    entries = await fs.readdir(SCHEDULED_TASKS_DIR);
  } catch {
    return out;
  }
  for (const taskId of entries) {
    const dir = path.join(SCHEDULED_TASKS_DIR, taskId);
    let stat;
    try {
      stat = await fs.stat(dir);
    } catch {
      continue;
    }
    if (!stat.isDirectory()) continue;
    let cron = "";
    let description = "";
    try {
      const skillPath = path.join(dir, "SKILL.md");
      const raw = await fs.readFile(skillPath, "utf-8");
      const { data } = matter(raw);
      cron = String(data.cron || data.schedule || "");
      description = String(data.description || "");
    } catch {
      // try config.json
      try {
        const cfg = JSON.parse(
          await fs.readFile(path.join(dir, "config.json"), "utf-8"),
        );
        cron = String(cfg.cron || cfg.schedule || "");
        description = String(cfg.description || cfg.task || "");
      } catch {
        // skip
      }
    }
    out.push({ task_id: taskId, cron, description, status: "active" });
  }
  return out.sort((a, b) => a.task_id.localeCompare(b.task_id));
}

const APPROVALS_SEED: ApprovalItem[] = [
  {
    id: "a2p-10dlc-resubmission",
    title: "A2P 10DLC brand resubmission",
    category: "Compliance",
    who: "Christo / counsel",
    blocker: "Awaiting brand resubmission with corrected EIN evidence (per a2p-resubmission SOP).",
    link: "/skills/a2p-resubmission-builder",
  },
  {
    id: "ghl-custom-fields",
    title: "GHL custom-field provisioning (27 fields)",
    category: "GoHighLevel",
    who: "Christo",
    blocker: "Workflow-automation-builder needs sign-off to create custom fields in location JhHwwzVOQOZO2IFLSJAD before NorCal import.",
    link: "/skills/workflow-automation-builder",
  },
  {
    id: "wl-battlecard-counsel",
    title: "Weight-loss battlecard counsel review",
    category: "IP / Compliance",
    who: "Counsel + Leo",
    blocker: "Comparison claims need legal pass before sales reps may use in objection-handling.",
    link: "/skills/competitive-battlecard-builder",
  },
  {
    id: "pharmacy-permits-3-states",
    title: "3-state non-resident pharmacy permits",
    category: "Compliance",
    who: "Leo + counsel",
    blocker: "AZ + OR + NV non-resident permits pending — multistate Q2-Q3 outreach blocked from selling-into-AZ/OR/NV until cleared.",
  },
  {
    id: "sales-comp-plan-v1",
    title: "Sales comp plan v1 (rep + AM + AE)",
    category: "Sales / Finance",
    who: "Leo + Christo",
    blocker: "Comp-plan-designer draft ready; awaiting approval before new-hire ramp can quote OTE.",
    link: "/skills/sales-comp-plan-designer",
  },
  {
    id: "leads-verify-emails",
    title: "Lead emails marked [verify before import]",
    category: "Data",
    who: "Christo",
    blocker: "~30% of NorCal + multistate leads have placeholder emails. Run email-verification pass before GHL import.",
    link: "/leads?dnc=verify",
  },
];

async function main() {
  console.log("[manifest] reading skills...");
  const skills = await buildSkills();
  console.log(`[manifest] read ${skills.length} skills`);

  console.log("[manifest] reading workflows...");
  const workflows = await buildWorkflows();
  console.log(`[manifest] read ${workflows.length} workflows`);

  console.log("[manifest] building departments...");
  const departments = await buildDepartments(skills, workflows);
  console.log(`[manifest] derived ${departments.length} departments`);

  console.log("[manifest] reading leads...");
  const leads = await buildLeads();
  console.log(`[manifest] read ${leads.length} leads`);

  console.log("[manifest] reading suppliers...");
  const suppliers = await buildSuppliers();
  console.log(`[manifest] read ${suppliers.length} suppliers`);

  const supplierCategoryCounts: Record<string, number> = {};
  const supplierTierCounts: Record<string, number> = {};
  for (const s of suppliers) {
    supplierCategoryCounts[s.category] =
      (supplierCategoryCounts[s.category] || 0) + 1;
    if (s.partner_tier) {
      supplierTierCounts[s.partner_tier] =
        (supplierTierCounts[s.partner_tier] || 0) + 1;
    }
  }

  console.log("[manifest] reading scheduled-tasks crons...");
  const crons = await buildCrons();
  console.log(`[manifest] read ${crons.length} crons`);

  const payload = {
    version: new Date().toISOString().slice(0, 19) + "Z",
    built_at: new Date().toISOString(),
    stats: {
      skills: skills.length,
      workflows: workflows.length,
      departments: departments.length,
      leads: leads.length,
      suppliers: suppliers.length,
      crons: crons.length,
      approvals: APPROVALS_SEED.length,
      supplier_categories: supplierCategoryCounts,
      supplier_tiers: supplierTierCounts,
    },
    departments,
    skills,
    workflows,
    leads,
    suppliers,
    crons,
    approvals: APPROVALS_SEED,
  };

  await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
  await fs.writeFile(OUT_FILE, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`[manifest] wrote ${OUT_FILE}`);
  console.log(
    `[manifest] stats: ${JSON.stringify(payload.stats)}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
