import React, { useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { themeAtom, modeAtom } from '@/store/themeAtoms';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = useAtomValue(themeAtom);
  const mode = useAtomValue(modeAtom);

  // 初始化主题
  useEffect(() => {
    const themeFile = theme === 'default' ? 'default' : 
      theme === '紫色1' ? 'customs/紫色1' : theme;
    
    try {
      // 移除之前的主题样式表
      const oldThemeLink = document.getElementById('theme-link');
      if (oldThemeLink) {
        oldThemeLink.remove();
      }

      // 添加新的主题样式表
      const link = document.createElement('link');
      link.id = 'theme-link';
      link.rel = 'stylesheet';
      link.href = `/src/styles/themes/${themeFile}.css`;
      document.head.appendChild(link);
    } catch (error) {
      console.error('Failed to load theme:', error);
    }

    // 应用暗色模式
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme, mode]);

  return <>{children}</>;
};