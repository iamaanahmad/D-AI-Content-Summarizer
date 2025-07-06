
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="w-12 h-12 border-4 border-brand-secondary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loader;
