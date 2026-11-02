"use client";
import Link from "next/link";
import { BridgeShell } from "@/components/BridgeShell";
import { ExchangeWorkspace } from "../../../../swap/src/app/ExchangeWorkspace";
import { CrossChainProviders } from "../../../../swap/src/app/providers";
export default function ExchangePage(){return <BridgeShell><div id="main" className="bridge-main swap-main"><div className="page-intro"><div><p className="eyebrow">Exchange</p><h1>Across networks.</h1><p>Native XMR and supported cross-chain routes.</p></div></div><nav className="exchange-tabs" aria-label="Exchange type"><Link href="/swap">On Solana</Link><Link href="/exchange" aria-current="page">Across networks</Link></nav><CrossChainProviders><ExchangeWorkspace embedded /></CrossChainProviders></div></BridgeShell>}
