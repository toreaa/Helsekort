import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          Helsekort for gravide
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Ditt digitale helsekort - alltid tilgjengelig
        </p>
        <div className="space-x-4">
          <Link
            href="/auth/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 text-lg font-semibold"
          >
            Logg inn
          </Link>
          <Link
            href="/auth/signup"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-md hover:bg-gray-50 text-lg font-semibold border-2 border-blue-600"
          >
            Opprett konto
          </Link>
        </div>
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Om tjenesten</h2>
          <p className="text-gray-700 mb-4">
            Digitalt helsekort for gravide gjør det enkelt å holde oversikt over svangerskapet ditt.
            Registrer kontroller, ultralyd, blodprøver og få påminnelser om kommende avtaler.
          </p>
          <ul className="text-left text-gray-700 space-y-2">
            <li>✓ Registrer alle svangerskapskontroller</li>
            <li>✓ Oversikt over ultralydundersøkelser</li>
            <li>✓ Påminnelser om kommende avtaler</li>
            <li>✓ Tilgjengelig når du trenger det</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
