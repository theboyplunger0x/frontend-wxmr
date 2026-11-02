"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { SolanaRpcSettings } from "@wxmr/shared";
import { Icon, TokenIcon } from "./BridgeIcons";

const DonateSection = dynamic(()=>import("./DonateSection").then(module=>module.DonateSection));
const AdapterWalletButton = dynamic(()=>import("@solana/wallet-adapter-react-ui").then(module=>module.BaseWalletMultiButton),{ssr:false,loading:()=> <button className="wallet-placeholder" disabled>Connect wallet</button>});
export function WalletButton(){return <AdapterWalletButton labels={{"no-wallet":"Connect wallet","has-wallet":"Connect wallet",connecting:"Connecting…","change-wallet":"Change wallet","copy-address":"Copy address",copied:"Copied",disconnect:"Disconnect"}}/>;}

export function BridgeShell({children}:{children:ReactNode}){
 const path=usePathname();const landing=path==="/";const [menuOpen,setMenuOpen]=useState(false);const [support,setSupport]=useState(false);
 const links=[{href:"/bridge",label:"Bridge"},{href:"/swap",label:"Swap"},{href:"/activity",label:"Activity"},{href:"/reserves",label:"Reserves"},{href:"/docs",label:"Guide"}];
 return <div className={`site-shell ${landing?"landing-shell":"product-shell"}`}>
  <a className="skip-link" href="#main">Skip to content</a>
  <header className="site-header">
   <Link href="/" className="wordmark" aria-label="wXMR home"><TokenIcon token="xmr"/><span>wXMR<span className="wordmark-dot">.</span></span></Link>
   <nav id="main-navigation" className={`site-nav ${menuOpen?"is-open":""}`} aria-label="Main navigation">{links.map(link=>{const current=path===link.href||(link.href==="/reserves"&&path==="/transparency")||(link.href==="/swap"&&path==="/exchange");return <Link key={link.href} href={link.href} aria-current={current?"page":undefined} className={current?"active":""} onClick={()=>setMenuOpen(false)}>{link.label}</Link>;})}</nav>
   <div className="header-actions">{landing?<Link href="/bridge" className="primary-button header-launch">Launch app</Link>:path==="/demo"?<Link href="/bridge" className="secondary-button">Exit demo</Link>:<WalletButton/>}<button type="button" className="mobile-menu" aria-label={menuOpen?"Close navigation":"Open navigation"} aria-controls="main-navigation" aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<Icon name="close"/>:<span className="menu-lines"/>}</button></div>
  </header>
  <div className="site-main-content">{children}</div>
  <footer className="site-footer">
   <div className="footer-upper"><Link href="/" className="wordmark">wXMR<span className="wordmark-dot">.</span></Link><span>Monero, connected.</span></div>
   <div className="footer-lower"><div className="footer-links"><Link href="/docs">Documentation</Link><a href="https://github.com/sullystuff/wxmr-frontend" target="_blank" rel="noopener noreferrer">Source code</a><Link href="/privacy">Privacy</Link><Link href="/settings">Settings</Link><button type="button" aria-expanded={support} onClick={()=>setSupport(!support)}>Support wXMR</button></div><span>Built on Monero & Solana</span></div>
   {support?<DonateSection/>:null}
   <div className="footer-rpc"><SolanaRpcSettings/></div>
  </footer>
 </div>;
}
