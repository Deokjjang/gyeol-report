import "server-only";
import type { MeasurementPort } from "../analytics/server";
import { isLaunchEventView } from "./launchEvent";
export async function launchEventView(port: MeasurementPort) {
  try {
    const value = await port.call("launch_event_state", {});
    return isLaunchEventView(value) ? value : null;
  } catch { return null; }
}
