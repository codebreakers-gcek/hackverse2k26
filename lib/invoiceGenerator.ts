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
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text("Invoice", pageMargin, 50);

      doc.fontSize(9).font("Helvetica").fillColor("#555555");
      let currentY = 85;

      doc.font("Helvetica-Bold").text("Invoice number", pageMargin, currentY);
      doc.font("Helvetica").text(data.invoiceNumber, pageMargin + 90, currentY);

      currentY += 15;
      doc.font("Helvetica-Bold").text("Date of issue", pageMargin, currentY);
      doc.font("Helvetica").text(data.dateOfIssue, pageMargin + 90, currentY);

      currentY += 15;
      doc.font("Helvetica-Bold").text("Date paid", pageMargin, currentY);
      doc
        .font("Helvetica")
        .text(data.datePaid || data.dateOfIssue, pageMargin + 90, currentY);

      // 3. Two-Column Details (Organization vs Bill to)
      currentY = 150;
      const col2X = pageMargin + 230;

      // Left Column: Organization
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text("CodeBreakers GCEK", pageMargin, currentY);
      doc.fontSize(9).font("Helvetica").fillColor("#333333");
      doc.text(
        "Government College of Engineering Kalahandi",
        pageMargin,
        currentY + 16,
      );
      doc.text("Bandhopala, Bhawanipatna", pageMargin, currentY + 30);
      doc.text("Kalahandi, Odisha 766002", pageMargin, currentY + 44);
      doc.text("India", pageMargin, currentY + 58);
      doc
        .fillColor("#2563eb")
        .text("cse.codebreaker@gcekbpatna.ac.in", pageMargin, currentY + 72);

      // Right Column: Bill to
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text("Bill to", col2X, currentY);
      doc.fontSize(9).font("Helvetica").fillColor("#333333");
      doc.text(`${data.leaderName} (${data.teamName})`, col2X, currentY + 16);
      doc.text(
        data.collegeName || "Government College of Engineering Kalahandi",
        col2X,
        currentY + 30,
      );

      const addressLine = [
        data.collegeAddress?.fullAddress,
        data.collegeAddress?.city,
        data.collegeAddress?.state,
        data.collegeAddress?.pincode,
      ]
        .filter(Boolean)
        .join(", ");

      if (addressLine) {
        doc.text(addressLine, col2X, currentY + 44, { width: 220 });
      } else {
        doc.text("Kalahandi, Odisha, India", col2X, currentY + 44);
      }

      doc.text("India", col2X, currentY + 58);
      doc.fillColor("#2563eb").text(data.leaderEmail, col2X, currentY + 72);

      // 4. Large Amount Display
      currentY = 250;
      const formattedAmount =
        data.amount > 0
          ? `₹${data.amount.toFixed(2)} INR`
          : "₹0.00 INR (Free Tier)";
      doc
        .fontSize(18)
        .font("Helvetica-Bold")
        .fillColor("#000000")
        .text(
          `${formattedAmount} paid on ${data.datePaid || data.dateOfIssue}`,
          pageMargin,
          currentY,
        );

      // Status pill / text
      currentY += 24;
      doc
        .fontSize(9)
        .font("Helvetica-Bold")
        .fillColor("#059669")
        .text("VERIFIED", pageMargin, currentY);

      if (data.transactionId) {
        doc
          .font("Helvetica")
          .fillColor("#666666")
          .text(
            `Transaction UTR / Ref: ${data.transactionId}`,
            pageMargin + 160,
            currentY,
          );
      }

      // 5. Itemized Table
      currentY = 310;
      const tableTop = currentY;

      // Table Header
      doc.fontSize(9).font("Helvetica-Bold").fillColor("#444444");
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
      doc.fontSize(9).font("Helvetica-Bold").fillColor("#000000");
      doc.text("HACKVERSE '26 Team Registration", pageMargin, currentY);
      doc.fontSize(8).font("Helvetica").fillColor("#666666");
      doc.text(
        `36h continuous state hackathon pass (${data.teamName})`,
        pageMargin,
        currentY + 12,
      );

      const unitPriceStr =
        data.amount > 0 ? `₹${data.amount.toFixed(2)}` : "₹0.00";
      doc.fontSize(9).font("Helvetica").fillColor("#000000");
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
      doc.fontSize(9).font("Helvetica").fillColor("#444444");
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
      doc.text("₹0.00", pageMargin + 380, currentY, {
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
      doc.fontSize(9).font("Helvetica-Bold").fillColor("#000000");
      doc.text("Total", pageMargin + 260, currentY);
      doc.text(unitPriceStr, pageMargin + 380, currentY, {
        width: contentWidth - 380,
        align: "right",
      });

      currentY += 16;
      doc.fontSize(10).font("Helvetica-Bold").fillColor("#000000");
      doc.text("Amount due", pageMargin + 260, currentY);
      doc.text("₹0.00 INR", pageMargin + 380, currentY, {
        width: contentWidth - 380,
        align: "right",
      });

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
        .font("Helvetica")
        .fillColor("#666666")
        .text(
          "To learn more about HACKVERSE '26 or to discuss your registration, please visit https://hackverse.cbgcek.dev or email hackverse26@codebreakersgcek.tech",
          pageMargin,
          footerY,
          { width: contentWidth },
        );

      doc
        .fontSize(7.5)
        .font("Helvetica")
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
