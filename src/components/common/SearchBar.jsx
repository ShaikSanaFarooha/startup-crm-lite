import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

/**
 * SearchBar Component
 *
 * A controlled search input with a built-in debounce mechanism (300ms delay) to avoid
 * over-filtering on every keystroke. Includes a quick-clear X button and accessible labeling.
 *
 * @param {Object} props
 * @param {string} props.value - The current search query value from the parent state.
 * @param {function} props.onChange - Callback triggered with the new search value after the debounce delay.
 */
const SearchBar = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  // Sync local input value with parent state during render if parent value changes
  if (value !== prevValue) {
    setPrevValue(value);
    setLocalValue(value);
  }

  // Debounce the input value changes by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [localValue, value, onChange]);

  // Immediate clear action
  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative flex items-center w-full md:max-w-md">
      <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Search by name, company, or email..."
        aria-label="Search by name, company, or email"
        className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-700 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-500 transition-all duration-200"
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 p-1 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-600 transition-colors duration-150 cursor-pointer"
          aria-label="Clear search text"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
