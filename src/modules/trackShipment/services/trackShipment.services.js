import { mssqlSequelize } from "../../../DB/connection.js";

// update done
// tracking full container 
export const trackingFullContainerService = async (req,res)=>{
  //   const {BillNumber, ContainerNumber,PortOfLoading,PortOfDischarge} = req.query;
  //   const data = await mssqlSequelize.query(`SELECT ArrivalDate,DepartureDate FROM vw_trackingFullContainer WHERE REPLACE(REPLACE(REPLACE(REPLACE(BillNumber, '-', ''), ' ', ''), '/', ''), '.', '') =
  // REPLACE(REPLACE(REPLACE(REPLACE('${BillNumber}', '-', ''), ' ', ''), '/', ''), '.', '') AND ContainerNumber = '${ContainerNumber}' AND PortOfLoading = '${PortOfLoading}' AND PortOfDischarge = '${PortOfDischarge}'`) ;
  //   if(data[0].length === 0){
  //       return res.status(404).json({message:'Data not found'})
  //   }
  //   let exportImport;
  //   if(PortOfLoading.toLowerCase() === 'jeddah' ||PortOfLoading.toLowerCase() === 'dammam'||PortOfLoading.toLowerCase() === 'riyadh' ){
  //       exportImport = 'export';
  //   }else{
  //       exportImport = 'import';
  //   }
  //   const result = data[0];
  //   return res.status(200).json({message:'Data found',result,exportImport})
  const { BillNumber, ContainerNumber, PortOfLoading, PortOfDischarge } = req.query;

  const cleanBill = (v = "") => v.replace(/[- /.]/g, "").toLowerCase();

  if (!BillNumber || !ContainerNumber || !PortOfLoading || !PortOfDischarge) {
    return res.status(400).json({ message: "Missing required query params" });
  }

  // 1) EXACT match (parameterized)
  const exactSql = `
    DECLARE @bill NVARCHAR(50) =
      REPLACE(REPLACE(REPLACE(REPLACE(:BillNumber, '-', ''), ' ', ''), '/', ''), '.', '');

    SELECT ArrivalDate, DepartureDate, BillNumber
    FROM vw_trackingFullContainer
    WHERE REPLACE(REPLACE(REPLACE(REPLACE(BillNumber, '-', ''), ' ', ''), '/', ''), '.', '') = @bill
      AND ContainerNumber = :ContainerNumber
      AND PortOfLoading = :PortOfLoading
      AND PortOfDischarge = :PortOfDischarge;
  `;

  const replacements = { BillNumber, ContainerNumber, PortOfLoading, PortOfDischarge };

  const exact = await mssqlSequelize.query(exactSql, {
    replacements,
    type: mssqlSequelize.QueryTypes.SELECT,
  });

  // export/import logic (keep same)
  let exportImport;
  const pol = PortOfLoading.toLowerCase();
  if (pol === "jeddah" || pol === "dammam" || pol === "riyadh") {
    exportImport = "export";
  } else {
    exportImport = "import";
  }

  if (exact.length > 0) {
    return res.status(200).json({
      message: "Data found",
      result: exact,
      exportImport,
      matchType: "exact",
    });
  }

  // 2) FUZZY fallback for BillNumber (when typo)
  const fuzzySql = `
    DECLARE @bill NVARCHAR(50) =
      REPLACE(REPLACE(REPLACE(REPLACE(:BillNumber, '-', ''), ' ', ''), '/', ''), '.', '');

    ;WITH C AS (
      SELECT
        v.ArrivalDate,
        v.DepartureDate,
        v.BillNumber,
        CleanBillNo = REPLACE(REPLACE(REPLACE(REPLACE(v.BillNumber, '-', ''), ' ', ''), '/', ''), '.', '')
      FROM vw_trackingFullContainer v
      WHERE v.ContainerNumber = :ContainerNumber
        AND v.PortOfLoading = :PortOfLoading
        AND v.PortOfDischarge = :PortOfDischarge
    ),
    Candidates AS (
      SELECT TOP (50) *,
        DIFFERENCE(CleanBillNo, @bill) AS DiffScore
      FROM C
      WHERE CleanBillNo LIKE LEFT(@bill, 3) + '%'
         OR @bill LIKE LEFT(CleanBillNo, 3) + '%'
         OR DIFFERENCE(CleanBillNo, @bill) >= 3
    )
    SELECT TOP (1) ArrivalDate, DepartureDate, BillNumber
    FROM Candidates
    ORDER BY
      DiffScore DESC,
      ABS(LEN(CleanBillNo) - LEN(@bill)) ASC,
      CASE WHEN LEFT(CleanBillNo, 4) = LEFT(@bill, 4) THEN 0 ELSE 1 END;
  `;

  const fuzzy = await mssqlSequelize.query(fuzzySql, {
    replacements,
    type: mssqlSequelize.QueryTypes.SELECT,
  });

  if (fuzzy.length > 0) {
    const dbBill = cleanBill(fuzzy[0].BillNumber);
    const userBill = cleanBill(BillNumber);

    const message =
      dbBill === userBill
        ? "Data found"
        : "Closest match found (bill no might be mistyped)";

    return res.status(200).json({
      message,
      result: fuzzy,
      exportImport,
      matchType: dbBill === userBill ? "exact" : "closest",
    });
  }

  return res.status(404).json({ message: "Data not found" });
}


