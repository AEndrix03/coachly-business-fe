import { Injectable, effect, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'coachly-theme-mode';
  private readonly themeModeSignal = signal<ThemeMode>('light');

  readonly themeMode = this.themeModeSignal.asReadonly();

  constructor() {
    const savedMode = this.readSavedMode();
    this.themeModeSignal.set(savedMode);

    effect(() => {
      const mode = this.themeModeSignal();
      this.applyMode(mode);
      localStorage.setItem(this.storageKey, mode);
    });
  }

  toggle(): void {
    this.themeModeSignal.update((mode) => (mode === 'light' ? 'dark' : 'light'));
  }

  private readSavedMode(): ThemeMode {
    const value = localStorage.getItem(this.storageKey);
    return value === 'dark' ? 'dark' : 'light';
  }

  private applyMode(mode: ThemeMode): void {
    const root = document.documentElement;
    root.classList.toggle('theme-dark', mode === 'dark');
    root.classList.toggle('theme-light', mode === 'light');
    root.style.colorScheme = mode;
  }
}
