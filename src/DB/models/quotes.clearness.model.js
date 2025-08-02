import { DataTypes } from "sequelize";
import { sequelizeConfig } from "../connection.js";



const quotesClearnessModel = sequelizeConfig.define('tbl_quotes_clearness',{
    portOfDestination:{
        type:DataTypes.STRING,
        allowNull:false
    },
    typeOfCargo:{
        type:DataTypes.STRING,
        allowNull:false
    },
    emailOrPhone:{
        type:DataTypes.STRING,
        allowNull:false
    },
    requiredService:{
        type:DataTypes.STRING,
        allowNull:false
    }    
},{
    timestamps:true
})

export {quotesClearnessModel};