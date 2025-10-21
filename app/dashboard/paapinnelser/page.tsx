'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/utils/auth';
import { getActivePregnancy, getReminders, completeReminder, createReminder } from '@/utils/pregnancy';
import type { Pregnancy, Reminder } from '@/lib/supabase';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import Link from 'next/link';

export default function RemindersPage() {
  const router = useRouter();
  const [pregnancy, setPregnancy] = useState<Pregnancy | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reminder_date: '',
    reminder_type: 'Kontroll',
    title: '',
    description: '',
    location: '',
  });

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
      if (!activePregnancy) {
        router.push('/dashboard');
        return;
      }

      setPregnancy(activePregnancy);
      const remindersData = await getReminders(activePregnancy.id);
      setReminders(remindersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (reminderId: string) => {
    try {
      await completeReminder(reminderId);
      await loadData();
    } catch (error) {
      console.error('Error completing reminder:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pregnancy) return;

    try {
      await createReminder({
        pregnancy_id: pregnancy.id,
        ...formData,
      });
      setFormData({
        reminder_date: '',
        reminder_type: 'Kontroll',
        title: '',
        description: '',
        location: '',
      });
      setShowForm(false);
      await loadData();
    } catch (error) {
      console.error('Error creating reminder:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Laster...</p>
      </div>
    );
  }

  const upcomingReminders = reminders.filter((r) => !r.is_completed);
  const completedReminders = reminders.filter((r) => r.is_completed);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Påminnelser</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Tilbake til oversikt
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Avbryt' : '+ Legg til påminnelse'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Ny påminnelse</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dato *
                  </label>
                  <input
                    type="date"
                    value={formData.reminder_date}
                    onChange={(e) =>
                      setFormData({ ...formData, reminder_date: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    value={formData.reminder_type}
                    onChange={(e) =>
                      setFormData({ ...formData, reminder_type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Kontroll">Kontroll</option>
                    <option value="Ultralyd">Ultralyd</option>
                    <option value="Blodprøve">Blodprøve</option>
                    <option value="Annet">Annet</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tittel *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Beskrivelse
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sted
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Lagre påminnelse
              </button>
            </form>
          </div>
        )}

        {/* Kommende påminnelser */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Kommende</h2>
          {upcomingReminders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">Ingen kommende påminnelser.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-white rounded-lg shadow p-4 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded">
                        {reminder.reminder_type}
                      </span>
                      <h3 className="font-semibold">{reminder.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      {format(new Date(reminder.reminder_date), 'dd. MMMM yyyy', { locale: nb })}
                    </p>
                    {reminder.description && (
                      <p className="text-sm text-gray-600 mt-1">{reminder.description}</p>
                    )}
                    {reminder.location && (
                      <p className="text-sm text-gray-500 mt-1">📍 {reminder.location}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleComplete(reminder.id)}
                    className="ml-4 px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                  >
                    Ferdig
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fullførte påminnelser */}
        {completedReminders.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Fullført</h2>
            <div className="space-y-3">
              {completedReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="bg-gray-50 rounded-lg p-4 opacity-60"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-gray-200 text-gray-700 rounded">
                      {reminder.reminder_type}
                    </span>
                    <h3 className="font-semibold line-through">{reminder.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {format(new Date(reminder.reminder_date), 'dd. MMMM yyyy', { locale: nb })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
