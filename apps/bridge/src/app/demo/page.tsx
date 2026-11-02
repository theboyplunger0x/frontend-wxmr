"use client";

import { useState } from "react";
import { BridgeShell } from "@/components/BridgeShell";
import { TokenIcon, Icon } from "@/components/BridgeIcons";

type State = "disconnected" | "connected" | "loading" | "empty" | "pending" | "sending" | "completed" | "reverted" | "claim" | "error";
const states: State[]=["disconnected","connected","loading","empty","pending","sending","completed","reverted","claim","error"];
const statusLabel={pending:"Queued",sending:"Sending XMR",completed:"Completed",reverted:"Reverted"};
export default function DemoPage(){
 const [state,setState]=useState<State>("disconnected");const [amount,setAmount]=useState("1");const [message,setMessage]=useState("");
 const connected=state!=="disconnected";const numeric=/^\d+(\.\d{0,12})?$/.test(amount)?Number(amount):NaN;
 const invalid=amount!==""&&(!Number.isFinite(numeric)||numeric<.1||numeric>4.25);
 const next=()=>{if(state==="disconnected"){setState("connected");return}if(invalid||amount==="")return;setState("pending");setMessage("Demonstration only. Nothing signed or sent.")};
 return <BridgeShell><main id="main" className="bridge-main"><div className="page-intro"><div><p className="eyebrow">Isolated design review</p><h1>A place to explore.</h1><p>Sample data only. No wallet connection, API submissions or financial transactions.</p></div></div><div className="demo-toolbar"><p>These are interface examples, separate from the live application.</p><label className="sr-only" htmlFor="demo-state">Interface state</label><select id="demo-state" value={state} onChange={e=>{setState(e.target.value as State);setMessage("")}}>{states.map(s=><option key={s} value={s}>{s[0].toUpperCase()+s.slice(1)}</option>)}</select></div><div className="demo-workspace"><section className="transfer-card" aria-label="Demonstration bridge"><div className="card-heading"><h2>Demo withdrawal</h2><span className="quiet-badge">Sample data</span></div><div className="amount-field"><div className="amount-caption"><label htmlFor="demo-amount">You send</label><span>{connected?"Sample balance: 4.25 wXMR":"No wallet connected"}</span></div><div className="amount-entry"><input id="demo-amount" inputMode="decimal" value={amount} onChange={e=>setAmount(e.target.value)} aria-invalid={invalid}/><span className="asset-pill"><TokenIcon token="wxmr"/>wXMR</span></div></div><dl className="fee-breakdown"><div><dt>Bridge fee</dt><dd>0.1%</dd></div><div><dt>Sample XMR received</dt><dd>{!invalid&&amount? (numeric*.999).toFixed(6):"—"} XMR</dd></div><div><dt>Minimum</dt><dd>0.1 XMR</dd></div></dl>{invalid?<p className="field-error" role="alert">Enter between 0.1 and 4.25 wXMR, with up to 12 decimal places.</p>:null}
 {state==="loading"?<div className="notice" role="status"><span className="spinner"/>Reading wallet data…</div>:null}
 {state==="empty"?<div className="activity-empty"><h3>No pending withdrawals.</h3><p>This wallet has no requests in the records loaded.</p></div>:null}
 {state==="error"?<div className="notice error-notice" role="alert"><Icon name="info"/><p>Sample failure: balance data unavailable.</p><button className="text-button" onClick={()=>setState("connected")}>Retry</button></div>:null}
 {state==="claim"?<div className="claim-banner"><div><strong>0.999 wXMR ready to claim</strong><p>Illustrative pending balance.</p></div><button className="secondary-button" onClick={()=>{setState("connected");setMessage("Claim preview completed. No real transaction.")}}>Preview claim</button></div>:null}
 {state in statusLabel?<div className="demo-status"><span className={`transfer-status status-${state}`}>{statusLabel[state as keyof typeof statusLabel]}</span><p>Sample withdrawal · 0.999 XMR</p>{state==="pending"?<button className="secondary-button" onClick={()=>{setState("reverted");setMessage("Cancellation preview only. Real cancellation depends on on-chain eligibility.")}}>Preview eligible cancellation</button>:null}</div>:null}
 {message?<div className="notice success-notice" role="status">{message}</div>:null}
 <button className="primary-button" disabled={invalid||state==="loading"} onClick={next}>{connected?"Preview withdrawal":"Use sample wallet"}</button></section></div></main></BridgeShell>;
}
