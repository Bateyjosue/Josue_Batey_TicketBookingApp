import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const BASE_URL = import.meta.env.VITE_API_URL || '';

interface RegisterFormInputs {
  username: string;
  email: string;
  password: string;
}

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation(async (data: RegisterFormInputs) => {
    const res = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      let errorMsg = 'Registration failed';
      try {
        const errorData = await res.json();
        if (errorData && errorData.message) errorMsg = errorData.message;
      } catch { /* ignore JSON parse error */ }
      throw new Error(errorMsg);
    }
    return res.json();
  }, {
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/events');
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border-2 border-yellow-500">
        <h2 className="text-3xl font-extrabold mb-6 text-yellow-400 text-center tracking-wide">Create Account</h2>
        <form onSubmit={handleSubmit((values) => mutation.mutate(values))}>
          <div className="mb-5">
            <label className="block mb-2 text-white font-semibold">Username</label>
            <input
              className="w-full border border-yellow-700 bg-black text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-yellow-400"
              placeholder="Choose a username"
              {...register('username', { required: 'Required' })}
            />
            {errors.username && <span className="text-red-400 text-sm">{errors.username.message}</span>}
          </div>
          <div className="mb-5">
            <label className="block mb-2 text-white font-semibold">Email</label>
            <input
              type="email"
              className="w-full border border-yellow-700 bg-black text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-yellow-400"
              placeholder="Enter your email"
              {...register('email', { required: 'Required' })}
            />
            {errors.email && <span className="text-red-400 text-sm">{errors.email.message}</span>}
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-white font-semibold">Password</label>
            <input
              type="password"
              className="w-full border border-yellow-700 bg-black text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-yellow-400"
              placeholder="Create a password"
              {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
            />
            {errors.password && <span className="text-red-400 text-sm">{errors.password.message}</span>}
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black font-bold py-3 rounded-lg shadow-lg hover:from-yellow-400 hover:to-yellow-600 transition-colors duration-200"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Registering...' : 'Register'}
          </button>
          {mutation.isError && (
            <div className="text-red-400 mt-4 text-center">
              {mutation.error instanceof Error ? mutation.error.message : 'Registration failed. Please try again.'}
            </div>
          )}
        </form>
        <div className="mt-8 text-center">
          <span className="text-yellow-200">Already have an account? </span>
          <Link to="/login" className="text-yellow-400 font-semibold hover:underline">Login</Link>
        </div>
      </div>
    </div>
  );
} 