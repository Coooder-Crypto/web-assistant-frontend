import React, { useState, useRef, useEffect } from 'react';

export interface Option<T = string> {
  label: string;
  value: T;
}

interface SelectorProps<T = string> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  dropUp?: boolean;
}

export function Selector<T = string>({
  options,
  value,
  onChange,
  label,
  className = '',
  disabled = false,
  placeholder,
  dropUp = false,
}: SelectorProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center space-x-2" ref={containerRef}>
      {label && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
      <div className={`relative ${className}`}>
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`w-full px-3 py-2 text-sm text-left
            text-gray-900 dark:text-gray-100 
            bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700 
            rounded-lg shadow-sm
            hover:border-gray-300 dark:hover:border-gray-600
            focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-200
            flex items-center justify-between
          `}
        >
          <span className={selectedOption ? '' : 'text-gray-500'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && !disabled && (
          <div className={`absolute z-50 w-full ${dropUp ? 'bottom-[calc(100%+0.25rem)]' : 'top-[calc(100%+0.25rem)]'} bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 max-h-60 overflow-auto`}>
            {options.map((option) => (
              <div
                key={String(option.value)}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 text-sm cursor-pointer
                  ${String(option.value) === String(value)
                    ? 'bg-primary/10 text-primary dark:text-primary-light' 
                    : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
