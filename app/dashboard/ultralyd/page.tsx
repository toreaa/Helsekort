'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/utils/auth';
import { getActivePregnancy, getUltrasounds } from '@/utils/pregnancy';
import type { Pregnancy, Ultrasound } from '@/lib/supabase';
import { format } from 'date-fns';
import { nb } from 'date-fns/locale';
import Link from 'next/link';

export default function UltrasoundPage() {
  const router = useRouter();
  const [pregnancy, setPregnancy] = useState<Pregnancy | null>(null);
  const [ultrasounds, setUltrasounds] = useState<Ultrasound[]>([]);
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
      const ultrasoundsData = await getUltrasounds(activePregnancy.id);
      setUltrasounds(ultrasoundsData);
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
          <h1 className="text-2xl font-bold text-gray-900">Ultralydundersøkelser</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Tilbake til oversikt
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {ultrasounds.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Ingen ultralydundersøkelser registrert ennå.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {ultrasounds.map((ultrasound) => (
              <div key={ultrasound.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {ultrasound.ultrasound_type || 'Ultralydundersøkelse'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {format(new Date(ultrasound.ultrasound_date), 'dd. MMMM yyyy', { locale: nb })}
                      {' - '}
                      Uke {ultrasound.gestational_weeks}+{ultrasound.gestational_days || 0}
                    </p>
                  </div>
                </div>

                {/* Målinger */}
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Målinger</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {ultrasound.crown_rump_length_mm && (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600">CRL (Sete-isse)</p>
                        <p className="font-medium">{ultrasound.crown_rump_length_mm} mm</p>
                      </div>
                    )}
                    {ultrasound.biparietal_diameter_mm && (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600">BPD</p>
                        <p className="font-medium">{ultrasound.biparietal_diameter_mm} mm</p>
                      </div>
                    )}
                    {ultrasound.head_circumference_mm && (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600">Hodeomkrets (HC)</p>
                        <p className="font-medium">{ultrasound.head_circumference_mm} mm</p>
                      </div>
                    )}
                    {ultrasound.abdominal_circumference_mm && (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600">Mageomkrets (AC)</p>
                        <p className="font-medium">{ultrasound.abdominal_circumference_mm} mm</p>
                      </div>
                    )}
                    {ultrasound.femur_length_mm && (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600">Lårbenslengde (FL)</p>
                        <p className="font-medium">{ultrasound.femur_length_mm} mm</p>
                      </div>
                    )}
                    {ultrasound.estimated_fetal_weight_g && (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600">Estimert vekt</p>
                        <p className="font-medium">{ultrasound.estimated_fetal_weight_g} g</p>
                      </div>
                    )}
                    {ultrasound.nuchal_translucency_mm && (
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600">Nakkefold</p>
                        <p className="font-medium">{ultrasound.nuchal_translucency_mm} mm</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Morkake og fostervann */}
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {ultrasound.placenta_location && (
                    <div>
                      <p className="text-sm text-gray-600">Morkake plassering:</p>
                      <p className="font-medium">{ultrasound.placenta_location}</p>
                    </div>
                  )}
                  {ultrasound.amniotic_fluid_level && (
                    <div>
                      <p className="text-sm text-gray-600">Fostervann:</p>
                      <p className="font-medium">{ultrasound.amniotic_fluid_level}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Antall fostre:</p>
                    <p className="font-medium">{ultrasound.number_of_fetuses}</p>
                  </div>
                </div>

                {/* Funn */}
                {ultrasound.findings && (
                  <div className="mb-4 bg-blue-50 p-4 rounded">
                    <p className="text-sm text-gray-600 mb-1">Funn:</p>
                    <p className="text-sm">{ultrasound.findings}</p>
                  </div>
                )}

                {/* Avvik */}
                {ultrasound.anomalies_detected && (
                  <div className="mb-4 bg-yellow-50 border border-yellow-200 p-4 rounded">
                    <p className="text-sm font-semibold text-yellow-800">
                      ⚠️ Avvik oppdaget - se notater
                    </p>
                  </div>
                )}

                {/* NIPT */}
                {ultrasound.nipt_consent_given !== null && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      NIPT samtykke: {ultrasound.nipt_consent_given ? 'Ja' : 'Nei'}
                    </p>
                  </div>
                )}

                {/* Utført av */}
                <div className="border-t pt-4 text-sm text-gray-600">
                  {ultrasound.performed_by && (
                    <p>Utført av: {ultrasound.performed_by}</p>
                  )}
                  {ultrasound.location && (
                    <p>Sted: {ultrasound.location}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
