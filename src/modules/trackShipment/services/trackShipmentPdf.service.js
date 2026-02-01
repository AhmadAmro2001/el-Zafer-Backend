

import { chromium } from "playwright";
import { trackingFullContainerReportTemplate } from "../../../pdf/trackingReport.template.js";
import { mssqlSequelize } from "../../../DB/connection.js"; // adjust import

export const trackingFullContainerPdfService = async (req, res) => {
  const { BillNumber, ContainerNumber, PortOfLoading, PortOfDischarge } = req.query;

  // same query you already do (but please use replacements for safety)
  const sql = `
    SELECT ArrivalDate, DepartureDate
    FROM vw_trackingFullContainer
    WHERE REPLACE(REPLACE(REPLACE(REPLACE(BillNumber, '-', ''), ' ', ''), '/', ''), '.', '') =
          REPLACE(REPLACE(REPLACE(REPLACE(:BillNumber, '-', ''), ' ', ''), '/', ''), '.', '')
      AND ContainerNumber = :ContainerNumber
      AND PortOfLoading = :PortOfLoading
      AND PortOfDischarge = :PortOfDischarge
  `;

  const data = await mssqlSequelize.query(sql, {
    replacements: { BillNumber, ContainerNumber, PortOfLoading, PortOfDischarge },
  });

  if (!data[0] || data[0].length === 0) {
    return res.status(404).json({ message: "Data not found" });
  }

  const pol = PortOfLoading.toLowerCase();
  const exportImport = (pol === "jeddah" || pol === "dammam" || pol === "riyadh") ? "export" : "import";

  const logoUrl = process.env.COMPANY_LOGO_URL; // set it in Render env

  const html = trackingFullContainerReportTemplate({
    BillNumber,
    ContainerNumber,
    PortOfLoading,
    PortOfDischarge,
    exportImport,
    result: data[0],
    logoUrl,
  });

  const browser = await chromium.launch({ args: ["--no-sandbox", "--disable-setuid-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle" });

  const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

  await browser.close();

  const fileName = `StatusReport_${BillNumber}_${ContainerNumber}.pdf`.replaceAll("/", "-");

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  return res.status(200).send(pdfBuffer);
};