// no update needed
// tracking lcl by container
export const trackingLCLByContainerService =async( req,res)=>{
    const {BillNumber , ContainerNumber , PortOfDischarge}= req.query;
    const data = await mssqlSequelize.query(`SELECT HousBillNo,NOOfPcs,DORelease,Stored,Arrived,CargoRelease FROM vw_trackingLCLByContainer WHERE ContainerNumber = '${ContainerNumber}' AND PortOfDischarge = '${PortOfDischarge}'`);
    if(data[0].length === 0){
        return res.status(404).json({message:'Data not found'})
    }
    const result = data[0];
    return res.status(200).json({message:'Data found',result})
}

// update done
// tracking lcl by housebillno
export const trackingLCLByHouseBillNoService = async(req,res)=>{
  //   const{HousBillNo , NOOfPcs , TotalWeight , Destination} = req.query;
  //   const data = await mssqlSequelize.query(`SELECT Arrived ,DORelease , Stored,Clearance FROM vw_TrackingLCLByHouseBlNO WHERE REPLACE(REPLACE(REPLACE(REPLACE(HousBillNo, '-', ''), ' ', ''), '/', ''), '.', '') =
  // REPLACE(REPLACE(REPLACE(REPLACE('${HousBillNo}', '-', ''), ' ', ''), '/', ''), '.', '') AND NOOfPcs = '${NOOfPcs}' AND TotalWeight = ${TotalWeight} AND Destination = '${Destination}'`);
  //   if(data[0].length === 0){
  //       return res.status(404).json({message:'Data not found'})
  //   }
  //   const result = data[0];
  //   return res.status(200).json({message:'Data found',result})
  const { HousBillNo, NOOfPcs, TotalWeight, Destination } = req.query;

  const cleanBill = (v = "") => v.replace(/[- /.]/g, "").toLowerCase();

  if (!HousBillNo || !NOOfPcs || !TotalWeight || !Destination) {
    return res.status(400).json({ message: "Missing required query params" });
  }

  const replacements = { HousBillNo, NOOfPcs, TotalWeight, Destination };

  // 1) EXACT match
  const exactSql = `
    DECLARE @bill NVARCHAR(50) =
      REPLACE(REPLACE(REPLACE(REPLACE(:HousBillNo, '-', ''), ' ', ''), '/', ''), '.', '');

    SELECT Arrived, DORelease, Stored, Clearance, HousBillNo
    FROM vw_TrackingLCLByHouseBlNO
    WHERE REPLACE(REPLACE(REPLACE(REPLACE(HousBillNo, '-', ''), ' ', ''), '/', ''), '.', '') = @bill
      AND NOOfPcs = :NOOfPcs
      AND TotalWeight = :TotalWeight
      AND Destination = :Destination;
  `;

  const exact = await mssqlSequelize.query(exactSql, {
    replacements,
    type: mssqlSequelize.QueryTypes.SELECT,
  });

  if (exact.length > 0) {
    return res.status(200).json({
      message: "Data found",
      result: exact,
      matchType: "exact",
    });
  }

  // 2) FUZZY fallback (when HousBillNo is mistyped)
  const fuzzySql = `
    DECLARE @bill NVARCHAR(50) =
      REPLACE(REPLACE(REPLACE(REPLACE(:HousBillNo, '-', ''), ' ', ''), '/', ''), '.', '');

    ;WITH C AS (
      SELECT
        v.Arrived,
        v.DORelease,
        v.Stored,
        v.Clearance,
        v.HousBillNo,
        CleanBillNo = REPLACE(REPLACE(REPLACE(REPLACE(v.HousBillNo, '-', ''), ' ', ''), '/', ''), '.', '')
      FROM vw_TrackingLCLByHouseBlNO v
      WHERE v.NOOfPcs = :NOOfPcs
        AND v.TotalWeight = :TotalWeight
        AND v.Destination = :Destination
    ),
    Candidates AS (
      SELECT TOP (50) *,
        DIFFERENCE(CleanBillNo, @bill) AS DiffScore
      FROM C
      WHERE CleanBillNo LIKE LEFT(@bill, 3) + '%'
         OR @bill LIKE LEFT(CleanBillNo, 3) + '%'
         OR DIFFERENCE(CleanBillNo, @bill) >= 3
    )
    SELECT TOP (1) Arrived, DORelease, Stored, Clearance, HousBillNo
    FROM Candidates
    ORDER BY
      DiffScore DESC,
      ABS(LEN(CleanBillNo) - LEN(@bill)) ASC,
      CASE WHEN LEFT(CleanBillNo, 4) = LEFT(@bill, 4) THEN 0 ELSE 1 END;
  `;

  const fuzzy = await mssqlSequelize.query(fuzzySql, {
    replacements,
    type: mssqlSequelize.QueryTypes.SELECT,
  });

  if (fuzzy.length > 0) {
    const dbBill = cleanBill(fuzzy[0].HousBillNo);
    const userBill = cleanBill(HousBillNo);

    const message =
      dbBill === userBill
        ? "Data found"
        : "Closest match found (h/bl no might be mistyped)";

    return res.status(200).json({
      message,
      result: fuzzy,
      matchType: dbBill === userBill ? "exact" : "closest",
    });
  }

  return res.status(404).json({ message: "Data not found" });
}

