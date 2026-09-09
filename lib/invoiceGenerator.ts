import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export interface InvoiceData {
  invoiceNumber: string;
  dateOfIssue: string;
  datePaid?: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  collegeName: string;
  collegeAddress?: {
    fullAddress?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  amount: number;
  paymentMode?: string;
  transactionId?: string;
  paymentStatus: string;
}

/**
 * Generates an ultra-clean, professional PDF Invoice Buffer
 * matching the modern invoice aesthetic.
 */
export async function generateInvoicePdfBuffer(
  data: InvoiceData,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        info: {
          Title: `Invoice ${data.invoiceNumber}`,
          Author: "CodeBreakers GCEK - HACKVERSE '26",
          Subject: "Official Registration & Hackathon Pass Invoice",
        },
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk: Buffer) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err: Error) => reject(err));

      // Register Unicode Fonts for perfect Rupee (₹) and text rendering
      const fontRegularPath = path.join(process.cwd(), "public", "font", "Arial-Regular.ttf");
      const fontBoldPath = path.join(process.cwd(), "public", "font", "Arial-Bold.ttf");
      
      const hasCustomFonts = fs.existsSync(fontRegularPath) && fs.existsSync(fontBoldPath);
      if (hasCustomFonts) {
        doc.registerFont("AppRegular", fontRegularPath);
        doc.registerFont("AppBold", fontBoldPath);
      }

      const fontReg = hasCustomFonts ? "AppRegular" : "Helvetica";
      const fontBold = hasCustomFonts ? "AppBold" : "Helvetica-Bold";

      const pageWidth = 595.28; // A4 width in points
      const pageMargin = 50;
      const contentWidth = pageWidth - pageMargin * 2;

      // 1. Logo at Top Right
      const logoPath = path.join(process.cwd(), "public", "cblogo.png");
      if (fs.existsSync(logoPath)) {
        try {
          doc.image(logoPath, pageWidth - pageMargin - 65, 45, { width: 55 });
        } catch {
          // fallback if image cannot be embedded
        }
      }

      // 2. Title & Metadata (Top Left)
      doc
        .fontSize(24)
        .font(fontBold)
        .fillColor("#000000")
        .text("Invoice", pageMargin, 50);

      doc.fontSize(9).font(fontReg).fillColor("#555555");
      let currentY = 88;
      doc.font(fontBold).text("Invoice number", pageMargin, currentY);
      doc.font(fontReg).text(data.invoiceNumber, pageMargin + 90, currentY);

      currentY += 15;
      doc.font(fontBold).text("Date of issue", pageMargin, currentY);
      doc.font(fontReg).text(data.dateOfIssue, pageMargin + 90, currentY);

      currentY += 15;
      doc.font(fontBold).text("Date paid", pageMargin, currentY);
      doc
        .font(fontReg)
        .text(data.datePaid || data.dateOfIssue, pageMargin + 90, currentY);

      // 3. Two-Column Details (Organization vs Bill to) with clean dynamic spacing
      currentY = 150;
      const col1X = pageMargin;
      const col2X = pageMargin + 230;
      const colWidth = 225;

      // Helper to render text block with dynamic height calculation
      const renderBlockLine = (
        text: string,
        x: number,
        y: number,
        width: number,
        options?: { isBold?: boolean; color?: string; lineGap?: number; bottomGap?: number }
      ): number => {
        const lineGap = options?.lineGap ?? 2;
        const bottomGap = options?.bottomGap ?? 3;
        
        doc
          .font(options?.isBold ? fontBold : fontReg)
          .fontSize(9)
          .fillColor(options?.color || "#333333");

        const height = doc.heightOfString(text, { width, lineGap });
        doc.text(text, x, y, { width, lineGap });
        return y + height + bottomGap;
      };

      // Left Column: Organization
      let leftY = currentY;
      doc
        .fontSize(10)
        .font(fontBold)
        .fillColor("#000000")
        .text("CodeBreakers GCEK", col1X, leftY);
      leftY += 16;

      leftY = renderBlockLine("Government College of Engineering Kalahandi", col1X, leftY, colWidth);
      leftY = renderBlockLine("Bandhopala, Bhawanipatna", col1X, leftY, colWidth);
      leftY = renderBlockLine("Kalahandi, Odisha - 766002", col1X, leftY, colWidth);
      leftY = renderBlockLine("India", col1X, leftY, colWidth);
      leftY = renderBlockLine("cse.codebreaker@gcekbpatna.ac.in", col1X, leftY, colWidth, { color: "#2563eb", bottomGap: 6 });

      // Right Column: Bill to
      let rightY = currentY;
      doc
        .fontSize(10)
        .font(fontBold)
        .fillColor("#000000")
        .text("Bill to", col2X, rightY);
      rightY += 16;

      rightY = renderBlockLine(`${data.leaderName} (${data.teamName})`, col2X, rightY, colWidth);

      if (data.collegeName) {
        rightY = renderBlockLine(data.collegeName, col2X, rightY, colWidth);
      }

      if (data.collegeAddress?.fullAddress) {
        rightY = renderBlockLine(data.collegeAddress.fullAddress, col2X, rightY, colWidth);
      }

      const cityState = [data.collegeAddress?.city, data.collegeAddress?.state]
        .filter(Boolean)
        .join(", ");
      
      const pinStr = data.collegeAddress?.pincode ? `PIN: ${data.collegeAddress.pincode}` : "";
      const cityStatePin = [cityState, pinStr].filter(Boolean).join(" - ");

      if (cityStatePin) {
        rightY = renderBlockLine(cityStatePin, col2X, rightY, colWidth);
      }

      rightY = renderBlockLine("India", col2X, rightY, colWidth);

      if (data.leaderEmail) {
        rightY = renderBlockLine(data.leaderEmail, col2X, rightY, colWidth, { color: "#2563eb", bottomGap: 6 });
      }

      // 4. Large Amount Display (Positioned below the taller of the two columns)
      currentY = Math.max(leftY, rightY, 250) + 12;
      const rupeePrefix = hasCustomFonts ? "₹" : "Rs.";
      const formattedAmount =
        data.amount > 0
          ? `${rupeePrefix}${data.amount.toFixed(2)} INR`
          : `${rupeePrefix}0.00 INR (Free Tier)`;

      doc
        .fontSize(17)
        .font(fontBold)
        .fillColor("#000000")
        .text(
          `${formattedAmount} paid on ${data.datePaid || data.dateOfIssue}`,
          pageMargin,
          currentY,
        );

      // Status pill / text
      currentY += 22;
      doc
        .fontSize(9)
        .font(fontBold)
        .fillColor("#059669")
        .text("VERIFIED", pageMargin, currentY);

      if (data.transactionId) {
        doc
          .font(fontReg)
          .fillColor("#666666")
          .text(
            `Transaction UTR / Ref: ${data.transactionId}`,
            pageMargin + 140,
            currentY,
          );
      }

      // 5. Itemized Table
      currentY += 25;
      const tableTop = currentY;

      // Table Header
      doc.fontSize(9).font(fontBold).fillColor("#444444");
      doc.text("Description", pageMargin, tableTop);
      doc.text("Qty", pageMargin + 280, tableTop, {
        width: 40,
        align: "center",
      });
      doc.text("Unit price", pageMargin + 330, tableTop, {
        width: 70,
        align: "right",
      });
      doc.text("Tax", pageMargin + 410, tableTop, {
        width: 40,
        align: "right",
      });
      doc.text("Amount", pageMargin + 460, tableTop, {
        width: contentWidth - 460,
        align: "right",
      });

      // Table Header Line
      doc
        .strokeColor("#cccccc")
        .lineWidth(1)
        .moveTo(pageMargin, tableTop + 14)
        .lineTo(pageMargin + contentWidth, tableTop + 14)
        .stroke();

      // Table Row
      currentY = tableTop + 24;
      doc.fontSize(9).font(fontBold).fillColor("#000000");
      doc.text("HACKVERSE '26 Team Registration", pageMargin, currentY);
      doc.fontSize(8).font(fontReg).fillColor("#666666");
      doc.text(
        `36h continuous state hackathon pass (${data.teamName})`,
        pageMargin,
        currentY + 12,
      );

      const unitPriceStr =
        data.amount > 0
          ? `${rupeePrefix}${data.amount.toFixed(2)}`
          : `${rupeePrefix}0.00`;
      doc.fontSize(9).font(fontReg).fillColor("#000000");
      doc.text("1", pageMargin + 280, currentY, { width: 40, align: "center" });
      doc.text(unitPriceStr, pageMargin + 330, currentY, {
        width: 70,
        align: "right",
      });
      doc.text("0%", pageMargin + 410, currentY, { width: 40, align: "right" });
      doc.text(unitPriceStr, pageMargin + 460, currentY, {
        width: contentWidth - 460,
        align: "right",
      });

      // 6. Summary Breakdown (Right Aligned)
      currentY += 45;
      doc
        .strokeColor("#e5e7eb")
        .lineWidth(1)
        .moveTo(pageMargin + 260, currentY)
        .lineTo(pageMargin + contentWidth, currentY)
        .stroke();

      currentY += 10;
      doc.fontSize(9).font(fontReg).fillColor("#444444");
      doc.text("Subtotal", pageMargin + 260, currentY);
      doc.text(unitPriceStr, pageMargin + 380, currentY, {
        width: contentWidth - 380,
        align: "right",
      });

      currentY += 16;
      doc.text("Total excluding tax", pageMargin + 260, currentY);
      doc.text(unitPriceStr, pageMargin + 380, currentY, {
        width: contentWidth - 380,
        align: "right",
      });

      currentY += 16;
      doc.text("GST / Tax (0% Exempt)", pageMargin + 260, currentY);
      doc.text(`${rupeePrefix}0.00`, pageMargin + 380, currentY, {
        width: contentWidth - 380,
        align: "right",
      });

      currentY += 16;
      doc
        .strokeColor("#e5e7eb")
        .lineWidth(1)
        .moveTo(pageMargin + 260, currentY)
        .lineTo(pageMargin + contentWidth, currentY)
        .stroke();

      currentY += 10;
      doc.fontSize(9).font(fontBold).fillColor("#000000");
      doc.text("Total", pageMargin + 260, currentY);
      doc.text(unitPriceStr, pageMargin + 380, currentY, {
        width: contentWidth - 380,
        align: "right",
      });

      currentY += 16;
      doc.fontSize(10).font(fontBold).fillColor("#000000");
      doc.text("Amount due", pageMargin + 260, currentY);
      doc.text(
        `${rupeePrefix}0.00 (${data.amount > 0 ? "Paid in Full" : "Free Tier"})`,
        pageMargin + 380,
        currentY,
        {
          width: contentWidth - 380,
          align: "right",
        },
      );

      // 7. Footer Note
      const footerY = 750;
      doc
        .strokeColor("#e5e7eb")
        .lineWidth(1)
        .moveTo(pageMargin, footerY - 20)
        .lineTo(pageMargin + contentWidth, footerY - 20)
        .stroke();

      doc
        .fontSize(8.5)
        .font(fontReg)
        .fillColor("#666666")
        .text(
          "To learn more about HACKVERSE '26 or to discuss your registration, please visit https://hackverse.cbgcek.dev or email hackverse26@codebreakersgcek.tech",
          pageMargin,
          footerY,
          { width: contentWidth },
        );

      doc
        .fontSize(7.5)
        .font(fontReg)
        .fillColor("#999999")
        .text(
          "CodeBreakers Club // Government College of Engineering Kalahandi, Bhawanipatna, Odisha 766002",
          pageMargin,
          footerY + 30,
          { width: contentWidth },
        );

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
