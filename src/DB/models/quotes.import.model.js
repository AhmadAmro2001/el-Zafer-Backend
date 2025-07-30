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
        allowNull:false
    },
    numberOfPcs:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    expectedRate:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    emailOrPhone:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    timestamps:true
});

export {importQuotesModel};