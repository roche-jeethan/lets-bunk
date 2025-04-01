'use client';

import Link from 'next/link';
import { UserIcon } from '@heroicons/react/24/outline';

export default function ProfileButton(){
    return (
        <Link
            href="/profile"
            className='inline-flex items-center gap-2 px-4 py-2 text-sm 
            font-medium text-gray-700 hover:text-gray-900 transition-colors'>
            <UserIcon className="h-5 w-5 text-gray-500" />
            <span className="hidden md:inline">Profile</span>
        </Link>
    );
}