import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

interface LoginFormInputs {
  emailOrUsername: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const navigate = useNavigate();

  const mutation = useMutation(async (data: LoginFormInputs) => {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.emailOrUsername.includes('@') ? data.emailOrUsername : undefined,
        username: !data.emailOrUsername.includes('@') ? data.emailOrUsername : undefined,
        password: data.password
      })
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  }, {
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      navigate('/events');
    }
  });

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <div className="mb-4">
          <label className="block mb-1">Email or Username</label>
          <input
            className="w-full border px-3 py-2 rounded"
            {...register('emailOrUsername', { required: 'Required' })}
          />
          {errors.emailOrUsername && <span className="text-red-500 text-sm">{errors.emailOrUsername.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            {...register('password', { required: 'Required' })}
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? 'Logging in...' : 'Login'}
        </button>
        {mutation.isError && <div className="text-red-500 mt-2">Login failed. Please check your credentials.</div>}
      </form>
    </div>
  );
} 