// update done
// tracking personal effect
export const trackingPersonalEffectService = async(req,res)=>{
//     const {HousBillNo , NOOfPcs , TotalWeight , Destination}= req.query;
//     const data = await mssqlSequelize.query(`SELECT Arrived,DepartureDate FROM vw_trackingPersonalEffect WHERE REPLACE(REPLACE(REPLACE(REPLACE(HousBillNo, '-', ''), ' ', ''), '/', ''), '.', '') =
//   REPLACE(REPLACE(REPLACE(REPLACE('${HousBillNo}', '-', ''), ' ', ''), '/', ''), '.', '') AND (NOOfPcs = '${NOOfPcs}' AND TotalWeight = ${TotalWeight} AND Destination = '${Destination}')`);
//     if(data[0].length === 0){
//         return res.status(404).json({message:'Data not found'})
//     }
//     const result = data[0];
//     return res.status(200).json({message:'Data found',result})

const { HousBillNo, NOOfPcs, TotalWeight, Destination } = req.query;

const cleanBill = (v = "") =>
  v.replace(/[- /.]/g, "").toLowerCase();

    if (!HousBillNo || !NOOfPcs || !TotalWeight || !Destination) {
      return res.status(400).json({ message: "Missing required query params" });
    }

    // 1) Exact match (SAFE + parameterized)
    const exactSql = `
      DECLARE @bill NVARCHAR(50) =
        REPLACE(REPLACE(REPLACE(REPLACE(:HousBillNo, '-', ''), ' ', ''), '/', ''), '.', '');

      SELECT Arrived, DepartureDate, HousBillNo
      FROM vw_trackingPersonalEffect
      WHERE REPLACE(REPLACE(REPLACE(REPLACE(HousBillNo, '-', ''), ' ', ''), '/', ''), '.', '') = @bill
        AND NOOfPcs = :NOOfPcs
        AND TotalWeight = :TotalWeight
        AND Destination = :Destination;
    `;

    const exact = await mssqlSequelize.query(exactSql, {
      replacements: { HousBillNo, NOOfPcs, TotalWeight, Destination },
      type: mssqlSequelize.QueryTypes.SELECT,
    });

    if (exact.length > 0) {
      return res.status(200).json({ message: "Data found", result: exact, matchType: "exact" });
    }

    // 2) Fallback fuzzy: get closest BillNo among rows where other fields match
    //    (prefix-candidate + ranking)
    const fuzzySql = `
      DECLARE @bill NVARCHAR(50) =
        REPLACE(REPLACE(REPLACE(REPLACE(:HousBillNo, '-', ''), ' ', ''), '/', ''), '.', '');

      ;WITH C AS (
        SELECT
          v.Arrived,
          v.DepartureDate,
          v.HousBillNo,
          CleanBillNo = REPLACE(REPLACE(REPLACE(REPLACE(v.HousBillNo, '-', ''), ' ', ''), '/', ''), '.', '')
        FROM vw_trackingPersonalEffect v
        WHERE v.NOOfPcs = :NOOfPcs
          AND v.TotalWeight = :TotalWeight
          AND v.Destination = :Destination
      ),
      Candidates AS (
        SELECT TOP (50) *,
        DIFFERENCE(CleanBillNo, @bill) AS DiffScore
        FROM C
        WHERE CleanBillNo LIKE LEFT(@bill, 3) + '%'
        OR @bill LIKE LEFT(CleanBillNo, 3) + '%'
        OR DIFFERENCE(CleanBillNo, @bill) >= 3   -- 👈 NEW
)
      SELECT TOP (1) Arrived, DepartureDate, HousBillNo
      FROM Candidates
      ORDER BY
        DiffScore DESC,
        ABS(LEN(CleanBillNo) - LEN(@bill)) ASC,
        CASE WHEN LEFT(CleanBillNo, 4) = LEFT(@bill, 4) THEN 0 ELSE 1 END;

    `;

    const fuzzy = await mssqlSequelize.query(fuzzySql, {
      replacements: { HousBillNo, NOOfPcs, TotalWeight, Destination },
      type: mssqlSequelize.QueryTypes.SELECT,
    });

    if (fuzzy.length > 0) {

  const dbBill = cleanBill(fuzzy[0].HousBillNo);
  const userBill = cleanBill(HousBillNo);

  const message =
    dbBill === userBill
      ? "Data found"
      : "Closest match found (h/bl no might be mistyped)";

  return res.status(200).json({
    message,
    result: fuzzy,
  });
}

    return res.status(404).json({ message: "Data not found" });
}

