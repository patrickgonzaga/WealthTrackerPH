import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rzeqxhemvucyhplqizqa.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZXF4aGVtdnVjeWhwbHFpenFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjQ2ODAsImV4cCI6MjA4NjkwMDY4MH0.of-nIGVFhslBOL0_fbm5gunbXYcnYK2mJmqO8Zj3WLg',
  },
};

export default nextConfig;
