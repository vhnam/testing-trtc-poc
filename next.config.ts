import type { NextConfig } from 'next';
import path from 'path';
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';

// Function to copy directory recursively
function copyDir(src: string, dest: string) {
  if (!existsSync(src)) return;

  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  const files = readdirSync(src);

  files.forEach((file) => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);

    if (statSync(srcFile).isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      copyFileSync(srcFile, destFile);
    }
  });
}

// Copy TRTC assets on startup (works with both webpack and Turbopack)
const assetsSource = path.resolve(process.cwd(), 'node_modules/trtc-sdk-v5/assets');
const assetsDest = path.resolve(process.cwd(), 'public/assets/trtc-sdk');

try {
  copyDir(assetsSource, assetsDest);
  console.log('✅ TRTC SDK assets copied to public/assets');
} catch (error) {
  console.log('⚠️ TRTC SDK assets not found or already copied');
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  experimental: {
    optimizePackageImports: ['@tabler/icons-react'],
  },
};

export default nextConfig;
