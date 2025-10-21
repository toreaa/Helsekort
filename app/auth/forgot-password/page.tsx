import Link from 'next/link';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

export const dynamic = 'force-dynamic';

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Glemt passord?
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Skriv inn e-postadressen din, så sender vi deg en lenke for å tilbakestille passordet.
        </p>

        <ForgotPasswordForm />

        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-sm text-blue-600 hover:underline">
            Tilbake til innlogging
          </Link>
        </div>
      </div>
    </main>
  );
}