// can't apply fuzzy search
// tracking clearance by bil no
export const trackingClearanceByBillNoService = async(req,res)=>{
    const {BillNo , PortOfDischarge, VesselEnName}= req.query;
    const data = await mssqlSequelize.query(`SELECT ContainerUnderClearance,AtThePort,UnderTracking,ClearanceDone,VesselEnName FROM vw_TrackingClearanceAndTrackingbyBLNo WHERE REPLACE(REPLACE(REPLACE(REPLACE(BillNo, '-', ''), ' ', ''), '/', ''), '.', '') =
  REPLACE(REPLACE(REPLACE(REPLACE('${BillNo}', '-', ''), ' ', ''), '/', ''), '.', '') AND PortOfDischarge = '${PortOfDischarge}'  `);
    // const data = await mssqlSequelize.query(`SELECT * FROM vw_TrackingClearanceAndTrackingbyBLNo WHERE BillNo = '${BillNo}' AND PortOfDischarge = '${PortOfDischarge}'`);
    if(data[0].length === 0){
        return res.status(404).json({message:'Data not found'})
    }
    const result = data[0][0];
    return res.status(200).json({message:'Data found',result})
}

// can't apply fuzzy search
// tracking clearance by container no
export const trackingClearanceByContainerNoService = async(req,res)=>{
    const {ContainerNumber , PortOfDischarge, VesselEnName}= req.query;
    const data = await mssqlSequelize.query(`SELECT ContainerUnderClearance,AtThePort,UnderTracking,ClearanceDone FROM vw_TrackingClearanceAndTrackingbyContainerNo WHERE ContainerNumber = '${ContainerNumber}' AND PortOfDischarge = '${PortOfDischarge}' AND VesselEnName = '${VesselEnName}'`);
    // const data = await mssqlSequelize.query(`SELECT * FROM vw_TrackingClearanceAndTrackingbyContainerNo `)
    if(data[0].length === 0){
        return res.status(404).json({message:'Data not found'})
    }
    const result = data[0];
    return res.status(200).json({message:'Data found',result})
}

