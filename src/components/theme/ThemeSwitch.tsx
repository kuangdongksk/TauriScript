import React from "react";
import { useAtom } from "jotai";
import {
  themeAtom,
  modeAtom,
  toggleModeAtom,
  getAvailableThemes,
} from "@/store/themeAtoms";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Moon, Sun } from "lucide-react";

export const ThemeSwitch: React.FC = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  const [mode] = useAtom(modeAtom);
  const [, toggleMode] = useAtom(toggleModeAtom);
  const themes = getAvailableThemes();

  return (
    <div className="flex items-center gap-4">
      <Select value={theme} onValueChange={(value) => setTheme(value as any)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="选择主题" />
        </SelectTrigger>
        <SelectContent>
          {themes.map((t) => (
            <SelectItem key={t.name} value={t.name}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => toggleMode()}
        className="w-9 h-9 rounded-full"
      >
        {mode === "dark" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
        <span className="sr-only">切换暗色模式</span>
      </Button>
    </div>
  );
};
