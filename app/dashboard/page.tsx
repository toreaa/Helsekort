'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/utils/auth';
import { getActivePregnancy, getUpcomingReminders, calculateGestationalAge } from '@/utils/pregnancy';
import { signOut } from '@/utils/auth';
import type { Pregnancy, Reminder } from '@/lib/supabase';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [pregnancy, setPregnancy] = useState<Pregnancy | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [gestationalAge, setGestationalAge] = useState<{ weeks: number; days: number } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      const activePregnancy = await getActivePregnancy(user.id);
      setPregnancy(activePregnancy);

      if (activePregnancy) {
        const age = calculateGestationalAge(activePregnancy.last_menstruation_date);
        setGestationalAge(age);

        const upcomingReminders = await getUpcomingReminders(activePregnancy.id);
        setReminders(upcomingReminders);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Laster...</p>
      </div>
    );
  }

  if (!pregnancy) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Velkommen til Helsekort for gravide</h1>
            <p className="text-gray-600 mb-6">
              Du har ikke opprettet et aktivt svangerskap ennå.
            </p>
            <Link
              href="/dashboard/ny-graviditet"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Opprett nytt svangerskap
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Helsekort for gravide</h1>
          <button
            onClick={handleSignOut}
            className="text-gray-600 hover:text-gray-900"
          >
            Logg ut
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Svangerskapsoversikt */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Svangerskapsoversikt</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-sm text-gray-600">Svangerskapsuke</p>
              <p className="text-2xl font-bold">
                Uke {gestationalAge?.weeks}+{gestationalAge?.days}
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-sm text-gray-600">Forventet termindato</p>
              <p className="text-2xl font-bold">
                {pregnancy.ultrasound_due_date
                  ? format(new Date(pregnancy.ultrasound_due_date), 'dd.MM.yyyy', { locale: nb })
                  : format(new Date(pregnancy.expected_due_date), 'dd.MM.yyyy', { locale: nb })}
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="text-sm text-gray-600">Jordmor</p>
              <p className="text-lg font-semibold">
                {pregnancy.midwife_name || 'Ikke registrert'}
              </p>
            </div>
          </div>
        </div>

        {/* Kommende påminnelser */}
        {reminders.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Kommende kontroller</h2>
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-start p-3 bg-blue-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{reminder.title}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(reminder.reminder_date), 'dd. MMMM yyyy', { locale: nb })}
                    </p>
                    {reminder.description && (
                      <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigasjon */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/dashboard/grunninfo"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">Grunnleggende informasjon</h3>
            <p className="text-sm text-gray-600">Personalia og kontaktinformasjon</p>
          </Link>

          <Link
            href="/dashboard/kontroller"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">Kontroller</h3>
            <p className="text-sm text-gray-600">Oversikt over svangerskapskontroller</p>
          </Link>

          <Link
            href="/dashboard/ultralyd"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">Ultralyd</h3>
            <p className="text-sm text-gray-600">Ultralydundersøkelser</p>
          </Link>

          <Link
            href="/dashboard/paapinnelser"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">Påminnelser</h3>
            <p className="text-sm text-gray-600">Administrer kommende avtaler</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
