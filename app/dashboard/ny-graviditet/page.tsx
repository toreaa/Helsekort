'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/utils/auth';
import { createPregnancy } from '@/utils/pregnancy';

export default function NewPregnancyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    last_menstruation_date: '',
    expected_due_date: '',
    civil_status: '',
    education: '',
    occupation: '',
    workplace: '',
    gp_name: '',
    gp_phone: '',
    midwife_name: '',
    midwife_phone: '',
    is_first_pregnancy: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await getCurrentUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      await createPregnancy(user.id, formData);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Kunne ikke opprette svangerskap');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold mb-6">Opprett nytt svangerskap</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datoer */}
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4">Datoer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Siste menstruasjon *
                  </label>
                  <input
                    type="date"
                    name="last_menstruation_date"
                    value={formData.last_menstruation_date}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Forventet termindato *
                  </label>
                  <input
                    type="date"
                    name="expected_due_date"
                    value={formData.expected_due_date}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

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
              </div>
            </div>

            {/* Kontaktinformasjon */}
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

            {/* Graviditetshistorikk */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Graviditetshistorikk</h2>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_first_pregnancy"
                  checked={formData.is_first_pregnancy}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Dette er min første graviditet
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Oppretter...' : 'Opprett svangerskap'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Avbryt
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
