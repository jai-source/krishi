import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Palette, Sun, Moon, Leaf, Waves, Sunset } from 'lucide-react';

export const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState('default');

  const themes = [
    { id: 'default', name: 'Default', icon: Palette, class: '' },
    { id: 'dark', name: 'Dark', icon: Moon, class: 'dark' },
    { id: 'emerald', name: 'Emerald', icon: Leaf, class: 'emerald-theme' },
    { id: 'ocean', name: 'Ocean', icon: Waves, class: 'ocean-theme' },
    { id: 'sunset', name: 'Sunset', icon: Sunset, class: 'sunset-theme' }
  ];

  const applyTheme = (theme: typeof themes[0]) => {
    const body = document.body;
    
    // Remove all theme classes
    themes.forEach(t => {
      if (t.class) body.classList.remove(t.class);
    });
    
    // Apply new theme
    if (theme.class) {
      body.classList.add(theme.class);
    }
    
    setCurrentTheme(theme.id);
  };

  const currentThemeData = themes.find(t => t.id === currentTheme) || themes[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <currentThemeData.icon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="space-y-1">
          <p className="text-sm font-medium mb-2">Choose Theme</p>
          {themes.map((theme) => {
            const Icon = theme.icon;
            return (
              <Button
                key={theme.id}
                variant={currentTheme === theme.id ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => applyTheme(theme)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {theme.name}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};