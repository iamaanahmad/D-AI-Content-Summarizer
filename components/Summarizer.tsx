import React, { useState, useCallback, useMemo } from 'react';
import { summarizeText, SummaryFormat, InputType } from '../services/geminiService';
import Loader from './Loader';
import { ArrowDownTrayIcon } from './icons/ArrowDownTrayIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationCircleIcon } from './icons/ExclamationCircleIcon';
import { DocumentDuplicateIcon } from './icons/DocumentDuplicateIcon';
import { TrashIcon } from './icons/TrashIcon';
import { LinkIcon } from './icons/LinkIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';

const Summarizer: React.FC = () => {
  const [inputType, setInputType] = useState<InputType>('text');
  const [inputText, setInputText] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [summaryFormat, setSummaryFormat] = useState<SummaryFormat>('standard');
  
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [storageHash, setStorageHash] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);

  const isInputEmpty = useMemo(() => {
    if (inputType === 'text') {
      return !inputText.trim();
    }
    return !url.trim();
  }, [inputType, inputText, url]);


  const handleSummarize = useCallback(async () => {
    if (isInputEmpty) {
      setError(`Please enter some ${inputType === 'text' ? 'text' : 'a URL'} to summarize.`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummary('');
    setStorageHash(null);

    try {
      let contentToSummarize = '';
      if (inputType === 'url') {
        try {
          // IMPORTANT: This direct fetch is subject to CORS policy.
          // Many sites will block this. A backend proxy is needed for a robust solution.
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          contentToSummarize = await response.text();
        } catch (fetchError) {
           console.error("Fetch error:", fetchError);
           setError("Failed to fetch content from the URL. This may be due to the website's CORS policy, which restricts direct browser access. Please try a different URL or use the text input tab. In a production app, this is solved with a server-side proxy.");
           setIsLoading(false);
           return;
        }
      } else {
        contentToSummarize = inputText;
      }
      
      const result = await summarizeText(contentToSummarize, summaryFormat, inputType);
      setSummary(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate summary. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, url, inputType, summaryFormat, isInputEmpty]);

  const handleClear = () => {
    setInputText('');
    setUrl('');
    setSummary('');
    setError(null);
    setStorageHash(null);
  };
  
  const handleSaveToDecentralizedStorage = useCallback(() => {
    setIsSaving(true);
    setStorageHash(null);
    setTimeout(() => {
      // Simulate generating an IPFS/Arweave hash
      const fakeHash = 'Qm' + Array(44).fill(0).map(() => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.charAt(Math.floor(Math.random() * 62))).join('');
      setStorageHash(fakeHash);
      setIsSaving(false);
    }, 1500);
  }, []);
  
  const copyToClipboard = (text: string, type: 'summary' | 'hash') => {
    navigator.clipboard.writeText(text);
    if(type === 'summary') {
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } else {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  }

  const TabButton: React.FC<{ type: InputType; label: string; icon: React.ReactNode }> = ({ type, label, icon }) => (
    <button
      onClick={() => setInputType(type)}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark/60 disabled:cursor-not-allowed ${
        inputType === type
          ? 'bg-slate-900/50 border-slate-600 border-b-transparent text-white'
          : 'text-gray-400 hover:bg-slate-800/50 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-8">
      <div className="relative bg-brand-dark/60 rounded-lg border border-slate-700 shadow-lg">
        <div className="flex border-b border-slate-700 px-4 -mb-px">
          <TabButton type="text" label="Text Input" icon={<DocumentTextIcon className="w-5 h-5" />} />
          <TabButton type="url" label="URL Input" icon={<LinkIcon className="w-5 h-5" />} />
        </div>
        
        <div className="p-6">
          {inputType === 'text' ? (
             <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your long article, research paper, or any text here..."
              className="w-full h-64 p-4 bg-slate-900/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none transition duration-200 resize-y text-brand-text placeholder-gray-500"
              disabled={isLoading}
            />
          ) : (
             <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full p-4 bg-slate-900/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none transition duration-200 text-brand-text placeholder-gray-500"
              disabled={isLoading}
             />
          )}

          <div className="mt-4 flex flex-col lg:flex-row gap-4 items-center">
             <div className="w-full lg:w-auto">
                <label htmlFor="summary-format" className="sr-only">Summary Format</label>
                <select 
                    id="summary-format"
                    value={summaryFormat}
                    onChange={(e) => setSummaryFormat(e.target.value as SummaryFormat)}
                    disabled={isLoading}
                    className="w-full lg:w-auto h-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none transition duration-200 text-brand-text"
                >
                    <option value="standard">Standard Summary</option>
                    <option value="bullet_points">Bulleted Key Points</option>
                    <option value="eli5">Explain Like I'm 5</option>
                </select>
             </div>
             <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full">
                <button
                    onClick={handleSummarize}
                    disabled={isLoading || isInputEmpty}
                    className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-secondary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-brand-secondary disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Summarizing...' : 'Generate Summary'}
                </button>
                <button
                    onClick={handleClear}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 border border-slate-600 text-base font-medium rounded-md shadow-sm text-brand-text bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-slate-500 disabled:opacity-50 transition-colors"
                >
                    <TrashIcon className="w-5 h-5 mr-2" /> Clear
                </button>
             </div>
          </div>
        </div>
      </div>

      <div className="relative bg-brand-dark/60 p-6 rounded-lg border border-slate-700 shadow-lg min-h-[200px] flex flex-col justify-center">
        <h2 className="text-lg font-semibold text-white mb-3">AI Generated Summary</h2>
        {isLoading && <Loader />}
        {error && (
            <div className="text-red-400 bg-red-900/50 p-4 rounded-md flex items-start">
                 <ExclamationCircleIcon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                 <span>{error}</span>
            </div>
        )}
        {!isLoading && !error && summary && (
          <div className="space-y-6">
            <div className="relative bg-slate-900/50 p-4 rounded-md">
                <p className="text-brand-text whitespace-pre-wrap">{summary}</p>
                <button 
                  onClick={() => copyToClipboard(summary, 'summary')}
                  className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 rounded-md transition-colors"
                  aria-label="Copy summary"
                >
                  {copiedSummary ? <CheckCircleIcon className="w-5 h-5 text-green-400" /> : <DocumentDuplicateIcon className="w-5 h-5" />}
                </button>
            </div>
            
            <div className="border-t border-slate-700 pt-4">
                <h3 className="text-md font-semibold text-white mb-2">Decentralized Storage</h3>
                {!storageHash && (
                    <button
                        onClick={handleSaveToDecentralizedStorage}
                        disabled={isSaving}
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-brand-primary disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                    >
                    {isSaving ? (
                        <>
                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                        </>
                    ) : (
                       <> <ArrowDownTrayIcon className="w-5 h-5 mr-2" /> Save to IPFS/Arweave (Simulated) </>
                    )}
                    </button>
                )}
                 {storageHash && (
                    <div className="bg-green-900/50 border border-green-700 text-green-300 p-4 rounded-md space-y-2">
                        <div className="flex items-center font-semibold">
                            <CheckCircleIcon className="w-6 h-6 mr-2" />
                            <span>Successfully saved to decentralized storage!</span>
                        </div>
                        <div className="relative flex items-center bg-slate-900 p-2 rounded-md">
                            <p className="text-sm font-mono break-all flex-1">
                                <span className="text-gray-400">Hash:</span> {storageHash}
                            </p>
                             <button 
                              onClick={() => copyToClipboard(storageHash, 'hash')}
                              className="ml-2 p-1.5 text-gray-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 rounded-md transition-colors flex-shrink-0"
                              aria-label="Copy hash"
                            >
                              {copiedHash ? <CheckCircleIcon className="w-5 h-5 text-green-400" /> : <DocumentDuplicateIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                )}
            </div>

          </div>
        )}
        {!isLoading && !error && !summary && (
          <div className="text-center text-gray-400">
            <p>Your summary will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Summarizer;
