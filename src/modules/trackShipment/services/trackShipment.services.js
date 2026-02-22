import { mssqlSequelize } from "../../../DB/connection.js";


// tracking full container 
export const trackingFullContainerService = async (req,res)=>{
    const {BillNumber, ContainerNumber,PortOfLoading,PortOfDischarge} = req.query;
    const data = await mssqlSequelize.query(`SELECT ArrivalDate,DepartureDate FROM vw_trackingFullContainer WHERE REPLACE(REPLACE(REPLACE(REPLACE(BillNumber, '-', ''), ' ', ''), '/', ''), '.', '') =
  REPLACE(REPLACE(REPLACE(REPLACE('${BillNumber}', '-', ''), ' ', ''), '/', ''), '.', '') AND ContainerNumber = '${ContainerNumber}' AND PortOfLoading = '${PortOfLoading}' AND PortOfDischarge = '${PortOfDischarge}'`) ;
    if(data[0].length === 0){
        return res.status(404).json({message:'Data not found'})
    }
    let exportImport;
    if(PortOfLoading.toLowerCase() === 'jeddah' ||PortOfLoading.toLowerCase() === 'dammam'||PortOfLoading.toLowerCase() === 'riyadh' ){
        exportImport = 'export';
    }else{
        exportImport = 'import';
    }
    const result = data[0];
    return res.status(200).json({message:'Data found',result,exportImport})
}
// pdf for tracking full container


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

// tracking lcl by housebillno
export const trackingLCLByHouseBillNoService = async(req,res)=>{
    const{HousBillNo , NOOfPcs , TotalWeight , Destination} = req.query;
    const data = await mssqlSequelize.query(`SELECT Arrived ,DORelease , Stored,Clearance FROM vw_TrackingLCLByHouseBlNO WHERE REPLACE(REPLACE(REPLACE(REPLACE(HousBillNo, '-', ''), ' ', ''), '/', ''), '.', '') =
  REPLACE(REPLACE(REPLACE(REPLACE('${HousBillNo}', '-', ''), ' ', ''), '/', ''), '.', '') OR  (NOOfPcs = '${NOOfPcs}' AND TotalWeight = ${TotalWeight} AND Destination = '${Destination}')`);
    if(data[0].length === 0){
        return res.status(404).json({message:'Data not found'})
    }
    const result = data[0];
    return res.status(200).json({message:'Data found',result})
}

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

// tracking air flight
export const trackingAirFlightService = async(req,res)=>{
    const {AWBNo , Destination, NOOfPcs , TotalWeight}= req.query;
    // const data = await mssqlSequelize.query(`SELECT * FROM vw_TrackingAirFreightShipment WHERE destination = '${Destination}'`);
    const data = await mssqlSequelize.query(`SELECT ArrivalDate,Cleared,DepartureDate,BLReleaseDate,destination FROM vw_TrackingAirFreightShipment WHERE REPLACE(REPLACE(REPLACE(REPLACE(AWBNo, '-', ''), ' ', ''), '/', ''), '.', '') =
  REPLACE(REPLACE(REPLACE(REPLACE('${AWBNo}', '-', ''), ' ', ''), '/', ''), '.', '') OR (Destination = '${Destination}' AND NOOfPcs = '${NOOfPcs}' AND TotalWeight = ${TotalWeight})`);
    if(data[0].length === 0){
        return res.status(404).json({message:'Data not found'})
    }
    let exportImport;
    if(Destination.toLowerCase() === 'jeddah' ||Destination.toLowerCase() === 'dammam'||Destination.toLowerCase() === 'riyadh' ){
        exportImport = 'import';
    }else{
        exportImport = 'export';
    }
    const result = data[0];
    return res.status(200).json({message:'Data found',result,exportImport})
}

// export const testService = async(req,res)=>{
//     const data = await mssqlSequelize.query(`SELECT * FROM vw_trackingPersonalEffect WHERE HousBillNo = 'JEDG00118300/6'  `);

//     return res.status(200).json({message:'Data found',data})
// }
    
