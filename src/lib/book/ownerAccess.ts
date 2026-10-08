import "server-only";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { createAccountPort } from "../account/supabase";
import { createLibraryPort } from "../library/supabase";
import { mayShareBook } from "./shareServer";
import { sharePort } from "../sharing/reportShareStore";

// The same verified member / purchase capability used by sharing authorizes
// the original book. Knowing a reportId or a share token is not ownership.
export async function canReadPurchasedBook(reportId: string): Promise<boolean> {
  try {
    const request = new NextRequest("https://www.gyeolreport.com/reports/", { headers: await headers() });
    const auth = createAccountPort(request);
    return auth ? await mayShareBook(request, reportId, auth, createLibraryPort(), false, sharePort()) : false;
  } catch { return false; }
}
