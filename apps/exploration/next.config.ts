import type { NextConfig } from "next";
import path from "path";
const config: NextConfig = {
  distDir: process.env.WXMR_EXPLORATION_DIST || ".next",
  outputFileTracingRoot: path.join(__dirname, "../../"),
  devIndicators: false,
};
export default config;
