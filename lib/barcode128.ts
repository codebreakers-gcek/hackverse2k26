/**
 * Standard Code 128 Barcode Generator
 * Encodes ASCII alphanumeric strings into standard Code 128-B bar/space patterns.
 * Decodable by all standard 1D hardware scanners and software camera decoders.
 */

// Code 128 patterns: 6 widths per symbol (bar, space, bar, space, bar, space) summing to 11
// Index 106 (Stop) has 7 widths summing to 13
const CODE128_PATTERNS: number[][] = [
  [2, 1, 2, 2, 2, 2], // 0 (space)
  [2, 2, 2, 1, 2, 2], // 1 (!)
  [2, 2, 2, 2, 2, 1], // 2 (")
  [1, 2, 1, 2, 2, 3], // 3 (#)
  [1, 2, 1, 3, 2, 2], // 4 ($)
  [1, 3, 1, 2, 2, 2], // 5 (%)
  [1, 2, 2, 2, 1, 3], // 6 (&)
  [1, 2, 2, 3, 1, 2], // 7 (')
  [1, 3, 2, 2, 1, 2], // 8 (()
  [2, 2, 1, 2, 1, 3], // 9 ())
  [2, 2, 1, 3, 1, 2], // 10 (*)
  [2, 3, 1, 2, 1, 2], // 11 (+)
  [1, 1, 2, 2, 3, 2], // 12 (,)
  [1, 2, 2, 1, 3, 2], // 13 (-)
  [1, 2, 2, 2, 3, 1], // 14 (.)
  [1, 1, 3, 2, 2, 2], // 15 (/)
  [1, 2, 3, 1, 2, 2], // 16 (0)
  [1, 2, 3, 2, 2, 1], // 17 (1)
  [2, 2, 3, 2, 1, 1], // 18 (2)
  [2, 2, 1, 1, 3, 2], // 19 (3)
  [2, 2, 1, 2, 3, 1], // 20 (4)
  [2, 1, 3, 2, 1, 2], // 21 (5)
  [2, 2, 3, 1, 1, 2], // 22 (6)
  [3, 1, 2, 1, 3, 1], // 23 (7)
  [3, 1, 1, 2, 2, 2], // 24 (8)
  [3, 2, 1, 1, 2, 2], // 25 (9)
  [3, 2, 1, 2, 2, 1], // 26 (:)
  [3, 1, 2, 2, 1, 2], // 27 (;)
  [3, 2, 2, 1, 1, 2], // 28 (<)
  [3, 2, 2, 2, 1, 1], // 29 (=)
  [2, 1, 2, 1, 2, 3], // 30 (>)
  [2, 1, 2, 3, 2, 1], // 31 (?)
  [2, 3, 2, 1, 2, 1], // 32 (@)
  [1, 1, 1, 3, 2, 3], // 33 (A)
  [1, 3, 1, 1, 2, 3], // 34 (B)
  [1, 3, 1, 3, 2, 1], // 35 (C)
  [1, 1, 2, 3, 1, 3], // 36 (D)
  [1, 3, 2, 1, 1, 3], // 37 (E)
  [1, 3, 2, 3, 1, 1], // 38 (F)
  [2, 1, 1, 3, 1, 3], // 39 (G)
  [2, 3, 1, 1, 1, 3], // 40 (H)
  [2, 3, 1, 3, 1, 1], // 41 (I)
  [1, 1, 2, 1, 3, 3], // 42 (J)
  [1, 1, 2, 3, 3, 1], // 43 (K)
  [1, 3, 2, 1, 3, 1], // 44 (L)
  [1, 1, 3, 1, 2, 3], // 45 (M)
  [1, 1, 3, 3, 2, 1], // 46 (N)
  [1, 3, 3, 1, 2, 1], // 47 (O)
  [3, 1, 3, 1, 2, 1], // 48 (P)
  [2, 1, 1, 3, 3, 1], // 49 (Q)
  [2, 3, 1, 1, 3, 1], // 50 (R)
  [2, 1, 3, 1, 1, 3], // 51 (S)
  [2, 1, 3, 3, 1, 1], // 52 (T)
  [2, 1, 3, 1, 3, 1], // 53 (U)
  [3, 1, 1, 1, 2, 3], // 54 (V)
  [3, 1, 1, 3, 2, 1], // 55 (W)
  [3, 3, 1, 1, 2, 1], // 56 (X)
  [3, 1, 2, 1, 1, 3], // 57 (Y)
  [3, 1, 2, 3, 1, 1], // 58 (Z)
  [3, 3, 2, 1, 1, 1], // 59 ([)
  [3, 1, 4, 1, 1, 1], // 60 (\)
  [2, 2, 1, 4, 1, 1], // 61 (])
  [4, 3, 1, 1, 1, 1], // 62 (^)
  [1, 1, 1, 2, 2, 4], // 63 (_)
  [1, 1, 1, 4, 2, 2], // 64 (`)
  [1, 2, 1, 1, 2, 4], // 65 (a)
  [1, 2, 1, 4, 2, 1], // 66 (b)
  [1, 4, 1, 1, 2, 2], // 67 (c)
  [1, 4, 1, 2, 2, 1], // 68 (d)
  [1, 1, 2, 2, 1, 4], // 69 (e)
  [1, 1, 2, 4, 1, 2], // 70 (f)
  [1, 2, 2, 1, 1, 4], // 71 (g)
  [1, 2, 2, 4, 1, 1], // 72 (h)
  [1, 4, 2, 1, 1, 2], // 73 (i)
  [1, 4, 2, 2, 1, 1], // 74 (j)
  [2, 4, 1, 2, 1, 1], // 75 (k)
  [2, 2, 1, 1, 1, 4], // 76 (l)
  [4, 1, 3, 1, 1, 1], // 77 (m)
  [2, 4, 1, 1, 1, 2], // 78 (n)
  [1, 3, 4, 1, 1, 1], // 79 (o)
  [1, 1, 1, 2, 4, 2], // 80 (p)
  [1, 2, 1, 1, 4, 2], // 81 (q)
  [1, 2, 1, 2, 4, 1], // 82 (r)
  [1, 1, 4, 2, 1, 2], // 83 (s)
  [1, 2, 4, 1, 1, 2], // 84 (t)
  [1, 2, 4, 2, 1, 1], // 85 (u)
  [4, 1, 1, 2, 1, 2], // 86 (v)
  [4, 2, 1, 1, 1, 2], // 87 (w)
  [4, 2, 1, 2, 1, 1], // 88 (x)
  [2, 1, 2, 1, 4, 1], // 89 (y)
  [2, 1, 4, 1, 2, 1], // 90 (z)
  [4, 1, 2, 1, 2, 1], // 91 ({)
  [1, 1, 1, 1, 4, 3], // 92 (|)
  [1, 1, 1, 3, 4, 1], // 93 (})
  [1, 3, 1, 1, 4, 1], // 94 (~)
  [1, 1, 4, 1, 1, 3], // 95 (DEL)
  [1, 1, 4, 3, 1, 1], // 96 (FNC3)
  [4, 1, 1, 1, 1, 3], // 97 (FNC2)
  [4, 1, 1, 3, 1, 1], // 98 (SHIFT)
  [1, 1, 3, 1, 4, 1], // 99 (CODE C)
  [1, 1, 4, 1, 3, 1], // 100 (CODE B)
  [3, 1, 1, 1, 4, 1], // 101 (FNC4)
  [4, 1, 1, 1, 3, 1], // 102 (FNC1)
  [2, 1, 1, 4, 1, 2], // 103 (START A)
  [2, 1, 1, 2, 1, 4], // 104 (START B)
  [2, 1, 1, 2, 3, 2], // 105 (START C)
  [2, 3, 3, 1, 1, 1, 2], // 106 (STOP)
];

