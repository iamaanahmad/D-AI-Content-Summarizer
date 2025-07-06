
import React from 'react';
import Header from './components/Header';
import Summarizer from './components/Summarizer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center antialiased">
      <Header />
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <Summarizer />
      </main>
      <footer className="w-full text-center py-4 text-sm text-gray-400">
        <p>Powered by Gemini API and React</p>
      </footer>
    </div>
  );
};

export default App;
