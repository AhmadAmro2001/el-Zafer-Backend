import { DataTypes } from "sequelize";
import { sequelizeConfig } from "../connection.js";



const exportQuotesModel = sequelizeConfig.define('tbl_quotes_export',{
        portOfLoading:{
            type:DataTypes.STRING,
            allowNull:false
        },
        portOfDischarge:{
            type:DataTypes.STRING,
            allowNull:false
        },
        numberOfContainers:{
            type:DataTypes.STRING,
            allowNull:false
        },
        numberOfPcs:{
            type:DataTypes.STRING,
            allowNull:false
        },
        expectedRate:{
            type:DataTypes.STRING,
            allowNull:false
        },
        emailOrPhone:{
            type:DataTypes.STRING,
            allowNull:false
        }
},{
    timestamps:true
});

export {exportQuotesModel};