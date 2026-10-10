import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
const flags = vi.hoisted(() => ({ book:false,account:false,bundle:false }));
const factories = vi.hoisted(()=>({auth:vi.fn(),bundle:vi.fn(),tickets:vi.fn()}));
vi.mock("../../../src/lib/book/publicGate",()=>({bookExperiencePublicEnabled:()=>flags.book}));
vi.mock("../../../src/lib/account/gate",()=>({accountPublicEnabled:()=>flags.account}));
vi.mock("../../../src/lib/tickets/bundleCatalog",async original=>({...await original<typeof import("../../../src/lib/tickets/bundleCatalog")>(),ticketBundleCommerceEnabled:()=>flags.bundle}));
vi.mock("../../../src/lib/account/supabase",()=>({createAccountPort:factories.auth}));
vi.mock("../../../src/lib/tickets/bundleSupabase",()=>({createBundleStore:factories.bundle}));
vi.mock("../../../src/lib/tickets/supabase",()=>({createTicketStore:factories.tickets}));
import { GET,POST } from "../../../src/app/api/ticket-bundles/[action]/route";
import Shop from "../../../src/app/account/tickets/page";
import Callback from "../../../src/app/account/tickets/checkout/[result]/page";
import { handleTicketPublication } from "../../../src/lib/tickets/publicHandler";
import { ticketAuth,TICKET_B } from "../../helpers/ticketPublicationSql";
beforeEach(()=>{Object.assign(flags,{book:false,account:false,bundle:false});vi.clearAllMocks();});
describe("three gates and current-member issuance",()=>{
  it.each([[false,true,true],[true,false,true],[true,true,false],[false,false,false]])("gates %j close page/callback/API before constructors",async(book,account,bundle)=>{
    Object.assign(flags,{book,account,bundle});
    expect(()=>Shop()).toThrow();await expect(Callback({params:Promise.resolve({result:"success"})})).rejects.toThrow();
    for(const action of [GET,POST])expect((await action(new NextRequest("https://gyeolreport.com/api/ticket-bundles/prepare?unlock=1"),{params:Promise.resolve({action:"prepare"})})).status).toBe(404);
    expect(factories.auth).not.toHaveBeenCalled();expect(factories.bundle).not.toHaveBeenCalled();expect(factories.tickets).not.toHaveBeenCalled();
  });
  it("wrong-origin full-gate request still constructs nothing",async()=>{
    Object.assign(flags,{book:true,account:true,bundle:true});
    expect((await GET(new NextRequest("https://evil.test/api/ticket-bundles/state"),{params:Promise.resolve({action:"state"})})).status).toBe(403);expect(factories.auth).not.toHaveBeenCalled();
  });
  it("account switch after receipt cannot reserve under the next member",async()=>{
    const call=vi.fn();
    const r=await handleTicketPublication(new NextRequest("https://gyeolreport.com/auth/ticket-redeem",{method:"POST",headers:{origin:"https://gyeolreport.com","x-ticket-account":"a".repeat(64)},body:"{}"}),"redeem",ticketAuth(TICKET_B),{call});
    expect(r.status).toBe(409);expect(await r.json()).toMatchObject({code:"ACCOUNT_CHANGED"});expect(call).not.toHaveBeenCalled();
  });
});
