import { Resvg } from "@resvg/resvg-js";
import fs from "fs";
import path from "path";

const fontPath = path.resolve("public/font/Thuast-Demo.otf");
const fontBuffer = fs.readFileSync(fontPath);

const logoPath = path.resolve("public/cblogo.png");
const logoBase64 = fs.readFileSync(logoPath).toString("base64");
const logoDataUri = `data:image/png;base64,${logoBase64}`;

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="1200" height="630" fill="#FFD93D" stroke="#000000" stroke-width="24" />

  <!-- Inner dashed border -->
  <rect x="36" y="36" width="1128" height="558" fill="none" stroke="#000000" stroke-width="4" stroke-dasharray="8 8" />

  <!-- Top Badges Row -->
  <g transform="translate(60, 56)">
    <!-- Brand Box with Logo -->
    <rect x="0" y="0" width="375" height="50" fill="#000000" />
    <image href="${logoDataUri}" x="12" y="8" width="34" height="34" />
    <text x="58" y="33" fill="#FFD93D" font-family="Arial, sans-serif" font-weight="900" font-size="19" letter-spacing="1.5">
      CODEBREAKERS // GCEK
    </text>
  </g>

  <g transform="translate(760, 56)">
    <!-- Sprint Box -->
    <rect x="0" y="0" width="380" height="50" fill="#FF6B6B" stroke="#000000" stroke-width="4" />
    <text x="190" y="33" fill="#000000" font-family="Arial, sans-serif" font-weight="900" font-size="19" text-anchor="middle" letter-spacing="1">
      ⚡ 36-HOUR STATE HACKATHON
    </text>
  </g>

  <!-- Main Hero Title using Thuast font (matches website hero exactly) -->
  <g transform="translate(60, 248)">
    <!-- Slanted + Extended Cyber Styling matching website -->
    <g transform="skewX(-13) scale(1.2, 1)">
      <!-- Drop Shadow -->
      <text x="5" y="5" fill="#000000" fill-opacity="0.25" stroke="#000000" stroke-width="4" stroke-opacity="0.25" font-family="Thuast Demo" font-size="88" letter-spacing="2" style="paint-order: stroke fill;">
        HACKVERSE <tspan fill="#FF6B6B" stroke="#FF6B6B" stroke-width="4" fill-opacity="0.25" stroke-opacity="0.25">&apos;26</tspan>
      </text>
      <!-- Foreground -->
      <text x="0" y="0" fill="#000000" stroke="#000000" stroke-width="4" font-family="Thuast Demo" font-size="88" letter-spacing="2" style="paint-order: stroke fill;">
        HACKVERSE <tspan fill="#FF6B6B" stroke="#FF6B6B" stroke-width="4">&apos;26</tspan>
      </text>
    </g>
  </g>

  <!-- Subtitle -->
  <g transform="translate(60, 310)">
    <text x="0" y="0" fill="#1A1A1A" font-family="Arial, sans-serif" font-weight="900" font-size="28" letter-spacing="-0.5">
      Flagship State Tech Fest &amp; Hackathon • GCEK Bhawanipatna
    </text>
    <text x="0" y="38" fill="#222222" font-family="Arial, sans-serif" font-weight="700" font-size="20">
      Innovation • Code • Web3 • AI/ML • Cloud • Cybersecurity
    </text>
  </g>

  <!-- Divider Line -->
  <line x1="60" y1="415" x2="1140" y2="415" stroke="#000000" stroke-width="5" />

  <!-- Bottom Tracks & Prize Matrix -->
  <g transform="translate(60, 455)">
    <!-- Track 1 -->
    <g transform="translate(0, 0)">
      <rect x="0" y="0" width="125" height="46" fill="#FFFFFF" stroke="#000000" stroke-width="4" />
      <text x="62" y="30" fill="#000000" font-family="Arial, sans-serif" font-weight="900" font-size="17" text-anchor="middle">AI / ML</text>
    </g>

    <!-- Track 2 -->
    <g transform="translate(140, 0)">
      <rect x="0" y="0" width="115" height="46" fill="#FFFFFF" stroke="#000000" stroke-width="4" />
      <text x="57" y="30" fill="#000000" font-family="Arial, sans-serif" font-weight="900" font-size="17" text-anchor="middle">WEB3</text>
    </g>

    <!-- Track 3 -->
    <g transform="translate(270, 0)">
      <rect x="0" y="0" width="145" height="46" fill="#FFFFFF" stroke="#000000" stroke-width="4" />
      <text x="72" y="30" fill="#000000" font-family="Arial, sans-serif" font-weight="900" font-size="17" text-anchor="middle">CYBER SEC</text>
    </g>

    <!-- Track 4 -->
    <g transform="translate(430, 0)">
      <rect x="0" y="0" width="160" height="46" fill="#FFFFFF" stroke="#000000" stroke-width="4" />
      <text x="80" y="30" fill="#000000" font-family="Arial, sans-serif" font-weight="900" font-size="17" text-anchor="middle">CLOUD &amp; IOT</text>
    </g>
  </g>

  <!-- Prize Pool Badge (35K+) -->
  <g transform="translate(760, 445)">
    <rect x="0" y="0" width="380" height="66" fill="#00E5FF" stroke="#000000" stroke-width="5" />
    <text x="190" y="44" fill="#000000" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="28" text-anchor="middle">
      🏆 ₹35K+ PRIZE POOL
    </text>
  </g>

  <!-- Bottom Details Bar -->
  <g transform="translate(60, 565)">
    <text x="0" y="0" fill="#000000" font-family="Arial, sans-serif" font-weight="900" font-size="18" letter-spacing="1">
      REGISTER: HACKVERSE.CODEBREAKERSGCEK.TECH
    </text>
    <text x="1080" y="0" fill="#000000" font-family="Arial, sans-serif" font-weight="900" font-size="18" text-anchor="end" letter-spacing="1">
      SEP 18-26, 2026
    </text>
  </g>
</svg>
`;

try {
  const resvg = new Resvg(svg, {
    font: {
      fontBuffers: [fontBuffer],
      loadSystemFonts: true,
    },
    fitTo: {
      mode: "width",
      value: 1200,
    },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  const outPath1 = path.resolve("public/og-image.png");
  const outPath2 = path.resolve("public/og.png");

  fs.writeFileSync(outPath1, pngBuffer);
  fs.writeFileSync(outPath2, pngBuffer);
  console.log("Successfully generated public/og-image.png and public/og.png (" + (pngBuffer.length / 1024).toFixed(2) + " KB)");
} catch (err) {
  console.error("Failed to generate OG image:", err);
}
