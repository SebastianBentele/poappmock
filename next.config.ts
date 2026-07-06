import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/profitability", destination: "/finanzen", permanent: false },
      { source: "/payouts", destination: "/finanzen", permanent: false },
    ];
  },
};

export default nextConfig;
