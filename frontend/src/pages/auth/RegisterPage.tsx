import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import axios from 'axios';

import { AuthLayout } from '../../components/layout/AuthLayout';
import { FormField } from '../../components/ui/FormField';
import { useAuth } from '../../context/useAuth';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, user } = useAuth();

  const [fullName, setFullName] = useState('');
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
      await register({
        fullName,
        username,
        password,
      });

      navigate('/login');
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const message = requestError.response?.data?.message;

        if (Array.isArray(message)) {
          setError(message[0]);
        } else if (typeof message === 'string') {
          setError(message);
        } else {
          setError('Unable to create your account.');
        }
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Create account"
      title="Build your notification workspace"
      description="Create your account and keep every important update in one focused place."
    >
      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-white/10 bg-white/[0.035] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7"
      >
        <div className="space-y-5">
          <FormField
            label="Full name"
            name="fullName"
            type="text"
            autoComplete="name"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            required
          />

          <FormField
            label="Username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="Choose a username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={6}
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
              Creating account...
            </>
          ) : (
            <>
              Create account
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-zinc-200 transition hover:text-white"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}