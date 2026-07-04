export interface ClickJobPayload {
  clickId: string;

  trackingLinkId: string;

  affiliate: string;

  offer: string;

  tenantId: string;

  ip: string;

  userAgent?: string;

  referer: string;

  timestamp: number;
}
