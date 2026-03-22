import { setStorageItem } from '@/utils/local-storage';

export class AppearanceController {
  private flavorButtons: NodeListOf<HTMLElement>;
  private accentButtons: NodeListOf<HTMLElement>;
  private abortController: AbortController;

  constructor(container: HTMLElement) {
    this.abortController = new AbortController();
    this.flavorButtons =
      container.querySelectorAll<HTMLElement>('[data-flavor]');
    this.accentButtons =
      container.querySelectorAll<HTMLElement>('[data-accent]');
    this.setupEvents();
    this.syncUI();
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

  private setFlavor(flavor: string) {
    const html = document.documentElement;
    html.className = html.className.replace(/\bctp-flavor-\S+/g, '');
    html.classList.add(`ctp-flavor-${flavor}`);
    setStorageItem('themeFlavor', flavor);
    this.syncUI();
  }

  private setAccent(accent: string) {
    const html = document.documentElement;
    html.className = html.className.replace(/\bctp-accent-\S+/g, '');
    html.classList.add(`ctp-accent-${accent}`);
    setStorageItem('themeAccent', accent);
    this.syncUI();
  }

  private syncUI() {
    const currentFlavor = this.getCurrentFlavor();
    const currentAccent = this.getCurrentAccent();

    this.flavorButtons.forEach((btn) => {
      const isSelected = btn.dataset.flavor === currentFlavor;
      btn.classList.toggle('ring-2', isSelected);
      btn.classList.toggle('ring-primary', isSelected);
      btn.classList.toggle('text-primary', isSelected);
    });

    this.accentButtons.forEach((btn) => {
      const isSelected = btn.dataset.accent === currentAccent;
      btn.classList.toggle('ring-2', isSelected);
      btn.classList.toggle('ring-offset-1', isSelected);
      btn.classList.toggle('ring-offset-background', isSelected);
      btn.classList.toggle('ring-foreground', isSelected);

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
          if (btn.dataset.flavor) {
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
  }

  destroy() {
    this.abortController.abort();
  }
}
