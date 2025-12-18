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
  REPLACE(REPLACE(REPLACE(REPLACE('${HousBillNo}', '-', ''), ' ', ''), '/', ''), '.', '') AND NOOfPcs = '${NOOfPcs}' AND TotalWeight = ${TotalWeight} AND Destination = '${Destination}'`);
    if(data[0].length === 0){
        return res.status(404).json({message:'Data not found'})
    }
    const result = data[0];
    return res.status(200).json({message:'Data found',result})
}

// tracking personal effect
export const trackingPersonalEffectService = async(req,res)=>{
    const {HousBillNo , NOOfPcs , TotalWeight , Destination}= req.query;
    const data = await mssqlSequelize.query(`SELECT Arrived,DepartureDate FROM vw_trackingPersonalEffect WHERE REPLACE(REPLACE(REPLACE(REPLACE(HousBillNo, '-', ''), ' ', ''), '/', ''), '.', '') =
  REPLACE(REPLACE(REPLACE(REPLACE('${HousBillNo}', '-', ''), ' ', ''), '/', ''), '.', '') AND NOOfPcs = '${NOOfPcs}' AND TotalWeight = ${TotalWeight} AND Destination = '${Destination}'`);
    if(data[0].length === 0){
        return res.status(404).json({message:'Data not found'})
    }
    const result = data[0];
    return res.status(200).json({message:'Data found',result})
}

// tracking clearance by bil no
export const trackingClearanceByBillNoService = async(req,res)=>{
    const {BillNo , PortOfDischarge, VesselEnName}= req.query;
    const data = await mssqlSequelize.query(`SELECT ContainerUnderClearance,AtThePort,UnderTracking,ClearanceDone FROM vw_TrackingClearanceAndTrackingbyBLNo WHERE REPLACE(REPLACE(REPLACE(REPLACE(BillNo, '-', ''), ' ', ''), '/', ''), '.', '') =
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
  REPLACE(REPLACE(REPLACE(REPLACE('${AWBNo}', '-', ''), ' ', ''), '/', ''), '.', '') AND Destination = '${Destination}' AND NOOfPcs = '${NOOfPcs}' AND TotalWeight = ${TotalWeight}`);
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
//     const data = await mssqlSequelize.query(`SELECT * FROM vw_TrackingClearanceAndTrackingbyBLNo WHERE HousBillNo = 'JEA/DMM/MFL087281' AND NOOfPcs = '8' AND TotalWeight = '2192' AND Destination = 'DAMMAM' `);

//     return res.status(200).json({message:'Data found',data})
// }
    
