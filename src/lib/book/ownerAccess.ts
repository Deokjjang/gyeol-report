import "server-only";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { createAccountPort } from "../account/supabase";
import { createLibraryPort } from "../library/supabase";
import { mayShareBook } from "./shareServer";
import { sharePort } from "../sharing/reportShareStore";
import { readOwnedTicketReport, type TicketOwnerRead } from "../tickets/ownerRead";
import { createTicketStore } from "../tickets/supabase";

export async function loadOwnedTicketBook(reportId: string): Promise<TicketOwnerRead> {
  try {
    const request = new NextRequest("https://www.gyeolreport.com/reports/", { headers: await headers() });
    const auth = createAccountPort(request);
    return auth ? readOwnedTicketReport(reportId, auth, createTicketStore()) : { kind: "storageError" };
  } catch { return { kind: "storageError" }; }
}

// The same verified member / purchase capability used by sharing authorizes
// the original book. Knowing a reportId or a share token is not ownership.
export async function canReadPurchasedBook(reportId: string): Promise<boolean> {
  try {
    const request = new NextRequest("https://www.gyeolreport.com/reports/", { headers: await headers() });
    const auth = createAccountPort(request);
    return auth ? await mayShareBook(request, reportId, auth, createLibraryPort(), false, sharePort()) : false;
  } catch { return false; }
}
