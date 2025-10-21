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

export default function CheckupsPage() {
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
      setCheckups(checkupsData);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Kontroller</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Tilbake til oversikt
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/dashboard/kontroller/ny"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            + Legg til ny kontroll
          </Link>
        </div>

        {checkups.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Ingen kontroller registrert ennå.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {checkups.map((checkup) => (
              <div key={checkup.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {checkup.checkup_type || 'Kontroll'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {format(new Date(checkup.checkup_date), 'dd. MMMM yyyy', { locale: nb })}
                      {checkup.gestational_weeks !== null && (
                        <span className="ml-2">
                          (Uke {checkup.gestational_weeks}+{checkup.gestational_days || 0})
                        </span>
                      )}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/kontroller/${checkup.id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Rediger
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {checkup.weight_kg && (
                    <div>
                      <p className="text-gray-600">Vekt</p>
                      <p className="font-medium">{checkup.weight_kg} kg</p>
                    </div>
                  )}
                  {checkup.blood_pressure_systolic && checkup.blood_pressure_diastolic && (
                    <div>
                      <p className="text-gray-600">Blodtrykk</p>
                      <p className="font-medium">
                        {checkup.blood_pressure_systolic}/{checkup.blood_pressure_diastolic}
                      </p>
                    </div>
                  )}
                  {checkup.symphysis_fundal_height_cm && (
                    <div>
                      <p className="text-gray-600">Symfyse-fundus</p>
                      <p className="font-medium">{checkup.symphysis_fundal_height_cm} cm</p>
                    </div>
                  )}
                  {checkup.urine_protein && (
                    <div>
                      <p className="text-gray-600">Urin protein</p>
                      <p className="font-medium">{checkup.urine_protein}</p>
                    </div>
                  )}
                </div>

                {checkup.notes && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">Notater:</p>
                    <p className="text-sm">{checkup.notes}</p>
                  </div>
                )}

                {checkup.performed_by && (
                  <p className="text-sm text-gray-500 mt-2">
                    Utført av: {checkup.performed_by}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
