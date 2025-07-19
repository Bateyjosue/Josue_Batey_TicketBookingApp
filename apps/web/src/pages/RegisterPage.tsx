import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
// If you have a shared Button component, import it:
// import { Button } from '@yourorg/ui';

interface RegisterFormInputs {
  username: string;
  email: string;
  password: string;
  // role?: string; // Uncomment if you want to allow role selection
}

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>();
  const navigate = useNavigate();

  const mutation = useMutation(async (data: RegisterFormInputs) => {
    const res = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
  }, {
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      navigate('/events');
    }
  });

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <div className="mb-4">
          <label className="block mb-1">Username</label>
          <input
            className="w-full border px-3 py-2 rounded"
            {...register('username', { required: 'Required' })}
          />
          {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            {...register('email', { required: 'Required' })}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            {...register('password', { required: 'Required', minLength: { value: 6, message: 'Min 6 chars' } })}
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>
        {/* Uncomment for role selection
        <div className="mb-4">
          <label className="block mb-1">Role</label>
          <select className="w-full border px-3 py-2 rounded" {...register('role')}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        */}
        {/* Use shared Button if available, else fallback to button */}
        {/* <Button type="submit" disabled={mutation.isLoading}>Register</Button> */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? 'Registering...' : 'Register'}
        </button>
        {mutation.isError && <div className="text-red-500 mt-2">Registration failed. Please try again.</div>}
      </form>
    </div>
  );
} 