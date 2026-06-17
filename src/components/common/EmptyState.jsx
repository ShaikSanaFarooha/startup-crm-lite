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
    <div className="flex flex-col items-center justify-center p-8 md:p-16 text-center bg-white border border-slate-200/80 rounded-2xl shadow-sm">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 mb-4 border border-slate-100">
        {isSearchOrFilterActive ? (
          <SearchX size={24} className="text-slate-400" />
        ) : (
          <Inbox size={24} className="text-slate-400" />
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-900">
        {isSearchOrFilterActive ? 'No leads found' : 'Your pipeline is empty'}
      </h3>

      <p className="mt-2 text-sm text-slate-500 max-w-sm leading-relaxed">
        {isSearchOrFilterActive
          ? "We couldn't find any leads matching your current search query or active stage filters. Try adjusting them or clear filters below."
          : 'Capture new sales prospects and track their progress by adding your first lead to the pipeline.'}
      </p>

      {isSearchOrFilterActive && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 font-semibold text-sm px-4 py-2 rounded-xl transition-all duration-200 cursor-pointer"
        >
          Clear Search & Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
