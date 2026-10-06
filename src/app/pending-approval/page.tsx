export default function PendingApprovalPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 text-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Pending</h2>
        <p className="text-gray-600">Your account has been created successfully but is awaiting approval from an administrator. You will be notified once your role is assigned.</p>
        <div className="mt-6">
          <a href="/api/auth/route-dispatch" className="text-indigo-600 hover:underline text-sm font-medium">Check Status Again</a>
        </div>
      </div>
    </div>
  );
}
