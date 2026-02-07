

import { chromium } from "playwright";
import { trackingAirFlightReportTemplate, trackingClearanceBillNoReportTemplate, trackingClearanceContainerNoReportTemplate, trackingFullContainerReportTemplate, trackingLclBillNumberReportTemplate, trackingLclContainerReportTemplate, trackingPersonalEffectReportTemplate } from "../../../pdf/index.js";
import { mssqlSequelize } from "../../../DB/connection.js"; // adjust import

// tracking full container
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

// lcl by container
export const trackingLclByContainerPdf = async (req, res) => {
  const { ContainerNumber, PortOfDischarge } = req.query;

    if (!ContainerNumber || !PortOfDischarge) {
      return res.status(400).json({ message: "Missing query params" });
    }

    // ✅ Use replacements to avoid SQL injection
    const sql = `
      SELECT HousBillNo, NOOfPcs, DORelease, Stored, Arrived, CargoRelease
      FROM vw_trackingLCLByContainer
      WHERE ContainerNumber = :ContainerNumber
        AND PortOfDischarge = :PortOfDischarge
    `;

    const data = await mssqlSequelize.query(sql, {
      replacements: { ContainerNumber, PortOfDischarge },
    });

    if (!data[0] || data[0].length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    const html = trackingLclContainerReportTemplate({
      ContainerNumber,
      PortOfDischarge,
      result: data[0],
    });

    const browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", right: "12mm", bottom: "14mm", left: "12mm" },
    });

    await browser.close();

    const fileName = `LCL_${ContainerNumber}_${PortOfDischarge}.pdf`
      .replaceAll("/", "-")
      .replaceAll(" ", "_");

    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    return res.end(pdfBuffer);
}

// lcl by hbl


export const trackingLclByHouseBillNoPdfService = async (req, res) => {

    const { HousBillNo, NOOfPcs, TotalWeight, Destination } = req.query;

    if (!HousBillNo || !NOOfPcs || !TotalWeight || !Destination) {
      return res.status(400).json({ message: "Missing query params" });
    }

    // ✅ SAFE query (no SQL injection)
    const sql = `
      SELECT Arrived, DORelease, Stored, Clearance
      FROM vw_TrackingLCLByHouseBlNO
      WHERE REPLACE(REPLACE(REPLACE(REPLACE(HousBillNo, '-', ''), ' ', ''), '/', ''), '.', '') =
            REPLACE(REPLACE(REPLACE(REPLACE(:HousBillNo, '-', ''), ' ', ''), '/', ''), '.', '')
        AND NOOfPcs = :NOOfPcs
        AND TotalWeight = :TotalWeight
        AND Destination = :Destination
    `;

    const data = await mssqlSequelize.query(sql, {
      replacements: {
        HousBillNo,
        NOOfPcs,
        TotalWeight: Number(TotalWeight),
        Destination,
      },
    });

    if (!data[0] || data[0].length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    const html = trackingLclBillNumberReportTemplate({
      HousBillNo,
      NOOfPcs,
      TotalWeight,
      Destination,
      result: data[0],
    });

    const browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", right: "12mm", bottom: "14mm", left: "12mm" },
    });

    await browser.close();

    const fileName = `LCL_${HousBillNo}_${Destination}.pdf`
      .replaceAll("/", "-")
      .replaceAll(" ", "_");

    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    return res.end(pdfBuffer);
  
};

// personal effect


export const trackingPersonalEffectPdfService = async (req, res) => {

    const { HousBillNo, NOOfPcs, TotalWeight, Destination } = req.query;

    if (!HousBillNo || !NOOfPcs || !TotalWeight || !Destination) {
      return res.status(400).json({ message: "Missing query params" });
    }

    const sql = `
      SELECT Arrived, DepartureDate
      FROM vw_trackingPersonalEffect
      WHERE REPLACE(REPLACE(REPLACE(REPLACE(HousBillNo, '-', ''), ' ', ''), '/', ''), '.', '') =
            REPLACE(REPLACE(REPLACE(REPLACE(:HousBillNo, '-', ''), ' ', ''), '/', ''), '.', '')
        AND NOOfPcs = :NOOfPcs
        AND TotalWeight = :TotalWeight
        AND Destination = :Destination
    `;

    const data = await mssqlSequelize.query(sql, {
      replacements: {
        HousBillNo,
        NOOfPcs,
        TotalWeight: Number(TotalWeight),
        Destination,
      },
    });

    if (!data[0] || data[0].length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    const html = trackingPersonalEffectReportTemplate({
      HousBillNo,
      NOOfPcs,
      TotalWeight,
      Destination,
      result: data[0],
    });

    const browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", right: "12mm", bottom: "14mm", left: "12mm" },
    });

    await browser.close();

    const fileName = `PersonalEffect_${HousBillNo}_${Destination}.pdf`
      .replaceAll("/", "-")
      .replaceAll(" ", "_");

    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    return res.end(pdfBuffer);
  
};

