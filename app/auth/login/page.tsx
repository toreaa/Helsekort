import Link from 'next/link';
import LoginForm from '@/components/auth/LoginForm';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Helsekort for gravide
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Logg inn for å se ditt helsekort
        </p>

        <LoginForm />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Har du ikke konto?{' '}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Registrer deg her
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
