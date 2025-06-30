import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAvailableThemes,
  modeAtom,
  themeAtom,
  toggleModeAtom,
} from "@/store/themeAtoms";
import { useAtom, useSetAtom } from "jotai";
import { Moon, Sun } from "lucide-react";
import React from "react";

export const ThemeSwitch: React.FC = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  const [mode] = useAtom(modeAtom);
  const toggleMode = useSetAtom(toggleModeAtom);
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
