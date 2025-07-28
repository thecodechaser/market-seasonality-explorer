import { useSelector, useDispatch } from 'react-redux';
import { updateFilters } from '../../store/marketDataSlice.ts';
import { metrics } from '../../config/metricsConfig.ts';
import { RootState } from '../../store/store.ts';

export const MetricsSelection = ({}) => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.marketData);

  const handleFilterChange = (newFilters: any) => {
    dispatch(updateFilters(newFilters));
  };

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-300">
        Metrics
      </label>
      <div className="flex flex-wrap gap-2">
        {metrics.map((metric) => {
          const isActive = filters.metrics.includes(metric);
          return (
            <button
              key={metric}
              type="button"
              onClick={() => {
                const newMetrics = isActive
                  ? filters.metrics.filter((m) => m !== metric)
                  : [...filters.metrics, metric];
                handleFilterChange({ metrics: newMetrics });
              }}
              className={`px-3 py-1.5 rounded text-sm border transition-all ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
              }`}
            >
              {metric}
            </button>
          );
        })}
      </div>
    </div>
  );
};