export interface BarcodeBar {
  x: number;
  width: number;
}

/**
 * Encodes text into Code 128-B bar patterns.
 * Returns an array of black bar positions and widths (in modules), and total width in modules.
 */
export function encodeCode128B(text: string): {
  bars: BarcodeBar[];
  totalModules: number;
} {
  const cleanText = text.trim();
  const startCode = 104; // Start B
  const symbolValues: number[] = [startCode];

  let checksum = startCode;

  for (let i = 0; i < cleanText.length; i++) {
    const code = cleanText.charCodeAt(i) - 32;
    const val = Math.max(0, Math.min(code, 95));
    symbolValues.push(val);
    checksum += val * (i + 1);
  }

  const checksumSymbol = checksum % 103;
  symbolValues.push(checksumSymbol);
  symbolValues.push(106); // Stop symbol

  const bars: BarcodeBar[] = [];
  let currentModule = 0;

  // Add 10 modules quiet zone at start
  const quietZone = 10;
  currentModule += quietZone;

  for (const sym of symbolValues) {
    const pattern = CODE128_PATTERNS[sym];
    if (!pattern) continue;

    for (let pIdx = 0; pIdx < pattern.length; pIdx++) {
      const width = pattern[pIdx];
      // Even indexes are bars (black), odd indexes are spaces (white)
      if (pIdx % 2 === 0) {
        bars.push({
          x: currentModule,
          width,
        });
      }
      currentModule += width;
    }
  }

  currentModule += quietZone; // Quiet zone at end

  return {
    bars,
    totalModules: currentModule,
  };
}

/**
 * Generates an SVG string representation of the 1D Code 128 barcode
 */
export function generateCode128Svg(
  text: string,
  height: number = 44,
  scale: number = 1.6
): {
  svgBars: string;
  totalWidth: number;
} {
  const { bars, totalModules } = encodeCode128B(text);
  const totalWidth = totalModules * scale;

  const svgBars = bars
    .map(
      (b) =>
        `<rect x="${(b.x * scale).toFixed(1)}" y="0" width="${(b.width * scale).toFixed(1)}" height="${height}" fill="#000000" />`
    )
    .join("\n");

  return {
    svgBars,
    totalWidth,
  };
}
