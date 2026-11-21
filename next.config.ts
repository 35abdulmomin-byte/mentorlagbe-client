import type { NextConfig } from "next";

// শেষের স্ল্যাশ থাকলে বাদ দেওয়া হয়
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const nextConfig: NextConfig = {
  // auth আর jwt রিকোয়েস্ট client এর নিজের ডোমেইন দিয়ে server এ যাবে,
  // ফলে সেশন cookie first-party হয় আর ব্রাউজার আটকায় না
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${API_URL}/api/auth/:path*`,
      },
      {
        source: "/api/jwt",
        destination: `${API_URL}/jwt`,
      },
    ];
  },
};

export default nextConfig;