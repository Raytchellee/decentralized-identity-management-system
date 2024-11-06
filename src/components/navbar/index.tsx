'use client';

import { useAuthActions } from '@/actions/auth';
import { Button } from '../buttons';
import { useEffect } from 'react';

export const Navbar = () => {
  const { getProfile, disconnectWallet } = useAuthActions();

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <nav className="bg-gray-900 p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          {/* <img src="/path/to/logo.png" alt="Logo" className="h-10 mr-3" /> */}
          <span className="text-white text-lg font-semibold">
            Decentralized Identity Management
          </span>
        </div>

        {/* Links */}
        <div className="flex space-x-6 text-white">
          {/* <a href="/" className="hover:text-gray-400">
            Home
          </a> */}
        </div>

        {/* Connect Wallet Button */}
        <Button onClick={() => disconnectWallet(true)} size="sm" className="min-w-[120px]">
          Log Out
        </Button>
      </div>
    </nav>
  );
};
