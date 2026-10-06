import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
      <div className="space-y-4 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-sky-100 text-[#0284C7] flex items-center justify-center font-black text-2xl mx-auto">
          404
        </div>
        <h2 className="text-2xl font-black text-slate-900">Page Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested sports club resource could not be found or has moved.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-2.5 bg-[#0284C7] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#0369A1] transition-colors"
        >
          Return to Scms Home
        </Link>
      </div>
    </div>
  );
}