// clearance by bill 


export const trackingClearanceByBillNoPdfService = async (req, res) => {
    const { BillNo, PortOfDischarge } = req.query;

    if (!BillNo || !PortOfDischarge) {
      return res.status(400).json({ message: "Missing query params" });
    }

    const sql = `
      SELECT ContainerUnderClearance, AtThePort, UnderTracking, ClearanceDone, VesselEnName
      FROM vw_TrackingClearanceAndTrackingbyBLNo
      WHERE REPLACE(REPLACE(REPLACE(REPLACE(BillNo, '-', ''), ' ', ''), '/', ''), '.', '') =
            REPLACE(REPLACE(REPLACE(REPLACE(:BillNo, '-', ''), ' ', ''), '/', ''), '.', '')
        AND PortOfDischarge = :PortOfDischarge
    `;

    const data = await mssqlSequelize.query(sql, {
      replacements: { BillNo, PortOfDischarge },
    });

    if (!data[0] || data[0].length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    const result = data[0][0];

    const html = trackingClearanceBillNoReportTemplate({
      BillNo,
      PortOfDischarge,
      result,
    });

    const browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", right: "12mm", bottom: "14mm", left: "12mm" },
    });

    await browser.close();

    const fileName = `Clearance_${BillNo}_${PortOfDischarge}.pdf`
      .replaceAll("/", "-")
      .replaceAll(" ", "_");

    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    return res.end(pdfBuffer);
  
};


// clearance by container


export const trackingClearanceByContainerNoPdfService = async (req, res) => {

    const { ContainerNumber, PortOfDischarge, VesselEnName } = req.query;

    if (!ContainerNumber || !PortOfDischarge || !VesselEnName) {
      return res.status(400).json({ message: "Missing query params" });
    }

    // ✅ safer replacements
    const sql = `
      SELECT ContainerUnderClearance, AtThePort, UnderTracking, ClearanceDone
      FROM vw_TrackingClearanceAndTrackingbyContainerNo
      WHERE ContainerNumber = :ContainerNumber
        AND PortOfDischarge = :PortOfDischarge
        AND VesselEnName = :VesselEnName
    `;

    const data = await mssqlSequelize.query(sql, {
      replacements: { ContainerNumber, PortOfDischarge, VesselEnName },
    });

    if (!data[0] || data[0].length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    const html = trackingClearanceContainerNoReportTemplate({
      ContainerNumber,
      PortOfDischarge,
      VesselEnName,
      result: data[0],
    });

    const browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", right: "12mm", bottom: "14mm", left: "12mm" },
    });

    await browser.close();

    const fileName = `Clearance_${ContainerNumber}_${PortOfDischarge}.pdf`
      .replaceAll("/", "-")
      .replaceAll(" ", "_");

    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    return res.end(pdfBuffer);
  
};




export const trackingAirFlightPdfService = async (req, res) => {
  
    const { AWBNo, Destination, NOOfPcs, TotalWeight } = req.query;

    if (!AWBNo || !Destination || !NOOfPcs || !TotalWeight) {
      return res.status(400).json({ message: "Missing query params" });
    }

    const sql = `
      SELECT ArrivalDate, Cleared, DepartureDate, BLReleaseDate, destination
      FROM vw_TrackingAirFreightShipment
      WHERE REPLACE(REPLACE(REPLACE(REPLACE(AWBNo, '-', ''), ' ', ''), '/', ''), '.', '') =
            REPLACE(REPLACE(REPLACE(REPLACE(:AWBNo, '-', ''), ' ', ''), '/', ''), '.', '')
        AND Destination = :Destination
        AND NOOfPcs = :NOOfPcs
        AND TotalWeight = :TotalWeight
    `;

    const data = await mssqlSequelize.query(sql, {
      replacements: {
        AWBNo,
        Destination,
        NOOfPcs,
        TotalWeight: Number(TotalWeight),
      },
    });

    if (!data[0] || data[0].length === 0) {
      return res.status(404).json({ message: "Data not found" });
    }

    // Same export/import logic you use in JSON API
    const dest = Destination.toLowerCase();
    const exportImport =
      (dest === "jeddah" || dest === "dammam" || dest === "riyadh") ? "import" : "export";

    const html = trackingAirFlightReportTemplate({
      AWBNo,
      Destination,
      NOOfPcs,
      TotalWeight,
      exportImport,
      result: data[0],
    });

    const browser = await chromium.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "14mm", right: "12mm", bottom: "14mm", left: "12mm" },
    });

    await browser.close();

    const fileName = `AIR_${AWBNo}_${Destination}.pdf`
      .replaceAll("/", "-")
      .replaceAll(" ", "_");

    res.status(200);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Length", pdfBuffer.length);
    return res.end(pdfBuffer);
  
};




