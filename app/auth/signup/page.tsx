import Link from 'next/link';
import SignupForm from '@/components/auth/SignupForm';

export const dynamic = 'force-dynamic';

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Opprett konto
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Registrer deg for å bruke digitalt helsekort
        </p>

        <SignupForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Har du allerede konto?{' '}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Logg inn her
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
