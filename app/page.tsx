export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          Helsekort
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Velkommen til Helsekort-applikasjonen
        </p>
        <div className="inline-block bg-white rounded-lg shadow-lg p-8">
          <div className="text-green-600 text-lg font-semibold">
            ✓ Vercel deployment fungerer!
          </div>
        </div>
      </div>
    </main>
  );
}
