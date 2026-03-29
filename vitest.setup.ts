import { vi } from 'vitest';

// Mock Cloudflare Workers runtime module (not available outside Workers)
vi.mock('cloudflare:workers', () => ({
  env: {},
}));
