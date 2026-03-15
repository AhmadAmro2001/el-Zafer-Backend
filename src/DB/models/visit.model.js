import { DataTypes } from "sequelize";
import { sequelizeConfig } from "../connection.js";



const visitsModel = sequelizeConfig.define('tbl_visit',{
    deviceType:{
        type:DataTypes.ENUM('web','mobile'),
        allowNull:false
    }
},{
    timestamps:true,
    updatedAt:false,
})

export {visitsModel};