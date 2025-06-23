import { modeAtom, themeAtom } from "@/store/themeAtoms";
import { useAtomValue } from "jotai";
import React, { useEffect, useState } from "react";

// 导入默认主题以确保至少有一个主题可用
import "@/styles/themes/default.css";
// import BubblegumDark from "./data/Bubblegum/dark";
// import BubblegumLight from "./data/Bubblegum/light";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = useAtomValue(themeAtom);
  const mode = useAtomValue(modeAtom);
  const [error, setError] = useState<string | null>(null);

  // 应用主题
  useEffect(() => {
    const loadTheme = async () => {
      if (theme === "default") {
        // 默认主题已经导入，无需额外操作
        setError(null);
        return;
      }

      try {
        // 动态导入主题
        switch (theme) {
          case "Bubblegum":
            await import("@/styles/themes/Bubblegum.css");

            // if (mode === "dark") {
            //   Object.entries(BubblegumDark).forEach(([key, value]) => {
            //     document.documentElement.style.setProperty(key, value);
            //   });
            // } else {
            //   Object.entries(BubblegumLight).forEach(([key, value]) => {
            //     document.documentElement.style.setProperty(key, value);
            //   });
            // }
            break;
          case "MochaMousse":
            await import("@/styles/themes/MochaMousse.css");
            break;
          case "Perpetuity":
            await import("@/styles/themes/Perpetuity.css");
            break;
          case "紫色1":
            await import("@/styles/themes/customs/紫色1.css");
            break;
          default:
            // 尝试导入其他主题
            try {
              await import(`@/styles/themes/${theme}.css`);
            } catch (e) {
              console.error(`Theme ${theme} not found, using default theme.`);
              setError(`主题 "${theme}" 不存在，已回退到默认主题。`);
              return;
            }
        }

        setError(null);
        console.log(`Theme loaded: ${theme}`);
      } catch (error) {
        console.error("Failed to load theme:", error);
        setError(`加载主题 "${theme}" 失败，已回退到默认主题。`);
      }
    };

    loadTheme();
  }, [theme]);

  // 应用暗色模式
  useEffect(() => {
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  return (
    <>
      {error && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px 15px",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            zIndex: 9999,
            animation: "fadeIn 0.3s ease-in-out",
          }}
        >
          {error}
        </div>
      )}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      {children}
    </>
  );
};
