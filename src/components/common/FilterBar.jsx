// FilterBar.jsx

/**
 * FilterBar Component
 *
 * Renders a row of clickable pipeline status filters. Displays the active filter
 * highlighted in the brand's blue primary styling. Each button displays the
 * count of leads matching that status, calculated dynamically from the passed-in leads.
 *
 * @param {Object} props
 * @param {string} props.activeFilter - The current active status filter value (e.g. 'All', 'Won').
 * @param {function} props.onFilterChange - Callback invoked when a status filter is selected.
 * @param {Array<Object>} props.leads - The complete array of leads, used to compute filter counts.
 */
const FilterBar = ({ activeFilter, onFilterChange, leads = [] }) => {
  const statuses = [
    'All',
    'New',
    'Contacted',
    'Meeting Scheduled',
    'Proposal Sent',
    'Won',
    'Lost'
  ];

  // Helper to count leads for a specific status
  const getStatusCount = (status) => {
    if (status === 'All') {
      return leads.length;
    }
    return leads.filter((lead) => lead.status === status).length;
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
        Filter Stage:
      </span>
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-200">
        {statuses.map((status) => {
          const isActive = activeFilter === status;
          const count = getStatusCount(status);
          
          return (
            <button
              key={status}
              onClick={() => onFilterChange(status)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all duration-200 border ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              {status}
              <span
                className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] transition-colors duration-200 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FilterBar;
