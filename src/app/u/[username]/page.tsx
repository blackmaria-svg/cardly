import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-600 to-purple-700 flex flex-col items-center justify-center px-4 text-white">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">💳</div>
        <h1 className="text-4xl font-bold mb-3">Cardly</h1>
        <p className="text-violet-200 text-lg mb-2">
          One tap. Your entire business.
        </p>
        <p className="text-violet-300 text-sm mb-10">
          NFC digital business cards for barbers, cafes, restaurants and more.
          Share your socials, take bookings, and accept orders instantly.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="bg-white text-purple-700 font-semibold py-3 px-8 rounded-2xl text-center hover:bg-violet-50 transition"
          >
            Get started
          </Link>
          <Link
            href="/u/demo"
            className="border border-violet-400 text-white font-medium py-3 px-8 rounded-2xl text-center hover:bg-violet-600 transition"
          >
            See a demo profile
          </Link>
        </div>

        <p className="text-violet-400 text-xs mt-10">
          Made in Malaysia 🇲🇾
        </p>
      </div>
    </main>
  )
}
