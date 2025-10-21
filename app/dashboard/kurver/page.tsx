'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/utils/auth';
import { getActivePregnancy, getCheckups } from '@/utils/pregnancy';
import type { Pregnancy, Checkup } from '@/lib/supabase';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CurvesPage() {
  const router = useRouter();
  const [pregnancy, setPregnancy] = useState<Pregnancy | null>(null);
  const [checkups, setCheckups] = useState<Checkup[]>([]);
  const [loading, setLoading] = useState(true);

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
      const checkupsData = await getCheckups(activePregnancy.id);
      // Sorter etter dato (eldste først for kurven)
      const sortedCheckups = checkupsData.sort((a, b) =>
        new Date(a.checkup_date).getTime() - new Date(b.checkup_date).getTime()
      );
      setCheckups(sortedCheckups);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Laster...</p>
      </div>
    );
  }

  // Preparer data for vektkurve
  const weightData = checkups
    .filter(c => c.weight_kg !== null)
    .map(c => ({
      date: format(new Date(c.checkup_date), 'dd.MM', { locale: nb }),
      week: c.gestational_weeks || 0,
      vekt: c.weight_kg,
    }));

  // Preparer data for blodtrykkskurve
  const bloodPressureData = checkups
    .filter(c => c.blood_pressure_systolic !== null && c.blood_pressure_diastolic !== null)
    .map(c => ({
      date: format(new Date(c.checkup_date), 'dd.MM', { locale: nb }),
      week: c.gestational_weeks || 0,
      systolisk: c.blood_pressure_systolic,
      diastolisk: c.blood_pressure_diastolic,
    }));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Kurver - Vekt og Blodtrykk</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Tilbake til oversikt
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Vektkurve */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Vektutvikling</h2>
          {weightData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  label={{ value: 'Dato', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  label={{ value: 'Vekt (kg)', angle: -90, position: 'center' }}
                  domain={['dataMin - 2', 'dataMax + 2']}
                />
                <Tooltip
                  formatter={(value: any) => [`${value} kg`, 'Vekt']}
                  labelFormatter={(label) => `Dato: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="vekt"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Vekt (kg)"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-center py-8">
              Ingen vektdata registrert ennå.
            </p>
          )}

          {weightData.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-gray-600">Startvekt</p>
                <p className="text-lg font-semibold">{weightData[0].vekt} kg</p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-gray-600">Nåværende vekt</p>
                <p className="text-lg font-semibold">
                  {weightData[weightData.length - 1].vekt} kg
                </p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <p className="text-gray-600">Vektøkning</p>
                <p className="text-lg font-semibold">
                  {(weightData[weightData.length - 1].vekt! - weightData[0].vekt!).toFixed(1)} kg
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Blodtrykkskurve */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Blodtrykksutvikling</h2>
          {bloodPressureData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bloodPressureData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  label={{ value: 'Dato', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  label={{ value: 'Blodtrykk (mmHg)', angle: -90, position: 'center' }}
                  domain={[60, 180]}
                />
                <Tooltip
                  labelFormatter={(label) => `Dato: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="systolisk"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Systolisk"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="diastolisk"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Diastolisk"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-center py-8">
              Ingen blodtrykksdata registrert ennå.
            </p>
          )}

          {bloodPressureData.length > 0 && (
            <div className="mt-4 bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Referanseverdier</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Normalt blodtrykk:</p>
                  <p className="font-medium">120/80 mmHg</p>
                </div>
                <div>
                  <p className="text-gray-600">Høyt blodtrykk (kontakt lege):</p>
                  <p className="font-medium text-red-600">Over 140/90 mmHg</p>
                </div>
              </div>
            </div>
          )}

          {bloodPressureData.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-red-50 p-3 rounded">
                <p className="text-gray-600">Seneste systolisk</p>
                <p className="text-lg font-semibold">
                  {bloodPressureData[bloodPressureData.length - 1].systolisk} mmHg
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <p className="text-gray-600">Seneste diastolisk</p>
                <p className="text-lg font-semibold">
                  {bloodPressureData[bloodPressureData.length - 1].diastolisk} mmHg
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
