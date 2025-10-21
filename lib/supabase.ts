import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type Pregnancy = {
  id: string;
  user_id: string;
  last_menstruation_date: string;
  expected_due_date: string;
  ultrasound_due_date: string | null;
  civil_status: string | null;
  education: string | null;
  occupation: string | null;
  workplace: string | null;
  country_background: string | null;
  language: string | null;
  interpreter_needed: boolean;
  gp_name: string | null;
  gp_phone: string | null;
  midwife_name: string | null;
  midwife_phone: string | null;
  is_first_pregnancy: boolean;
  previous_pregnancies_count: number;
  previous_births_count: number;
  diet_notes: string | null;
  takes_folic_acid: boolean;
  physical_activity: string | null;
  smoking: boolean;
  snus: boolean;
  alcohol: boolean;
  other_substances: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PreviousPregnancy = {
  id: string;
  pregnancy_id: string;
  year: number | null;
  birth_weight: number | null;
  gestational_weeks: number | null;
  gestational_days: number | null;
  breastfeeding_months: number | null;
  was_premature: boolean;
  had_preeclampsia: boolean;
  complications: string | null;
  created_at: string;
};

export type MedicalCondition = {
  id: string;
  pregnancy_id: string;
  condition_name: string;
  description: string | null;
  requires_followup: boolean;
  created_at: string;
};

export type Checkup = {
  id: string;
  pregnancy_id: string;
  checkup_date: string;
  gestational_weeks: number | null;
  gestational_days: number | null;
  checkup_type: string | null;
  location: string | null;
  performed_by: string | null;
  weight_kg: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  symphysis_fundal_height_cm: number | null;
  urine_protein: string | null;
  urine_glucose: string | null;
  urine_bacteria: boolean | null;
  hemoglobin: number | null;
  fetal_heartbeat: boolean | null;
  fetal_heartbeat_rate: number | null;
  fetal_movements: string | null;
  notes: string | null;
  next_appointment_date: string | null;
  created_at: string;
  updated_at: string;
};

export type Ultrasound = {
  id: string;
  pregnancy_id: string;
  ultrasound_date: string;
  gestational_weeks: number;
  gestational_days: number | null;
  ultrasound_type: string | null;
  crown_rump_length_mm: number | null;
  biparietal_diameter_mm: number | null;
  head_circumference_mm: number | null;
  abdominal_circumference_mm: number | null;
  femur_length_mm: number | null;
  estimated_fetal_weight_g: number | null;
  nuchal_translucency_mm: number | null;
  placenta_location: string | null;
  placenta_notes: string | null;
  amniotic_fluid_level: string | null;
  number_of_fetuses: number;
  findings: string | null;
  anomalies_detected: boolean;
  nipt_consent_given: boolean | null;
  performed_by: string | null;
  location: string | null;
  created_at: string;
};

export type BloodTest = {
  id: string;
  pregnancy_id: string;
  test_date: string;
  test_type: string;
  blood_type: string | null;
  hemoglobin_value: number | null;
  antibodies_detected: boolean | null;
  antibody_details: string | null;
  rubella_immune: boolean | null;
  hepatitis_b: string | null;
  hiv: string | null;
  syphilis: string | null;
  test_result: string | null;
  notes: string | null;
  created_at: string;
};

export type Reminder = {
  id: string;
  pregnancy_id: string;
  reminder_date: string;
  reminder_type: string;
  title: string;
  description: string | null;
  location: string | null;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
};
