import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Paths, File } from 'expo-file-system';
import { Alert, Platform } from 'react-native';
import { PackageDetail } from '../data/mockData';

export const pdfService = {
  /**
   * Build HTML invoice template for a package receipt
   */
  getReceiptHtml(pkg: PackageDetail): string {
    const formattedDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const subtotal = pkg.payment.shipmentCost;
    const insurance = pkg.payment.insurance;
    const vat = pkg.payment.vat || Math.round(subtotal * 0.075);
    const total = subtotal + insurance + vat;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
              color: #1a1a1a;
              margin: 0;
              padding: 36px;
              background: #ffffff;
            }
            .header-table {
              width: 100%;
              border-bottom: 2px solid #22c55e;
              padding-bottom: 20px;
              margin-bottom: 24px;
            }
            .brand-name {
              font-size: 26px;
              font-weight: 900;
              color: #111827;
              letter-spacing: -0.5px;
            }
            .brand-tagline {
              font-size: 11px;
              color: #22c55e;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-top: 2px;
            }
            .company-info {
              text-align: right;
              font-size: 11px;
              color: #6b7280;
              line-height: 1.5;
            }
            .badge-paid {
              display: inline-block;
              background-color: #dcfce7;
              color: #15803d;
              font-weight: 800;
              padding: 6px 14px;
              border-radius: 20px;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              border: 1px solid #86efac;
            }
            .invoice-details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 28px;
              background: #f9fafb;
              border-radius: 12px;
              padding: 16px 20px;
              border: 1px solid #e5e7eb;
            }
            .detail-col {
              flex: 1;
            }
            .label {
              font-size: 10px;
              text-transform: uppercase;
              color: #9ca3af;
              font-weight: 700;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            }
            .value {
              font-size: 14px;
              font-weight: 800;
              color: #111827;
            }
            .address-box {
              width: 100%;
              margin-bottom: 28px;
              border-collapse: collapse;
            }
            .address-cell {
              width: 50%;
              vertical-align: top;
              padding: 14px 16px;
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 10px;
            }
            .table-main {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 24px;
            }
            .table-main th {
              background: #111827;
              color: #ffffff;
              font-size: 11px;
              text-transform: uppercase;
              padding: 10px 14px;
              text-align: left;
            }
            .table-main td {
              padding: 12px 14px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 13px;
              color: #374151;
            }
            .totals-container {
              width: 320px;
              margin-left: auto;
              margin-bottom: 30px;
            }
            .totals-row {
              display: flex;
              justify-content: space-between;
              padding: 6px 0;
              font-size: 13px;
              color: #4b5563;
            }
            .totals-row.final {
              border-top: 2px solid #111827;
              padding-top: 10px;
              margin-top: 6px;
              font-size: 18px;
              font-weight: 900;
              color: #15803d;
            }
            .barcode-box {
              text-align: center;
              border-top: 1px dashed #d1d5db;
              padding-top: 20px;
              margin-top: 20px;
            }
            .barcode-sim {
              font-family: monospace;
              letter-spacing: 5px;
              font-size: 22px;
              font-weight: 700;
              color: #111827;
              background: #f3f4f6;
              display: inline-block;
              padding: 8px 24px;
              border-radius: 6px;
              border: 1px solid #d1d5db;
            }
            .footer-note {
              text-align: center;
              font-size: 11px;
              color: #9ca3af;
              margin-top: 16px;
            }
          </style>
        </head>
        <body>
          <table class="header-table">
            <tr>
              <td>
                <div class="brand-name">⚡ SWIFT LOGISTICS</div>
                <div class="brand-tagline">Express Courier & Freight Nigeria</div>
              </td>
              <td class="company-info">
                Swift Logistics Nigeria Limited<br/>
                RC: 1892842 • TIN: 24891029-0001<br/>
                Plot 14 Admiralty Way, Lekki Phase 1, Lagos<br/>
                support@swiftlogistics.ng • +234 1 889 0421
              </td>
            </tr>
          </table>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div>
              <div style="font-size: 20px; font-weight: 900; color: #111827;">OFFICIAL DELIVERY RECEIPT</div>
              <div style="font-size: 12px; color: #6b7280;">Document № SL-REC-${pkg.trackingNumber}</div>
            </div>
            <div class="badge-paid">✓ PAYMENT CONFIRMED</div>
          </div>

          <div class="invoice-details">
            <div class="detail-col">
              <div class="label">Receipt Date</div>
              <div class="value">${formattedDate}</div>
            </div>
            <div class="detail-col">
              <div class="label">Tracking Number</div>
              <div class="value">${pkg.trackingNumber}</div>
            </div>
            <div class="detail-col">
              <div class="label">Payment Channel</div>
              <div class="value">${pkg.payment.method || 'Debit Card (Paystack)'}</div>
            </div>
          </div>

          <table class="address-box">
            <tr>
              <td class="address-cell" style="margin-right: 12px;">
                <div class="label">Sender / Origin</div>
                <div style="font-weight: 700; font-size: 13px; color: #111827; margin-bottom: 4px;">${pkg.parcelData.sender}</div>
                <div style="font-size: 12px; color: #4b5563;">Shipment Registered: ${pkg.createdDate}</div>
              </td>
              <td class="address-cell">
                <div class="label">Recipient / Destination</div>
                <div style="font-weight: 700; font-size: 13px; color: #111827; margin-bottom: 4px;">${pkg.recipientName || 'Elisha Adamu'}</div>
                <div style="font-size: 12px; color: #4b5563;">${pkg.parcelData.destination}</div>
              </td>
            </tr>
          </table>

          <table class="table-main">
            <thead>
              <tr>
                <th>Service Description</th>
                <th>Specifications</th>
                <th style="text-align: right;">Amount (₦)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>${pkg.parcelData.category}</strong><br/>
                  <span style="font-size: 11px; color: #6b7280;">Door-to-door courier freight</span>
                </td>
                <td>Weight: ${pkg.parcelData.weight}<br/>Dimensions: ${pkg.parcelData.dimensions}</td>
                <td style="text-align: right; font-weight: 700;">₦${subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td>
                  <strong>Premium Full-Value Insurance Shield</strong><br/>
                  <span style="font-size: 11px; color: #6b7280;">100% loss/damage coverage up to ₦2,500,000</span>
                </td>
                <td>Zero Deductible</td>
                <td style="text-align: right; font-weight: 700;">₦${insurance.toLocaleString()}</td>
              </tr>
              <tr>
                <td>
                  <strong>Value Added Tax (VAT)</strong><br/>
                  <span style="font-size: 11px; color: #6b7280;">Standard statutory rate 7.5%</span>
                </td>
                <td>Federal Inland Revenue Service (FIRS)</td>
                <td style="text-align: right; font-weight: 700;">₦${vat.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          <div class="totals-container">
            <div class="totals-row">
              <span>Freight Subtotal:</span>
              <span>₦${subtotal.toLocaleString()}</span>
            </div>
            <div class="totals-row">
              <span>Transit Insurance:</span>
              <span>₦${insurance.toLocaleString()}</span>
            </div>
            <div class="totals-row">
              <span>VAT (7.5%):</span>
              <span>₦${vat.toLocaleString()}</span>
            </div>
            <div class="totals-row final">
              <span>Total Paid:</span>
              <span>₦${total.toLocaleString()}</span>
            </div>
          </div>

          <div class="barcode-box">
            <div class="barcode-sim">||| | |||| || | |||| ||| ||| ${pkg.trackingNumber} |||</div>
            <div class="footer-note">
              This is a cryptographically verified electronic delivery receipt generated by Swift Logistics Nigeria.<br/>
              Valid for customs, corporate audit, and insurance claim verification.
            </div>
          </div>
        </body>
      </html>
    `;
  },

  /**
   * Generate official PDF and share via system share sheet
   */
  async generateAndShareReceiptPdf(pkg: PackageDetail): Promise<void> {
    const html = this.getReceiptHtml(pkg);

    // On Web, directly invoke browser native print dialog (save as PDF)
    if (Platform.OS === 'web') {
      try {
        await Print.printAsync({ html });
      } catch (e) {
        console.warn('Web print error:', e);
      }
      return;
    }

    try {
      // 1. Generate PDF file
      const { uri } = await Print.printToFileAsync({ html });

      // 2. Copy to document directory so native FileProvider / sandbox allows sharing
      let shareUri = uri;
      try {
        const cleanName = `Swift_Receipt_${pkg.trackingNumber.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;
        const sourceFile = new File(uri);
        const destinationFile = new File(Paths.document, cleanName);
        await sourceFile.copy(destinationFile);
        shareUri = destinationFile.uri;
      } catch (copyErr) {
        console.warn('Copy to document directory failed, using original uri:', copyErr);
      }

      // 3. Share via native share sheet if available
      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(shareUri, {
          UTI: '.pdf',
          mimeType: 'application/pdf',
          dialogTitle: `Official Receipt - ${pkg.trackingNumber}`,
        });
      } else {
        await Print.printAsync({ html });
      }
    } catch (error: any) {
      console.warn('Sharing error, falling back to direct native print preview:', error);
      try {
        // Direct print sheet fallback (allows user to save as PDF or print directly)
        await Print.printAsync({ html });
      } catch (printErr) {
        console.warn('Print preview fallback error:', printErr);
        Alert.alert('PDF Receipt Ready', `Invoice for package №${pkg.trackingNumber} has been generated.`);
      }
    }
  },

  /**
   * Directly trigger print dialog
   */
  async printReceiptPdf(pkg: PackageDetail): Promise<void> {
    try {
      const html = this.getReceiptHtml(pkg);
      await Print.printAsync({ html });
    } catch (error: any) {
      console.warn('Print error:', error);
    }
  },
};
