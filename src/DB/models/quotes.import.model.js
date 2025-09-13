import { DataTypes } from "sequelize";
import { sequelizeConfig } from "../connection.js";



const importQuotesModel = sequelizeConfig.define('tbl_quotes_import',{
    portOfLoading:{
        type:DataTypes.STRING,
        allowNull:false
    },
    portOfDischarge:{
        type:DataTypes.STRING,
        allowNull:false
    },
    termsAndCondition:{
        type:DataTypes.STRING,
        allowNull:true
    },
    numberOfPcs:{
        type:DataTypes.STRING,
        allowNull:true
    },
    expectedRate:{
        type:DataTypes.STRING,
        allowNull:true
    },
    emailOrPhone:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    timestamps:true
});

export {importQuotesModel};