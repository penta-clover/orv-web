import { LinkHandler } from '@/middleware/linkHandler';
import { landingHandler } from '@/middleware/handlers/landingHandler';
import { letterHandler } from '@/middleware/handlers/letterHandler';
import { trackingFreeHandler } from './handlers/trackingFreeHandler';

interface LinkConfig {
  pattern: RegExp;
  handler: LinkHandler;
}

export const linkConfigs: LinkConfig[] = [
  { pattern: /^\/landing/, handler: landingHandler },
  { pattern: /^\/letter\/vQf3Rv/, handler: letterHandler },
  { pattern: /^\/tracking\/free/, handler: trackingFreeHandler}
];