import { SearchX, Inbox } from 'lucide-react';

/**
 * EmptyState Component
 *
 * Renders a stylized empty state view. Adapts its copy and illustration dynamically:
 * - If `totalCount === 0`: Shows a welcome message to start adding leads.
 * - If `totalCount > 0`: Indicates that search/filters returned no results and offers a "Clear Filters" button.
 *
 * @param {Object} props
 * @param {number} props.totalCount - Total number of leads in the CRM database before filtering.
 * @param {function} props.onClear - Callback to reset search query and filters.
 */
const EmptyState = ({ totalCount, onClear }) => {
  const isSearchOrFilterActive = totalCount > 0;

  return (
    <div className="flex flex-col items-center justify-center p-8 md:p-16 text-center bg-white dark:bg-gray-800 border border-slate-200/80 dark:border-gray-700 rounded-2xl shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 dark:bg-gray-900 text-slate-400 dark:text-gray-500 mb-4 border border-slate-100 dark:border-gray-800 transition-colors duration-200">
        {isSearchOrFilterActive ? (
          <SearchX size={24} className="text-slate-400 dark:text-gray-500" />
        ) : (
          <Inbox size={24} className="text-slate-400 dark:text-gray-500" />
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-200">
        {isSearchOrFilterActive ? 'No leads found' : 'Your pipeline is empty'}
      </h3>

      <p className="mt-2 text-sm text-slate-500 dark:text-gray-400 max-w-sm leading-relaxed transition-colors duration-200">
        {isSearchOrFilterActive
          ? "We couldn't find any leads matching your current search query or active stage filters. Try adjusting them or clear filters below."
          : 'Capture new sales prospects and track their progress by adding your first lead to the pipeline.'}
      </p>

      {isSearchOrFilterActive && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-semibold text-sm px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer"
        >
          Clear Search & Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
