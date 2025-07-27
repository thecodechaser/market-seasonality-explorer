import { useSelector } from 'react-redux';

export const Legends = () => {
  const { currentTheme } = useSelector((state) => state.marketData);

  return (
    <div
      className="p-4 mt-8 border rounded-lg bg-gray-900/50 backdrop-blur-sm border-gray-700/50"
      style={
        {
          '--color-low': currentTheme.colors.low,
          '--color-medium': currentTheme.colors.medium,
          '--color-high': currentTheme.colors.high,
        } as React.CSSProperties
      }
    >
      <h3 className="mb-3 text-sm font-medium text-gray-300">Legend</h3>
      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded"
            style={{
              backgroundColor: `${currentTheme.colors.low}30`,
              borderColor: `${currentTheme.colors.low}80`,
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          ></div>
          <span className="text-gray-300">Low Volatility (&lt; 2%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded"
            style={{
              backgroundColor: `${currentTheme.colors.medium}30`,
              borderColor: `${currentTheme.colors.medium}80`,
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          ></div>
          <span className="text-gray-300">Medium Volatility (2-4%)</span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className="w-4 h-4 rounded"
            style={{
              backgroundColor: `${currentTheme.colors.high}30`,
              borderColor: `${currentTheme.colors.high}80`,
              borderWidth: '1px',
              borderStyle: 'solid',
            }}
          ></div>
          <span className="text-gray-300">High Volatility (&gt; 4%)</span>
        </div>
      </div>
    </div>
  );
};