// update done
// tracking air flight
export const trackingAirFlightService = async(req,res)=>{
  //   const {AWBNo , Destination, NOOfPcs , TotalWeight}= req.query;
  //   // const data = await mssqlSequelize.query(`SELECT * FROM vw_TrackingAirFreightShipment WHERE destination = '${Destination}'`);
  //   const data = await mssqlSequelize.query(`SELECT ArrivalDate,Cleared,DepartureDate,BLReleaseDate,destination FROM vw_TrackingAirFreightShipment WHERE REPLACE(REPLACE(REPLACE(REPLACE(AWBNo, '-', ''), ' ', ''), '/', ''), '.', '') =
  // REPLACE(REPLACE(REPLACE(REPLACE('${AWBNo}', '-', ''), ' ', ''), '/', ''), '.', '') OR (Destination = '${Destination}' AND NOOfPcs = '${NOOfPcs}' AND TotalWeight = ${TotalWeight})`);
  //   if(data[0].length === 0){
  //       return res.status(404).json({message:'Data not found'})
  //   }
  //   let exportImport;
  //   if(Destination.toLowerCase() === 'jeddah' ||Destination.toLowerCase() === 'dammam'||Destination.toLowerCase() === 'riyadh' ){
  //       exportImport = 'import';
  //   }else{
  //       exportImport = 'export';
  //   }
  //   const result = data[0];
  //   return res.status(200).json({message:'Data found',result,exportImport})
  const { AWBNo, Destination, NOOfPcs, TotalWeight } = req.query;

  const cleanBill = (v = "") => v.replace(/[- /.]/g, "").toLowerCase();

  if (!AWBNo || !Destination || !NOOfPcs || !TotalWeight) {
    return res.status(400).json({ message: "Missing required query params" });
  }

  const replacements = { AWBNo, Destination, NOOfPcs, TotalWeight };

  // export/import logic (keep same)
  let exportImport;
  const dest = Destination.toLowerCase();
  if (dest === "jeddah" || dest === "dammam" || dest === "riyadh") {
    exportImport = "import";
  } else {
    exportImport = "export";
  }

  // 1) EXACT AWB match
  const exactSql = `
    DECLARE @awb NVARCHAR(50) =
      REPLACE(REPLACE(REPLACE(REPLACE(:AWBNo, '-', ''), ' ', ''), '/', ''), '.', '');

    SELECT ArrivalDate, Cleared, DepartureDate, BLReleaseDate, Destination, AWBNo
    FROM vw_TrackingAirFreightShipment
    WHERE REPLACE(REPLACE(REPLACE(REPLACE(AWBNo, '-', ''), ' ', ''), '/', ''), '.', '') = @awb
      AND Destination = :Destination
      AND NOOfPcs = :NOOfPcs
      AND TotalWeight = :TotalWeight;
  `;

  const exact = await mssqlSequelize.query(exactSql, {
    replacements,
    type: mssqlSequelize.QueryTypes.SELECT,
  });

  if (exact.length > 0) {
    return res.status(200).json({
      message: "Data found",
      result: exact,
      exportImport,
      matchType: "exact",
    });
  }

  // 2) FUZZY AWB match (typo-tolerant) BUT still require the other fields
  const fuzzySql = `
    DECLARE @awb NVARCHAR(50) =
      REPLACE(REPLACE(REPLACE(REPLACE(:AWBNo, '-', ''), ' ', ''), '/', ''), '.', '');

    ;WITH C AS (
      SELECT
        v.ArrivalDate,
        v.Cleared,
        v.DepartureDate,
        v.BLReleaseDate,
        v.Destination,
        v.AWBNo,
        CleanAWB = REPLACE(REPLACE(REPLACE(REPLACE(v.AWBNo, '-', ''), ' ', ''), '/', ''), '.', '')
      FROM vw_TrackingAirFreightShipment v
      WHERE v.Destination = :Destination
        AND v.NOOfPcs = :NOOfPcs
        AND v.TotalWeight = :TotalWeight
    ),
    Candidates AS (
      SELECT TOP (50) *,
        DIFFERENCE(CleanAWB, @awb) AS DiffScore
      FROM C
      WHERE CleanAWB LIKE LEFT(@awb, 3) + '%'
         OR @awb LIKE LEFT(CleanAWB, 3) + '%'
         OR DIFFERENCE(CleanAWB, @awb) >= 3
    )
    SELECT TOP (1)
      ArrivalDate, Cleared, DepartureDate, BLReleaseDate, Destination, AWBNo
    FROM Candidates
    ORDER BY
      DiffScore DESC,
      ABS(LEN(CleanAWB) - LEN(@awb)) ASC,
      CASE WHEN LEFT(CleanAWB, 4) = LEFT(@awb, 4) THEN 0 ELSE 1 END;
  `;

  const fuzzy = await mssqlSequelize.query(fuzzySql, {
    replacements,
    type: mssqlSequelize.QueryTypes.SELECT,
  });

  if (fuzzy.length > 0) {
    const dbAwb = cleanBill(fuzzy[0].AWBNo);
    const userAwb = cleanBill(AWBNo);

    const message =
      dbAwb === userAwb
        ? "Data found"
        : "Closest match found (AWB no might be mistyped)";

    return res.status(200).json({
      message,
      result: fuzzy,
      exportImport,
      matchType: dbAwb === userAwb ? "exact" : "closest",
    });
  }

  // 3) Optional fallback: if they typed AWB totally wrong, still find by other fields
  // (this matches your original OR logic, but now it's controlled and safe)
  const byFieldsSql = `
    SELECT ArrivalDate, Cleared, DepartureDate, BLReleaseDate, Destination, AWBNo
    FROM vw_TrackingAirFreightShipment
    WHERE Destination = :Destination
      AND NOOfPcs = :NOOfPcs
      AND TotalWeight = :TotalWeight;
  `;

  const byFields = await mssqlSequelize.query(byFieldsSql, {
    replacements,
    type: mssqlSequelize.QueryTypes.SELECT,
  });

  if (byFields.length > 0) {
    return res.status(200).json({
      message: "Data found",
      result: byFields,
      exportImport,
      matchType: "by_fields",
    });
  }

  return res.status(404).json({ message: "Data not found" });
}

// export const testService = async(req,res)=>{
//     const data = await mssqlSequelize.query(`SELECT * FROM vw_trackingPersonalEffect WHERE HousBillNo = 'JEDG00118300/6'  `);

//     return res.status(200).json({message:'Data found',data})
// }
    
