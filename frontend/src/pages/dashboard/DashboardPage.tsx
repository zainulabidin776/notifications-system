import { useAuth } from '../../context/useAuth';

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-4xl font-semibold text-white">
        Welcome, {user?.fullName}
      </h1>

      <button
        type="button"
        onClick={logout}
        className="mt-6 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
      >
        Logout
      </button>
    </div>
  );
}