import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import axios from 'axios';

import { AuthLayout } from '../../components/layout/AuthLayout';
import { FormField } from '../../components/ui/FormField';
import { useAuth } from '../../context/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError('');
    setIsSubmitting(true);

    try {
      await login({
        username,
        password,
      });

      navigate('/dashboard');
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const message = requestError.response?.data?.message;

        setError(
          typeof message === 'string'
            ? message
            : 'Unable to sign in. Please check your credentials.',
        );
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your workspace"
      description="Access your notifications, manage alerts and stay focused on what matters."
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7"
      >
        <div className="space-y-5">
          <FormField
            label="Username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Enter your username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        {error && (
          <div className="mt-5 rounded-2xl border border-red-400/15 bg-red-400/8 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="mt-6 text-center text-sm text-zinc-500">
          New to Notify?{' '}
          <Link
            to="/register"
            className="font-medium text-zinc-200 transition hover:text-white"
          >
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}