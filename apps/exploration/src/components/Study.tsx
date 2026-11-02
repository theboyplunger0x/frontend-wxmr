"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Symbol, Chevron, ExchangeArrow } from "./Glyph";
import { Modal } from "./Modal";
type Concept = "a" | "b";
type Mode = "bridge" | "swap" | "reserves";
type State = "disconnected" | "connected" | "pending" | "completed" | "error";
const names = {
  a: "Black Titanium",
  b: "Holographic Instrument",
};
const tokens = {
  wxmr: { name: "Wrapped Monero", ticker: "wXMR", decimals: 12 },
  sol: { name: "Solana", ticker: "SOL", decimals: 9 },
  usdc: { name: "USD Coin", ticker: "USDC", decimals: 6 },
} as const;
type Token = keyof typeof tokens;
function bridgePreview(value: string) {
  if (!/^(?:\d+)(?:\.\d{0,12})?$/.test(value) || value.length > 32) return null;
  const [whole, fraction = ""] = value.split(".");
  const amount =
    BigInt(whole) * BigInt(10 ** 12) + BigInt(fraction.padEnd(12, "0"));
  if (amount <= BigInt(0) || amount > BigInt("18446744073709551615"))
    return null;
  const format = (n: bigint) => {
    const s = n.toString().padStart(13, "0");
    return `${s.slice(0, -12)}${s.slice(-12).replace(/0+$/, "") ? "." + s.slice(-12).replace(/0+$/, "") : ""}`;
  };
  return {
    receive: format(amount - amount / BigInt(1000)),
    fee: format(amount / BigInt(1000)),
    below: amount < BigInt(10 ** 11),
  };
}
export function Study({ concept }: { concept: Concept }) {
  const surface = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("bridge");
  const [reverse, setReverse] = useState(false);
  const [state, setState] = useState<State>("disconnected");
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [token, setToken] = useState<Token>("usdc");
  const [sellWrapped, setSellWrapped] = useState(true);
  const [modal, setModal] = useState<
    | null
    | "wallet"
    | "tokens"
    | "review"
    | "activity"
    | "menu"
    | "docs"
    | "rpc"
    | "states"
    | "proof"
  >(null);
  const [addressReady, setAddressReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const [rpc, setRPC] = useState("");
  const [rpcMessage, setRPCMessage] = useState("");
  const connected = state !== "disconnected";
  const preview = bridgePreview(amount);
  const redeem = mode === "bridge" && reverse;
  const payToken = sellWrapped ? "wxmr" : token;
  const receiveToken = sellWrapped ? token : "wxmr";
  useEffect(() => {
    const node = surface.current;
    if (!node) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const move = (e: PointerEvent) => {
      if (reduced.matches || e.pointerType === "touch") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        node.style.setProperty(
          "--pointer-x",
          `${(e.clientX / innerWidth) * 100}%`,
        );
        node.style.setProperty(
          "--pointer-y",
          `${(e.clientY / innerHeight) * 100}%`,
        );
        node.style.setProperty(
          "--angle",
          `${108 + (e.clientX / innerWidth - 0.5) * 22}deg`,
        );
      });
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
    };
  }, []);
  function changeMode(next: Mode) {
    setMode(next);
    setModal(null);
    setAmount("");
    setCopied(false);
  }
  function reset() {
    setState("disconnected");
    setAmount("");
    setAddressReady(false);
    setCopied(false);
    setDestination("");
    setReverse(false);
    setMode("bridge");
    setModal(null);
  }
  function primary() {
    if (state === "error") {
      setState("connected");
      return;
    }
    if (state === "pending" || state === "completed") {
      setModal("activity");
      return;
    }
    if (!connected) {
      setModal("wallet");
      return;
    }
    if (mode === "bridge" && !reverse) {
      setAddressReady(true);
      return;
    }
    setModal("review");
  }
  const action =
    state === "error"
      ? "Retry preview"
      : state === "pending"
        ? "View pending transfer"
        : state === "completed"
          ? "View transfer"
          : !connected
            ? "Connect wallet"
            : mode === "swap"
              ? "Preview swap"
              : reverse
                ? "Review withdrawal"
                : addressReady
                  ? "Deposit address ready"
                  : "Create deposit address";
  const disabled =
    connected &&
    state === "connected" &&
    ((mode === "swap" && !preview) ||
      (redeem && (!preview || preview.below || !destination.trim())) ||
      (!reverse && mode === "bridge" && addressReady));
  const actionButton = (
    <button
      className="operate-button"
      onClick={primary}
      disabled={Boolean(disabled)}
    >
      {action}
      <span className="action-light" aria-hidden="true" />
    </button>
  );
  const networks = (
    <div className="network-pair">
      <span>
        <i className="network-dot monero-dot" />
        Monero
      </span>
      <span className="pair-line" />
      <span>
        <i className="network-dot solana-dot" />
        Solana
      </span>
    </div>
  );
  function selection(kind: Token) {
    const t = tokens[kind];
    if (kind === "wxmr")
      return (
        <div className="fixed-asset">
          <Symbol kind="wxmr" />
          <span>wXMR</span>
        </div>
      );
    return (
      <button
        className="asset-select"
        onClick={() => {
          setSearch("");
          setModal("tokens");
        }}
        aria-label="Select Solana token"
      >
        <Symbol kind={kind} />
        <span>{t.ticker}</span>
        <Chevron />
      </button>
    );
  }
  const fields = (
    <div className="trade-fields">
      <div className="trade-field origin">
        <div className="field-top">
          <span>{mode === "swap" ? "You pay" : "From"}</span>
          <span className="field-network">
            {mode === "swap"
              ? "Solana"
              : reverse
                ? "Solana network"
                : "Monero network"}
          </span>
        </div>
        <div className="field-main">
          {mode === "swap" || reverse ? (
            <input
              className="amount"
              aria-label="Amount to send"
              inputMode="decimal"
              placeholder="0"
              autoComplete="off"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          ) : (
            <div className="native-name">
              <strong>Native Monero</strong>
              <span>Send from your Monero wallet</span>
            </div>
          )}
          {mode === "swap" ? (
            selection(payToken)
          ) : (
            <div className="fixed-asset">
              <Symbol kind={reverse ? "wxmr" : "xmr"} />
              <span>{reverse ? "wXMR" : "XMR"}</span>
            </div>
          )}
        </div>
        {(mode === "swap" || reverse) && (
          <div className="field-bottom">
            {mode === "swap"
              ? "Quote preview"
              : reverse
                ? "Balance appears after wallet connection"
                : null}
          </div>
        )}
      </div>
      <div className="switch-space">
        <button
          className="direction-switch"
          aria-label={mode === "swap" ? "Reverse swap" : "Reverse bridge"}
          onClick={() => {
            if (mode === "swap") setSellWrapped(!sellWrapped);
            else setReverse(!reverse);
            setAmount("");
            setAddressReady(false);
            setCopied(false);
          }}
        >
          <ExchangeArrow />
        </button>
      </div>
      <div className="trade-field destination">
        <div className="field-top">
          <span>{mode === "swap" ? "You receive" : "To"}</span>
          <span className="field-network">
            {mode === "swap"
              ? "Solana"
              : reverse
                ? "Monero network"
                : "Solana network"}
          </span>
        </div>
        <div className="field-main">
          {mode === "swap" ? (
            <output className="amount empty">—</output>
          ) : reverse ? (
            <output
              className={`amount ${preview ? "" : "empty"}`}
              aria-label="Estimated XMR received"
            >
              {preview?.receive || "0"}
            </output>
          ) : (
            <div className="native-name">
              <strong>Wrapped Monero</strong>
              <span>Receive in your Solana wallet</span>
            </div>
          )}
          {mode === "swap" ? (
            selection(receiveToken)
          ) : (
            <div className="fixed-asset">
              <Symbol kind={reverse ? "xmr" : "wxmr"} />
              <span>{reverse ? "XMR" : "wXMR"}</span>
            </div>
          )}
        </div>
        {(mode === "swap" || reverse) && (
          <div className="field-bottom">
            {mode === "swap"
              ? "No live quote in design preview"
              : reverse
                ? "Fee calculation only · illustrative"
                : null}
          </div>
        )}
      </div>
    </div>
  );
  const destinationField = redeem ? (
    <div className="destination-address">
      <label htmlFor="destination-address">Monero destination</label>
      <input
        id="destination-address"
        placeholder="Use “demo” to explore this flow"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        autoComplete="off"
      />
    </div>
  ) : null;
  const facts =
    mode === "swap" ? (
      <div className="facts">
        <span>Solana tokens only</span>
        <span>Jupiter integration in final build</span>
      </div>
    ) : (
      <div className="facts">
        <span>
          Bridge fee <b>0.1%</b>
        </span>
        <span>
          Minimum <b>0.1 XMR</b>
        </span>
        {!reverse && (
          <span>
            <b>10</b> confirmations
          </span>
        )}
      </div>
    );
  const status = (
    <>
      {preview?.below && redeem && (
        <p className="inline-error" role="alert">
          Minimum withdrawal is 0.1 XMR.
        </p>
      )}
      {state === "error" && (
        <p className="inline-error" role="alert">
          Simulated connection error. Retry the preview.
        </p>
      )}
      {addressReady && !reverse && mode === "bridge" && (
        <div className="deposit-preview">
          <span className="demo-label">SIMULATED ADDRESS AREA</span>
          <p>Your reusable Monero deposit address</p>
          <code>DEMO — DO NOT SEND FUNDS</code>
          <div className="deposit-actions">
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    "DEMO — DO NOT SEND FUNDS",
                  );
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
            >
              {copied ? "Copied demo label" : "Copy demo label"}
            </button>
            <button
              onClick={() => {
                setState("pending");
                setModal("activity");
              }}
            >
              Preview deposit status
            </button>
          </div>
        </div>
      )}
    </>
  );
  const operation = (
    <>
      <div className="module-heading">
        <h1>{mode === "swap" ? "Swap" : "Bridge"}</h1>
        <div className="module-tools">
          {mode === "bridge" && (
            <span className="small-direction">
              {reverse ? "Solana to Monero" : "Monero to Solana"}
            </span>
          )}
          <button
            aria-label="Open connection settings"
            className="settings-button"
            onClick={() => setModal("rpc")}
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              width="18"
              height="18"
              aria-hidden="true"
            >
              <path
                d="M3 6h14M3 14h14M7 3v6m6 2v6"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
      {fields}
      {destinationField}
      {status}
      {actionButton}
      {facts}
    </>
  );
  return (
    <div className={`study concept-${concept}`} ref={surface}>
      <a className="study-skip" href="#transaction">
        Skip to operation
      </a>
      <div className="optical-background" aria-hidden="true">
        <div className="optical-plane plane-one" />
        <div className="optical-plane plane-two" />
        <div className="light-sheet" />
        <div className="horizon" />
      </div>
      <header className="study-header">
        <Link
          href="/"
          className="study-brand"
          aria-label="wXMR home"
        >
          <span className="brand-emblem" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          wXMR<span className="brand-point">.</span>
        </Link>
        <nav aria-label="Product navigation">
          {(["bridge", "swap", "reserves"] as const).map((m) => (
            <button
              key={m}
              aria-current={mode === m ? "page" : undefined}
              onClick={() => changeMode(m)}
            >
              {m === "bridge" ? "Bridge" : m === "swap" ? "Swap" : "Reserves"}
              {mode === m && <span className="nav-current" />}
            </button>
          ))}
        </nav>
        <div className="header-right">
          <button
            className="wallet-button"
            onClick={() =>
              connected ? setModal("states") : setModal("wallet")
            }
          >
            <span className={`wallet-dot ${connected ? "connected" : ""}`} />
            {connected ? "Demo wallet" : "Connect wallet"}
          </button>
          <button
            className="more-button"
            aria-label="Open menu"
            onClick={() => setModal("menu")}
          >
            ···
          </button>
        </div>
      </header>
      <main
        id="transaction"
        className={mode === "reserves" ? "reserve-stage" : "transaction-stage"}
      >
        {mode === "reserves" ? (
          <section className="reserve-surface">
            <div className="module-heading">
              <h1>Reserves</h1>
              <span className="proof-label">EVIDENCE, AT A POINT IN TIME</span>
            </div>
            <p className="reserve-intro">
              Inspect the backing.
              <br />
              <span>Verify it on your terms.</span>
            </p>
            <div className="reserve-grid">
              <div>
                <span>Reported unspent XMR</span>
                <strong>—</strong>
              </div>
              <div>
                <span>wXMR supply reference</span>
                <strong>—</strong>
              </div>
              <div>
                <span>Publisher check</span>
                <strong>Not loaded</strong>
              </div>
            </div>
            <p className="reserve-note">
              This study does not load live reserve data. Published proofs show
              evidence at a recorded time; they do not guarantee future
              redemption.
            </p>
            <button
              className="outline-button"
              onClick={() => setModal("proof")}
            >
              Preview verification materials
            </button>
          </section>
        ) : (
          <div className="compact-composition">
            <div className="a-topline">{networks}</div>
            <section
              className={`transaction-module compact-module ${concept === "a" ? "a-module" : "b-module"}`}
            >
              {operation}
            </section>
            <div className="under-module">
              <button onClick={() => setModal("activity")}>
                Your activity
                {state === "pending" && <i className="pending-dot" />}
              </button>
              <button onClick={() => changeMode("reserves")}>
                Verify reserves
              </button>
            </div>
          </div>
        )}
      </main>
      <footer className="study-footer">
        <div className="study-identification">
          <span className="concept-letter">{concept.toUpperCase()}</span>
          <span>{names[concept]}</span>
        </div>
        <button className="preview-badge" onClick={() => setModal("states")}>
          <i />
          Design preview
        </button>
      </footer>
      <div className="demo-disclosure">
        Demo only · No wallet connection or transactions
      </div>
      {modal && (
        <Modal
          title={
            modal === "wallet"
              ? "Connect wallet"
              : modal === "tokens"
                ? "Select token"
                : modal === "review"
                  ? "Review preview"
                  : modal === "activity"
                    ? "Your activity"
                    : modal === "menu"
                      ? "wXMR"
                      : modal === "docs"
                        ? "The bridge"
                        : modal === "rpc"
                          ? "Connection settings"
                          : modal === "states"
                            ? "Preview states"
                            : "Verification materials"
          }
          onClose={() => setModal(null)}
        >
          {modal === "wallet" && (
            <>
              <p className="modal-copy">
                This is an isolated design preview. Wallet connection is
                simulated.
              </p>
              <button
                className="wallet-option"
                onClick={() => {
                  setState("connected");
                  setModal(null);
                }}
              >
                <span className="wallet-option-icon">W</span>
                <span>
                  Demo wallet<small>Explore the connected interface</small>
                </span>
                <span>Connect</span>
              </button>
              <p className="modal-fine">
                No wallet extension will open. No message or transaction is
                signed.
              </p>
            </>
          )}
          {modal === "tokens" && (
            <>
              <input
                className="modal-input"
                aria-label="Search token"
                placeholder="Search token"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="token-list">
                {(Object.keys(tokens) as Token[])
                  .filter((t) => t !== "wxmr")
                  .filter((t) =>
                    (tokens[t].name + tokens[t].ticker)
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                  )
                  .map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setToken(t);
                        setModal(null);
                        setAmount("");
                      }}
                    >
                      <Symbol kind={t} />
                      <span>
                        {tokens[t].ticker}
                        <small>{tokens[t].name}</small>
                      </span>
                      <span className="token-network">Solana</span>
                    </button>
                  ))}
              </div>
              <p className="modal-fine">
                Representative assets for interface review. Quotes are not
                requested.
              </p>
            </>
          )}
          {modal === "review" && (
            <>
              <span className="review-demo">SIMULATION ONLY</span>
              <dl className="review-lines">
                <div>
                  <dt>You send</dt>
                  <dd>
                    {amount}{" "}
                    {mode === "swap" ? tokens[payToken].ticker : "wXMR"}
                  </dd>
                </div>
                <div>
                  <dt>You receive</dt>
                  <dd>
                    {mode === "swap"
                      ? "No live quote"
                      : `${preview?.receive || "—"} XMR`}
                  </dd>
                </div>
                <div>
                  <dt>{mode === "swap" ? "Network" : "Bridge fee"}</dt>
                  <dd>
                    {mode === "swap" ? "Solana" : `${preview?.fee || "—"} wXMR`}
                  </dd>
                </div>
              </dl>
              {redeem && (
                <p className="review-destination">
                  Demo destination: {destination}
                </p>
              )}
              <p className="modal-copy">
                In the real product, the full transaction and destination are
                reviewed before wallet approval.
              </p>
              <button
                className="operate-button"
                onClick={() => {
                  setState("pending");
                  setModal("activity");
                }}
              >
                Preview pending state
              </button>
            </>
          )}
          {modal === "activity" && (
            <>
              <p className="modal-fine">SIMULATED WALLET ACTIVITY</p>
              {state === "pending" ? (
                <div className="activity-preview">
                  <span className="state-tag">Pending · Demo</span>
                  <h3>
                    {mode === "bridge" && !reverse
                      ? "Deposit confirming"
                      : "Request pending"}
                  </h3>
                  <p>
                    {mode === "bridge" && !reverse
                      ? "6 of 10 Monero confirmations — illustrative snapshot."
                      : "A real request would show its current protocol status here."}
                  </p>
                  <button
                    className="outline-button"
                    onClick={() => setState("completed")}
                  >
                    Preview completed state
                  </button>
                </div>
              ) : state === "completed" ? (
                <div className="activity-preview">
                  <span className="state-tag">Completed · Demo</span>
                  <h3>Transfer complete</h3>
                  <p>This is a visual state. No funds have moved.</p>
                  <button
                    className="outline-button"
                    onClick={() => {
                      setState("connected");
                      setModal(null);
                      setAddressReady(false);
                    }}
                  >
                    Return to operation
                  </button>
                </div>
              ) : (
                <div className="activity-preview empty-state">
                  <span className="empty-mark">—</span>
                  <h3>No transfers yet</h3>
                  <p>
                    {connected
                      ? "Your wallet activity appears here."
                      : "Connect a wallet to view its transfers."}
                  </p>
                </div>
              )}
            </>
          )}
          {modal === "menu" && (
            <div className="menu-list">
              <button onClick={() => setModal("activity")}>
                Activity<span>Wallet operations</span>
              </button>
              <button onClick={() => setModal("docs")}>
                How it works<span>Networks, fees & privacy</span>
              </button>
              <button onClick={() => setModal("rpc")}>
                Solana RPC<span>Available without a wallet</span>
              </button>
              <button onClick={() => setModal("states")}>
                Design preview<span>Review interface states</span>
              </button>
              <a
                href="https://github.com/sullystuff/wxmr-frontend"
                target="_blank"
                rel="noreferrer"
              >
                Source code<span>GitHub</span>
              </a>
            </div>
          )}
          {modal === "docs" && (
            <div className="protocol-notes">
              <h3>Monero to Solana</h3>
              <p>
                Connect a Solana wallet, create a reusable Monero deposit
                address, then send at least 0.1 XMR from your Monero wallet.
                Minting becomes eligible after 10 Monero confirmations.
              </p>
              <h3>Solana to Monero</h3>
              <p>
                Enter the wXMR amount and your full Monero destination. Review
                and approve the withdrawal request in your wallet. The bridge
                fee is 0.1% in either direction.
              </p>
              <h3>Privacy & custody</h3>
              <p>
                wXMR balances and transfers are public on Solana. Bridge records
                can link wallets, addresses, amounts and timing. wXMR does not
                extend Monero’s transaction privacy to Solana. Reserve proofs do
                not remove custody risk.
              </p>
            </div>
          )}
          {modal === "rpc" && (
            <>
              <p className="modal-copy">
                RPC configuration remains accessible without a wallet. This
                control is a design preview; no endpoint is contacted or saved.
              </p>
              <label className="modal-label" htmlFor="rpc-preview">
                Solana mainnet endpoint
              </label>
              <input
                className="modal-input"
                id="rpc-preview"
                type="url"
                placeholder="https://your-rpc-endpoint"
                value={rpc}
                onChange={(e) => {
                  setRPC(e.target.value);
                  setRPCMessage("");
                }}
              />
              <button
                className="operate-button"
                onClick={() =>
                  setRPCMessage(
                    "Preview only — connection settings were not changed.",
                  )
                }
              >
                Preview connection setting
              </button>
              {rpcMessage && (
                <p className="modal-fine" role="status">
                  {rpcMessage}
                </p>
              )}
            </>
          )}
          {modal === "states" && (
            <>
              <p className="modal-copy">
                Use the same demonstration state to compare all three
                directions. All operations remain simulated.
              </p>
              <div className="state-options">
                {(
                  [
                    "disconnected",
                    "connected",
                    "pending",
                    "completed",
                    "error",
                  ] as State[]
                ).map((s) => (
                  <button
                    key={s}
                    aria-pressed={state === s}
                    onClick={() => {
                      setState(s);
                      setModal(null);
                    }}
                  >
                    {s}
                    <span>{state === s ? "Selected" : "Preview"}</span>
                  </button>
                ))}
              </div>
              <button className="reset-preview" onClick={reset}>
                Reset preview
              </button>
            </>
          )}
          {modal === "proof" && (
            <>
              <p className="modal-copy">
                The full product will retain published proofs, signed messages,
                full reports, historical records, reference timestamps and
                official addresses.
              </p>
              <div className="proof-preview">
                <span>Reserve proof</span>
                <span>Signed message</span>
                <span>Full report</span>
              </div>
              <p className="modal-fine">
                No proof files or reserve figures are fabricated for this visual
                exploration.
              </p>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
