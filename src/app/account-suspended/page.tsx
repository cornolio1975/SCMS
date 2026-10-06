export default function AccountSuspendedPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 text-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Account Suspended</h2>
        <p className="text-gray-600">Your account is currently inactive or suspended. Please contact system administration for support.</p>
      </div>
    </div>
  );
}
