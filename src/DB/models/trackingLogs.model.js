import { DataTypes } from "sequelize";
import { sequelizeConfig } from "../connection.js";



const trackingLogsModel = sequelizeConfig.define('tbl_tracking_logs',{
    trackingNumber:{
        type:DataTypes.STRING,
        allowNull:true
    }   
},{
    timestamps:true,
    updatedAt:false
})

export {trackingLogsModel};