import { landingHandler } from '@/middleware/landingHandler';
import { LinkHandler } from './linkHandler';

interface LinkConfig {
  pattern: RegExp;
  handler: LinkHandler;
}

export const linkConfigs: LinkConfig[] = [
  { pattern: /^\/landing/, handler: landingHandler },
];