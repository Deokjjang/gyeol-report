import { NextRequest } from "next/server";
import { localAccountAllowed } from "../../../../lib/account/gate";
export async function POST(request:NextRequest){
  if(!localAccountAllowed(request))return new Response(null,{status:404});
  const u=new URL(request.url);if(request.headers.get("host"))u.host=request.headers.get("host")!;
  if(request.headers.get("origin")!==u.origin||(await request.text())!=="{}")return new Response(null,{status:403});
  const {localCampaignDatabase,seedCampaignFixtures}=await import("../../../../lib/growth/localReview");
  const db=await localCampaignDatabase();if(!db)return new Response(null,{status:503});
  if(!(await db.query("select 1 from growth_campaigns limit 1")).rows.length)await seedCampaignFixtures(db);
  return Response.json({ok:true},{headers:{"Cache-Control":"private, no-store"}});
}
