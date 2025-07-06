
import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-brand-dark/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center space-x-3">
          <SparklesIcon className="w-8 h-8 text-brand-secondary" />
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Decentralized Content Summarizer
          </h1>
        </div>
        <p className="mt-1 text-sm text-gray-400">
          Generate concise summaries with AI and simulate saving them to a decentralized network.
        </p>
      </div>
    </header>
  );
};

export default Header;
