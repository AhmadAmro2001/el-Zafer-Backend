import { mssqlSequelize } from "../../../DB/connection.js";


// tracking full container 
export const trackingFullContainerService = async (req,res)=>{
    const {BillNumber, ContainerNumber,PortOfLoading,PortOfDischarge} = req.query;
    const data = await mssqlSequelize.query(`SELECT ArrivalDate,DepartureDate FROM vw_trackingFullContainer WHERE BillNumber = '${BillNumber}' AND ContainerNumber = '${ContainerNumber}' AND PortOfLoading = '${PortOfLoading}' AND PortOfDischarge = '${PortOfDischarge}'`) ;
    if(data[0].length === 0){
        return res.status(404).json({message:'Data not found'})
    }
    const result = data[0];
    return res.status(200).json({message:'Data found',result})
}

// tracking lcl by container
export const trackingLCLByContainerService =async( req,res)=>{
    const {BillNumber , ContainerNumber , PortOfDischarge}= req.query;
    const data = await mssqlSequelize.query(`SELECT HousBillNo,NOOfPcs,DORelease FROM vw_trackingLCLByContainer WHERE BillNumber = '${BillNumber}' AND ContainerNumber = '${ContainerNumber}' AND PortOfDischarge = '${PortOfDischarge}'`);
    if(data[0].length === 0){
        return res.status(404).json({message:'Data not found'})
    }
    const result = data[0];
    return res.status(200).json({message:'Data found',result})
}

// tracking lcl by housebillno
export const trackingLCLByHouseBillNoService = async(req,res)=>{
    const{HousBillNo , NOOfPcs , TotalWeight , Destination} = req.query;
    const data = await mssqlSequelize.query(`SELECT Arrived ,DORelease , Stored,Clearance FROM vw_TrackingLCLByHouseBlNO WHERE HousBillNo = '${HousBillNo}' AND NOOfPcs = ${NOOfPcs} AND TotalWeight = ${TotalWeight} AND Destination = '${Destination}'`);
    if(data[0].length === 0){
        return res.status(404).json({message:'Data not found'})
    }
    const result = data[0];
    return res.status(200).json({message:'Data found',result})
}

// tracking personal effect
export const trackingPersonalEffectService = async(req,res)=>{
    const {HousBillNo , NOOfPcs , TotalWeight , Destination}= req.query;
    const data = await mssqlSequelize.query(`SELECT Arrived,Delivered FROM vw_trackingPersonalEffect WHERE HousBillNo = '${HousBillNo}' AND NOOfPcs = ${NOOfPcs} AND TotalWeight = ${TotalWeight} AND Destination = '${Destination}'`);
    if(data[0].length === 0){
        return res.status(404).json({message:'Data not found'})
    }
    const result = data[0];
    return res.status(200).json({message:'Data found',result})
}

// tracking clearance by bil no
export const trackingClearanceByBillNoService = async(req,res)=>{
    const {BillNo , PortOfDischarge, VesselEnName}= req.query;
    const data = await mssqlSequelize.query(`SELECT ContainerUnderClearance,AtThePort,UnderTracking,ClearanceDone FROM vw_TrackingClearanceAndTrackingbyBLNo WHERE BillNo = '${BillNo}' AND PortOfDischarge = '${PortOfDischarge}' AND VesselEnName = '${VesselEnName}'`);
    if(data[0].length === 0){
        return res.status(404).json({message:'Data not found'})
    }
    const result = data[0];
    return res.status(200).json({message:'Data found',result})
}
// tracking clearance by container no
export const trackingClearanceByContainerNoService = async(req,res)=>{
    const {ContainerNumber , PortOfDischarge, VesselEnName}= req.query;
    const data = await mssqlSequelize.query(`SELECT ContainerUnderClearance,AtThePort,UnderTracking,ClearanceDone FROM vw_TrackingClearanceAndTrackingbyContainerNo WHERE ContainerNumber = '${ContainerNumber}' AND PortOfDischarge = '${PortOfDischarge}' AND VesselEnName = '${VesselEnName}'`);
    if(data[0].length === 0){
        return res.status(404).json({message:'Data not found'})
    }
    const result = data[0];
    return res.status(200).json({message:'Data found',result})
}

// tracking air flight
export const trackingAirFlightService = async(req,res)=>{
    const {AWBNo , Destination, NOOfPcs , TotalWeight}= req.query;
    const data = await mssqlSequelize.query(`SELECT ArrivalDate,cleared FROM vw_TrackingAirFreightShipment WHERE AWBNo = '${AWBNo}' AND Destination = '${Destination}' AND NOOfPcs = ${NOOfPcs} AND TotalWeight = ${TotalWeight}`);
    if(data[0].length === 0){
        return res.status(404).json({message:'Data not found'})
    }
    const result = data[0];
    return res.status(200).json({message:'Data found',result})
}
    
