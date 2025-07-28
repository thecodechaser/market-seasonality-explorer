import { Palette } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { updateCurrentTheme } from '../../store/marketDataSlice.ts';
import { colorThemes } from '../../config/metricsConfig.ts';
import { RootState } from '../../store/store.ts';

export const ThemeSelection = () => {
  const dispatch = useDispatch();
  const { currentTheme } = useSelector((state: RootState) => state.marketData);

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-300">
        <Palette className="inline w-4 h-4 mr-1" />
        Color Theme
      </label>

      <select
        value={currentTheme.id}
        onChange={(e) => {
          const theme = colorThemes.find((t) => t.id === e.target.value);
          if (theme) dispatch(updateCurrentTheme(theme));
        }}
        className="w-full px-3 py-2 text-white bg-gray-800 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500"
      >
        {colorThemes.map((theme) => (
          <option key={theme.id} value={theme.id}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
};
