import type { SwitchChangeEvent } from '@/components/starwind/switch';
import {
  getStorageItem,
  removeStorageItem,
  setStorageItem,
} from '@/utils/local-storage';

export class AppearanceController {
  private flavorButtons: NodeListOf<HTMLElement>;
  private accentButtons: NodeListOf<HTMLElement>;
  private switchButton: HTMLElement | null;
  private flavorTitle: HTMLElement | null;
  private abortController: AbortController;
  private mediaQuery: MediaQueryList;

  constructor(container: HTMLElement) {
    this.abortController = new AbortController();
    this.flavorButtons =
      container.querySelectorAll<HTMLElement>('[data-flavor]');
    this.accentButtons =
      container.querySelectorAll<HTMLElement>('[data-accent]');
    this.switchButton = container.querySelector<HTMLElement>('#match-system');
    this.flavorTitle = container.querySelector<HTMLElement>(
      '[data-flavor-title]>[data-text-transformer]',
    );
    this.mediaQuery = matchMedia('(prefers-color-scheme:dark)');
    this.setupEvents();
    this.syncUI();
  }

  private isMatchSystem(): boolean {
    const ms = getStorageItem('themeMatchSystem');
    const fl = getStorageItem('themeFlavor');
    return ms === 'true' || (ms === null && fl === null);
  }

  private getDarkFlavor(): string {
    return getStorageItem('themeDarkFlavor') || 'mocha';
  }

  private getCurrentFlavor(): string | undefined {
    const match = document.documentElement.className.match(/ctp-flavor-(\S+)/);
    if (match?.[1]) {
      return match[1];
    }

    console.error(`Flavor class should've been set on startup`);
    return undefined;
  }

  private getCurrentAccent(): string | undefined {
    const match = document.documentElement.className.match(/ctp-accent-(\S+)/);
    if (match?.[1]) {
      return match[1];
    }

    console.error(`Accent class should've been set on startup`);
    return undefined;
  }

  private applyFlavor(flavor: string) {
    const html = document.documentElement;
    html.className = html.className.replace(/\bctp-flavor-\S+/g, '');
    html.classList.add('theme-switching', `ctp-flavor-${flavor}`);
    void html.offsetHeight;
    html.classList.remove('theme-switching');
  }

  private setFlavor(flavor: string) {
    if (this.isMatchSystem()) {
      setStorageItem('themeDarkFlavor', flavor);
      const resolved = this.mediaQuery.matches ? flavor : 'latte';
      this.applyFlavor(resolved);
    } else {
      this.applyFlavor(flavor);
      setStorageItem('themeFlavor', flavor);
    }
    this.syncUI();
  }

  private setAccent(accent: string) {
    const html = document.documentElement;
    html.className = html.className.replace(/\bctp-accent-\S+/g, '');
    html.classList.add('theme-switching', `ctp-accent-${accent}`);
    void html.offsetHeight;
    html.classList.remove('theme-switching');
    setStorageItem('themeAccent', accent);
    this.syncUI();
  }

  private handleMatchSystemToggle(enabled: boolean) {
    if (enabled) {
      setStorageItem('themeMatchSystem', 'true');

      const currentFlavor = this.getCurrentFlavor();
      const darkFlavor =
        currentFlavor && currentFlavor !== 'latte'
          ? currentFlavor
          : getStorageItem('themeDarkFlavor') || 'mocha';
      setStorageItem('themeDarkFlavor', darkFlavor);
      removeStorageItem('themeFlavor');

      const resolved = this.mediaQuery.matches ? darkFlavor : 'latte';
      this.applyFlavor(resolved);
    } else {
      setStorageItem('themeMatchSystem', 'false');

      const currentFlavor = this.getCurrentFlavor();
      if (currentFlavor) {
        setStorageItem('themeFlavor', currentFlavor);
      }
    }
    this.syncUI();
  }

  private handleOsChange = (e: MediaQueryListEvent) => {
    if (this.isMatchSystem()) {
      const darkFlavor = this.getDarkFlavor();
      this.applyFlavor(e.matches ? darkFlavor : 'latte');
      this.syncUI();
    }
  };

  private syncUI() {
    const matchSystem = this.isMatchSystem();
    const currentFlavor = this.getCurrentFlavor();
    const currentAccent = this.getCurrentAccent();
    const darkFlavor = this.getDarkFlavor();

    if (this.switchButton) {
      this.switchButton.setAttribute('aria-checked', String(matchSystem));
    }

    if (this.flavorTitle) {
      this.flavorTitle.dataset.transformed = String(matchSystem);
    }

    this.flavorButtons.forEach((btn) => {
      const flavor = btn.dataset.flavor;
      const isLight = btn.dataset.flavorMode === 'light';
      const outlineIcon = btn.querySelector<HTMLElement>('[data-icon-outline]');
      const filledIcon = btn.querySelector<HTMLElement>('[data-icon-filled]');
      const selectedClasses = ['bg-primary/15!', 'text-primary', 'font-bold!'];

      if (matchSystem && isLight) {
        btn.setAttribute('disabled', '');
        btn.setAttribute('aria-checked', 'false');
        btn.classList.remove(...selectedClasses);
        outlineIcon?.classList.remove('opacity-0');
        filledIcon?.classList.add('opacity-0');
      } else {
        btn.removeAttribute('disabled');
        const isSelected = matchSystem
          ? flavor === darkFlavor
          : flavor === currentFlavor;

        selectedClasses.forEach((cls) => {
          btn.classList.toggle(cls, isSelected);
        });

        btn.setAttribute('aria-checked', String(isSelected));
        outlineIcon?.classList.toggle('opacity-0', isSelected);
        filledIcon?.classList.toggle('opacity-0', !isSelected);
      }
    });

    this.accentButtons.forEach((btn) => {
      const isSelected = btn.dataset.accent === currentAccent;
      btn.classList.toggle('ring-2', isSelected);
      btn.classList.toggle('ring-offset-1', isSelected);
      btn.classList.toggle('ring-offset-background', isSelected);
      btn.classList.toggle('ring-primary', isSelected);
      btn.setAttribute('aria-checked', String(isSelected));

      const check = btn.querySelector<HTMLElement>('[data-check]');
      if (check) {
        check.classList.toggle('hidden', !isSelected);
      }
    });
  }

  private setupEvents() {
    const signal = this.abortController.signal;

    this.flavorButtons.forEach((btn) => {
      btn.addEventListener(
        'click',
        () => {
          if (btn.dataset.flavor && !btn.hasAttribute('disabled')) {
            this.setFlavor(btn.dataset.flavor);
          }
        },
        { signal },
      );
    });

    this.accentButtons.forEach((btn) => {
      btn.addEventListener(
        'click',
        () => {
          if (btn.dataset.accent) {
            this.setAccent(btn.dataset.accent);
          }
        },
        { signal },
      );
    });

    if (this.switchButton) {
      this.switchButton.addEventListener(
        'starwind-switch:change',
        (e) => {
          const detail = (e as CustomEvent<SwitchChangeEvent['detail']>).detail;
          this.handleMatchSystemToggle(detail.checked);
        },
        { signal },
      );
    }

    this.mediaQuery.addEventListener('change', this.handleOsChange, {
      signal,
    });
  }

  destroy() {
    this.abortController.abort();
  }
}
