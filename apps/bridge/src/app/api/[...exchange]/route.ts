import { NextRequest, NextResponse } from "next/server";

const ALLOWED = new Set(["health", "tokens", "quote", "orders", "deposit-address"]);
async function forward(request: NextRequest, context: {params: Promise<{exchange: string[]}>}) {
 const {exchange}=await context.params;
 if(!ALLOWED.has(exchange[0]))return NextResponse.json({error:"Route not found"},{status:404});
 const configured=process.env.ORCHESTRATOR_INTERNAL_URL || (process.env.NODE_ENV==="development"?"http://127.0.0.1:3002":null);
 if(!configured)return NextResponse.json({error:"Cross-chain service is not configured. On-Solana swaps remain available."},{status:503});
 try {
  const base=new URL(configured);const url=new URL(`${base.pathname.replace(/\/$/,"")}/${exchange.map(encodeURIComponent).join("/")}${request.nextUrl.search}`,base.origin);
  const response=await fetch(url,{method:request.method,headers:{"content-type":"application/json"},body:request.method==="POST"?await request.text():undefined,signal:AbortSignal.timeout(30_000),cache:"no-store",redirect:"error"});
  return new NextResponse(await response.text(),{status:response.status,headers:{"content-type":response.headers.get("content-type")||"application/json","cache-control":"no-store"}});
 }catch{return NextResponse.json({error:"Cross-chain service is unavailable. Connect the existing orchestrator to use these routes."},{status:503});}
}
export const GET=forward;
export const POST=forward;
