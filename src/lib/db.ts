import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  answers: {
    turnover?: string;
    currentUsage?: string;
    listSize?: string;
    challenge?: string;
  };
  status: "qualified" | "disqualified";
  createdAt: string;
};

const DB_FILE = path.join(process.cwd(), "db_leads.json");

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// Helper to parse answers if stored as string/text
const parseAnswers = (answers: any) => {
  if (!answers) return {};
  if (typeof answers === "string") {
    try {
      return JSON.parse(answers);
    } catch (e) {
      console.warn("Failed to parse answers JSON string:", e);
      return {};
    }
  }
  return answers;
};

// Helper to read leads
export async function readLeads(): Promise<Lead[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("createdAt", { ascending: false });

      if (error) {
        // Fallback or log if table doesn't exist
        console.warn("Supabase read error, checking columns or fallback:", error.message);
        // Try snake_case fallback just in case the table was created with created_at
        const { data: dataSnake, error: errorSnake } = await supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });
          
        if (!errorSnake && dataSnake) {
          return dataSnake.map(item => ({
            id: item.id,
            name: item.name,
            email: item.email,
            phone: item.phone,
            website: item.website,
            answers: parseAnswers(item.answers),
            status: item.status,
            createdAt: item.createdAt || item.created_at || new Date().toISOString()
          })) as Lead[];
        }
        throw error;
      }
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        website: item.website,
        answers: parseAnswers(item.answers),
        status: item.status,
        createdAt: item.createdAt || item.created_at || new Date().toISOString()
      })) as Lead[];
    } catch (e) {
      console.warn("Supabase fetch failed, falling back to local JSON file:", e);
    }
  }

  // Fallback to local JSON file
  try {
    if (!fs.existsSync(DB_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data) as Lead[];
  } catch (error) {
    console.error("Error reading database file:", error);
    return [];
  }
}

// Add a new lead to the database
export async function addLead(leadData: Omit<Lead, "id" | "createdAt">): Promise<Lead> {
  const id = Math.random().toString(36).substring(2, 9);
  const createdAt = new Date().toISOString();
  const newLead: Lead = {
    ...leadData,
    id,
    createdAt,
  };

  if (supabase) {
    // Insert with both keys to support both table schemas (createdAt vs created_at)
    const insertData = {
      id,
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      website: leadData.website,
      answers: leadData.answers,
      status: leadData.status,
      createdAt,
      created_at: createdAt
    };
    
    const { error } = await supabase.from("leads").insert([insertData]);
    if (error) {
      console.warn("Supabase insert error, trying standard columns:", error.message);
      // Retry with standard camelCase only, or standard snake_case only
      const camelData = { id, name: leadData.name, email: leadData.email, phone: leadData.phone, website: leadData.website, answers: leadData.answers, status: leadData.status, createdAt };
      const { error: errorCamel } = await supabase.from("leads").insert([camelData]);
      if (errorCamel) {
        const snakeData = { id, name: leadData.name, email: leadData.email, phone: leadData.phone, website: leadData.website, answers: leadData.answers, status: leadData.status, created_at: createdAt };
        const { error: errorSnake } = await supabase.from("leads").insert([snakeData]);
        if (errorSnake) {
          throw new Error(`Supabase insert failed: ${errorSnake.message}`);
        }
      }
    }
    return newLead;
  }

  // Fallback to local JSON file (only when Supabase is not configured)
  try {
    let leads: Lead[] = [];
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      leads = JSON.parse(data) as Lead[];
    }
    leads.unshift(newLead);
    fs.writeFileSync(DB_FILE, JSON.stringify(leads, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to database file:", error);
    throw error;
  }

  return newLead;
}
