import Link from "next/link";
import { BridgeShell } from "@/components/BridgeShell";
import { JupiterSwap } from "@/components/JupiterSwap";
export default function SwapPage() { return <BridgeShell><main id="main" className="bridge-main swap-main"><div className="page-intro"><div><p className="eyebrow">Exchange</p><h1>Make your next move.</h1><p>Swap wXMR with supported Solana tokens.</p></div></div><nav className="exchange-tabs" aria-label="Exchange type"><Link href="/swap" aria-current="page">On Solana</Link><Link href="/exchange">Across networks</Link></nav><JupiterSwap /></main></BridgeShell>; }
