'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SignInForm(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            router.push('/dashboard');
        } catch (error: any){
            setError(error.message);
        }
    };

    return(
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
            <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700'>Email</label>
                <input
                    type='email'
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
            </div>
            <div>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700'>Password</label>
                <input
                    type='password'
                    id='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className='mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500'
                />
                </div>
                {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}
                <button
                    type="submit"
                    className='mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                >
                    Sign In
                </button>  
            </form>
    );
}