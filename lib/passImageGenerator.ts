import QRCode from "qrcode";
import { Resvg } from "@resvg/resvg-js";
import { EVENT_DATA } from "@/data/event";

export interface PassImageOptions {
  ticketNumber: string;
  teamName: string;
  dates?: string;
  venueCampus?: string;
  venueCity?: string;
}

/**
 * Generates an ultra-crisp PNG Buffer of the official Hackverse Entry Pass
 * matching the exact neo-brutalist badge mockup.
 */
export async function generatePassPngBuffer(options: PassImageOptions): Promise<Buffer> {
  const ticketNumber = options.ticketNumber || "HV26-241263";
  const teamName = (options.teamName || "JHATUGANG").toUpperCase();
  const dates = options.dates || EVENT_DATA.displayDates || "OCTOBER 08 - 10, 2026";
  const venueCampus = options.venueCampus || EVENT_DATA.location?.campus || "Government College of Engineering Kalahandi";
  const venueCity = options.venueCity || `${EVENT_DATA.location?.city || "Bhawanipatna"}, ${EVENT_DATA.location?.state || "Odisha"}`;

  // Generate clean QR code SVG
  const qrData = `HACKVERSE26_PASS:${ticketNumber}:${teamName}`;
  const qrSvgRaw = await QRCode.toString(qrData, {
    type: "svg",
    margin: 1,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  // Extract inner SVG content or base64 data url
  const qrBase64 = `data:image/svg+xml;utf8,${encodeURIComponent(qrSvgRaw)}`;

  // Barcode pattern bars
  const barWidths = [4, 2, 5, 2, 7, 3, 4, 6, 2, 5, 3, 7, 2, 4, 3, 6, 4, 2, 8, 3, 5, 2, 4, 3, 6, 2, 5, 3, 7, 2, 4, 3, 6, 4, 2];
  let currentX = 0;
  const barcodeBarsSvg = barWidths
    .map((w) => {
      const rect = `<rect x="${currentX}" y="0" width="${w}" height="42" fill="#000000" />`;
      currentX += w + 2.5;
      return rect;
    })
    .join("\n");

  const totalBarcodeWidth = currentX;

  // Render SVG Template (Exact proportions and neo-brutalist styling)
  const svg = `
<svg width="720" height="740" viewBox="0 0 720 740" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;900&amp;family=IBM+Plex+Mono:wght@600;700;800&amp;family=IBM+Plex+Sans:wght@700;800&amp;display=swap');
      .font-sans { font-family: 'Space Grotesk', 'IBM Plex Sans', sans-serif; }
      .font-mono { font-family: 'IBM Plex Mono', monospace; }
    </style>
  </defs>

  <!-- Outer Canvas Background -->
  <rect width="720" height="740" fill="#0D0D11" />

  <!-- Pass Card Container -->
  <g transform="translate(30, 30)">
    <!-- White Card Base -->
    <rect width="660" height="680" fill="#FFFFFF" stroke="#000000" stroke-width="5" />

    <!-- Left Punch Notch -->
    <circle cx="0" cy="115" r="14" fill="#0D0D11" stroke="#000000" stroke-width="5" />

    <!-- Ticket Header (Black Banner) -->
    <rect x="0" y="0" width="660" height="115" fill="#000000" />
    <line x1="0" y1="115" x2="660" y2="115" stroke="#000000" stroke-width="5" />

    <!-- Yellow Terminal Box -->
    <g transform="translate(25, 25)">
      <rect width="65" height="65" fill="#FACC15" stroke="#000000" stroke-width="3" />
      <text x="12" y="44" font-family="'IBM Plex Mono', monospace" font-size="34" font-weight="900" fill="#000000">&gt;_</text>
    </g>

    <!-- Header Titles -->
    <text x="105" y="54" class="font-sans" font-size="22" font-weight="900" fill="#FFFFFF" letter-spacing="1">HACKVERSE '26 ENTRY PASS</text>
    <text x="105" y="77" class="font-mono" font-size="13" font-weight="800" fill="#FACC15" letter-spacing="1.5">CODEBREAKERS // GCE KALAHANDI</text>

    <!-- Ticket Identifier Box -->
    <g transform="translate(470, 28)">
      <rect width="165" height="58" rx="6" fill="#141417" stroke="#333333" stroke-width="1.5" />
      <text x="82" y="22" text-anchor="middle" class="font-mono" font-size="10" font-weight="700" fill="#8E8E98" letter-spacing="1">TICKET IDENTIFIER</text>
      <text x="82" y="46" text-anchor="middle" class="font-mono" font-size="18" font-weight="900" fill="#F59E0B" letter-spacing="2">${ticketNumber}</text>
    </g>

    <!-- Body Section -->
    <g transform="translate(30, 140)">
      <!-- Team Designation -->
      <text x="0" y="20" class="font-mono" font-size="11" font-weight="800" fill="#71717A" letter-spacing="1">TEAM DESIGNATION</text>
      <text x="0" y="55" class="font-sans" font-size="30" font-weight="900" fill="#000000" letter-spacing="-0.5">${teamName}</text>

      <!-- Access Tier Badge -->
      <g transform="translate(440, 5)">
        <text x="160" y="15" text-anchor="end" class="font-mono" font-size="11" font-weight="800" fill="#71717A" letter-spacing="1">ACCESS TIER</text>
        <rect x="25" y="25" width="135" height="34" fill="#CCFBF1" stroke="#000000" stroke-width="2.5" />
        <text x="92" y="47" text-anchor="middle" class="font-mono" font-size="11" font-weight="900" fill="#115E59" letter-spacing="1">ALL-ACCESS PASS</text>
      </g>

      <!-- Divider 1 -->
      <line x1="0" y1="85" x2="600" y2="85" stroke="#000000" stroke-width="4" />

      <!-- Row: Dates & Venue -->
      <g transform="translate(0, 110)">
        <!-- Dates Box -->
        <rect x="0" y="0" width="46" height="46" fill="#FFE4E6" stroke="#000000" stroke-width="2.5" />
        <text x="23" y="32" text-anchor="middle" font-size="22">📅</text>
        <text x="60" y="12" class="font-mono" font-size="10" font-weight="800" fill="#71717A" letter-spacing="1">EVENT DATES</text>
        <text x="60" y="29" class="font-sans" font-size="15" font-weight="900" fill="#000000">${dates}</text>
        <text x="60" y="44" class="font-mono" font-size="11" font-weight="600" fill="#52525B">24-Hour Continuous Hackathon</text>

        <!-- Venue Box -->
        <g transform="translate(305, 0)">
          <rect x="0" y="0" width="46" height="46" fill="#FEF3C7" stroke="#000000" stroke-width="2.5" />
          <text x="23" y="32" text-anchor="middle" font-size="22">📍</text>
          <text x="60" y="12" class="font-mono" font-size="10" font-weight="800" fill="#71717A" letter-spacing="1">REPORTING VENUE</text>
          <text x="60" y="29" class="font-sans" font-size="13" font-weight="900" fill="#000000">${venueCampus.length > 28 ? venueCampus.substring(0, 26) + "..." : venueCampus}</text>
          <text x="60" y="44" class="font-mono" font-size="11" font-weight="600" fill="#52525B">${venueCity}</text>
        </g>
      </g>

      <!-- Divider 2 -->
      <line x1="0" y1="185" x2="600" y2="185" stroke="#000000" stroke-width="4" />

      <!-- Perks Strip -->
      <g transform="translate(0, 210)">
        <rect width="600" height="44" rx="3" fill="#F0FDF4" stroke="#000000" stroke-width="2.5" />
        <text x="20" y="28" font-size="16">🛡️</text>
        <text x="48" y="27" class="font-sans" font-size="12" font-weight="800" fill="#000000">Includes 24h Arena Access, &amp; Certifications.</text>
        <text x="580" y="27" text-anchor="end" class="font-mono" font-size="11" font-weight="800" fill="#71717A">SECURE #HV26</text>
      </g>

      <!-- QR Code & Barcode Section -->
      <g transform="translate(0, 285)">
        <!-- QR Box -->
        <rect x="0" y="0" width="115" height="115" fill="#FFFFFF" stroke="#000000" stroke-width="3" />
        <image href="${qrBase64}" x="7.5" y="7.5" width="100" height="100" />

        <!-- Check-in labels -->
        <g transform="translate(130, 20)">
          <text x="0" y="15" class="font-mono" font-size="10" font-weight="800" fill="#71717A" letter-spacing="1">FAST-TRACK CHECK-IN</text>
          <text x="0" y="38" class="font-sans" font-size="15" font-weight="900" fill="#000000">Scan at Registration Desk</text>
          <text x="0" y="60" class="font-mono" font-size="12" font-weight="800" fill="#059669">✓ VERIFIED ON ROSTER</text>
        </g>

        <!-- Barcode Right -->
        <g transform="translate(370, 25)">
          <g transform="translate(${Math.max(0, (230 - totalBarcodeWidth) / 2)}, 0)">
            ${barcodeBarsSvg}
          </g>
          <text x="115" y="66" text-anchor="middle" class="font-mono" font-size="13" font-weight="800" fill="#000000" letter-spacing="3">* ${ticketNumber} *</text>
        </g>
      </g>
    </g>

    <!-- Bottom Footer Bar -->
    <rect x="0" y="630" width="660" height="50" fill="#000000" />
    <line x1="0" y1="630" x2="660" y2="630" stroke="#000000" stroke-width="5" />
    <text x="25" y="660" class="font-mono" font-size="11" font-weight="800" fill="#FFFFFF" letter-spacing="1">HACKVERSE 2026 OFFICIAL STATE HACKATHON</text>
    <text x="635" y="660" text-anchor="end" class="font-mono" font-size="11" font-weight="800" fill="#FFFFFF" letter-spacing="1">GOVT. COLLEGE OF ENGINEERING KALAHANDI</text>
  </g>
</svg>
`;

  // Render SVG to 3x PNG buffer with resvg
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: "zoom",
      value: 2.0, // High quality 2x resolution
    },
    background: "#0D0D11",
  });

  const pngData = resvg.render();
  return pngData.asPng();
}
