'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/utils/auth';
import { getActivePregnancy, updatePregnancy } from '@/utils/pregnancy';
import type { Pregnancy } from '@/lib/supabase';
import Link from 'next/link';

export default function BasicInfoPage() {
  const router = useRouter();
  const [pregnancy, setPregnancy] = useState<Pregnancy | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    civil_status: '',
    education: '',
    occupation: '',
    workplace: '',
    country_background: '',
    language: '',
    interpreter_needed: false,
    gp_name: '',
    gp_phone: '',
    midwife_name: '',
    midwife_phone: '',
    diet_notes: '',
    takes_folic_acid: false,
    physical_activity: '',
    smoking: false,
    snus: false,
    alcohol: false,
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
      setFormData({
        civil_status: activePregnancy.civil_status || '',
        education: activePregnancy.education || '',
        occupation: activePregnancy.occupation || '',
        workplace: activePregnancy.workplace || '',
        country_background: activePregnancy.country_background || '',
        language: activePregnancy.language || '',
        interpreter_needed: activePregnancy.interpreter_needed || false,
        gp_name: activePregnancy.gp_name || '',
        gp_phone: activePregnancy.gp_phone || '',
        midwife_name: activePregnancy.midwife_name || '',
        midwife_phone: activePregnancy.midwife_phone || '',
        diet_notes: activePregnancy.diet_notes || '',
        takes_folic_acid: activePregnancy.takes_folic_acid || false,
        physical_activity: activePregnancy.physical_activity || '',
        smoking: activePregnancy.smoking || false,
        snus: activePregnancy.snus || false,
        alcohol: activePregnancy.alcohol || false,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pregnancy) return;

    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      await updatePregnancy(pregnancy.id, formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Kunne ikke lagre endringer');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
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
          <h1 className="text-2xl font-bold text-gray-900">Grunnleggende informasjon</h1>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Tilbake til oversikt
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personlig informasjon */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4">Personlig informasjon</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sivilstatus
                  </label>
                  <select
                    name="civil_status"
                    value={formData.civil_status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Velg...</option>
                    <option value="Gift">Gift</option>
                    <option value="Samboer">Samboer</option>
                    <option value="Ugift">Ugift</option>
                    <option value="Skilt">Skilt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Utdanning
                  </label>
                  <input
                    type="text"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yrke
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arbeidsplass
                  </label>
                  <input
                    type="text"
                    name="workplace"
                    value={formData.workplace}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Landbakgrunn
                  </label>
                  <input
                    type="text"
                    name="country_background"
                    value={formData.country_background}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Språk
                  </label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="interpreter_needed"
                    checked={formData.interpreter_needed}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Trenger tolk</span>
                </label>
              </div>
            </div>

            {/* Helsepersonell */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4">Helsepersonell</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fastlege navn
                  </label>
                  <input
                    type="text"
                    name="gp_name"
                    value={formData.gp_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fastlege telefon
                  </label>
                  <input
                    type="tel"
                    name="gp_phone"
                    value={formData.gp_phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jordmor navn
                  </label>
                  <input
                    type="text"
                    name="midwife_name"
                    value={formData.midwife_name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jordmor telefon
                  </label>
                  <input
                    type="tel"
                    name="midwife_phone"
                    value={formData.midwife_phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Livsstil */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Livsstil</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kosthold og kosttilskudd
                  </label>
                  <textarea
                    name="diet_notes"
                    value={formData.diet_notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fysisk aktivitet
                  </label>
                  <textarea
                    name="physical_activity"
                    value={formData.physical_activity}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="takes_folic_acid"
                      checked={formData.takes_folic_acid}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Tar folsyre</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="smoking"
                      checked={formData.smoking}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Røyking</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="snus"
                      checked={formData.snus}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Snus</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="alcohol"
                      checked={formData.alcohol}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Alkohol</span>
                  </label>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                Endringer lagret!
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving ? 'Lagrer...' : 'Lagre endringer'}
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-center"
              >
                Avbryt
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
