import { supabase } from '@/lib/supabase';
import type { Pregnancy, Checkup, Ultrasound, BloodTest, Reminder } from '@/lib/supabase';

export async function getActivePregnancy(userId: string): Promise<Pregnancy | null> {
  const { data, error } = await supabase
    .from('pregnancies')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data;
}

export async function createPregnancy(userId: string, pregnancyData: Partial<Pregnancy>) {
  const { data, error } = await supabase
    .from('pregnancies')
    .insert([{ ...pregnancyData, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePregnancy(pregnancyId: string, updates: Partial<Pregnancy>) {
  const { data, error } = await supabase
    .from('pregnancies')
    .update(updates)
    .eq('id', pregnancyId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCheckups(pregnancyId: string): Promise<Checkup[]> {
  const { data, error } = await supabase
    .from('checkups')
    .select('*')
    .eq('pregnancy_id', pregnancyId)
    .order('checkup_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createCheckup(checkupData: Partial<Checkup>) {
  const { data, error } = await supabase
    .from('checkups')
    .insert([checkupData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCheckup(checkupId: string, updates: Partial<Checkup>) {
  const { data, error } = await supabase
    .from('checkups')
    .update(updates)
    .eq('id', checkupId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUltrasounds(pregnancyId: string): Promise<Ultrasound[]> {
  const { data, error } = await supabase
    .from('ultrasounds')
    .select('*')
    .eq('pregnancy_id', pregnancyId)
    .order('ultrasound_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createUltrasound(ultrasoundData: Partial<Ultrasound>) {
  const { data, error } = await supabase
    .from('ultrasounds')
    .insert([ultrasoundData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getBloodTests(pregnancyId: string): Promise<BloodTest[]> {
  const { data, error } = await supabase
    .from('blood_tests')
    .select('*')
    .eq('pregnancy_id', pregnancyId)
    .order('test_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createBloodTest(bloodTestData: Partial<BloodTest>) {
  const { data, error } = await supabase
    .from('blood_tests')
    .insert([bloodTestData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getReminders(pregnancyId: string): Promise<Reminder[]> {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('pregnancy_id', pregnancyId)
    .order('reminder_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getUpcomingReminders(pregnancyId: string): Promise<Reminder[]> {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('pregnancy_id', pregnancyId)
    .eq('is_completed', false)
    .gte('reminder_date', today)
    .order('reminder_date', { ascending: true })
    .limit(5);

  if (error) throw error;
  return data || [];
}

export async function createReminder(reminderData: Partial<Reminder>) {
  const { data, error } = await supabase
    .from('reminders')
    .insert([reminderData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateReminder(reminderId: string, updates: Partial<Reminder>) {
  const { data, error } = await supabase
    .from('reminders')
    .update(updates)
    .eq('id', reminderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function completeReminder(reminderId: string) {
  return updateReminder(reminderId, {
    is_completed: true,
    completed_at: new Date().toISOString(),
  });
}

// Utility function to calculate gestational age
export function calculateGestationalAge(lastMenstruationDate: string): { weeks: number; days: number } {
  const lmp = new Date(lastMenstruationDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lmp.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const weeks = Math.floor(diffDays / 7);
  const days = diffDays % 7;

  return { weeks, days };
}
