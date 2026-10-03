import "server-only";
import { CAMPAIGN_SLUG, type CampaignView } from "./model";
import type { MeasurementPort } from "../analytics/server";
export async function campaignView(port: MeasurementPort, slug: string, user: string | null): Promise<CampaignView | null> {
  if (!CAMPAIGN_SLUG.test(slug)) return null;
  const result = await port.call("campaign_presentation_v2", { p_slug: slug, p_user: user }) as { ok?: boolean; presentation?: CampaignView } | null;
  return result?.ok ? result.presentation ?? null : null;
}
