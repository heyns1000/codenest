import { Sun, Moon, Palette } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light' as const, icon: Sun, label: 'Day' },
    { id: 'dark' as const, icon: Moon, label: 'Night' },
    { id: 'fruitful' as const, icon: Palette, label: 'Fruitful' }
  ];

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className="bg-white/80 dark:bg-gray-900/80 fruitful:bg-orange-100/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 fruitful:border-orange-300 p-2 flex gap-2">
        {themes.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTheme(id)}
            className={`p-3 rounded-xl transition-all ${
              theme === id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 fruitful:text-orange-800 hover:bg-gray-100 dark:hover:bg-gray-800 fruitful:hover:bg-orange-200'
            }`}
            title={label}
          >
            <Icon className="w-5 h-5" />
          </button>
        ))}
      </div>
    </div>
  );
}
