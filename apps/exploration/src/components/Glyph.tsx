export function Symbol({
  kind = "wxmr",
}: {
  kind?: "wxmr" | "xmr" | "sol" | "usdc";
}) {
  return (
    <span className={`symbol symbol-${kind}`} aria-hidden="true">
      {kind === "xmr" ? (
        <svg viewBox="0 0 32 32" fill="none">
          <path
            d="M5 24V9l11 10L27 9v15M2 24h8m12 0h8"
            stroke="currentColor"
            strokeWidth="2.7"
          />
        </svg>
      ) : kind === "sol" ? (
        <svg viewBox="0 0 32 32" fill="currentColor">
          <path d="m8 7-4 4h20l4-4H8Zm-4 7 4 4h20l-4-4H4Zm4 7-4 4h20l4-4H8Z" />
        </svg>
      ) : kind === "usdc" ? (
        <span>$</span>
      ) : (
        <svg viewBox="0 0 32 32" fill="none">
          <path
            d="m4 8 7 17 5-10 5 10 7-17M10 6h12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}
export function Chevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m4 6 4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function ExchangeArrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 4v16m-6-6 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
