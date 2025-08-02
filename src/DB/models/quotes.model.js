import { DataTypes } from "sequelize";
import { sequelizeConfig } from "../connection.js";
import { countries } from "../../constants/constants.js";

function normalize(input) {
    let obj = input;
  
    if (typeof input === 'string') {
      try {
        obj = JSON.parse(input);
      } catch {
        return '{}';
      }
    }
  
    if (!obj || typeof obj !== 'object') return '{}';
  
    return JSON.stringify({
      code: obj.code,
      id: obj.id,
      flag: obj.flag
    });
  }

const quotesModel = sequelizeConfig.define('tbl_quotes',{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phoneNumber:{
        type:DataTypes.STRING,
        allowNull:false
    },
    message:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    timestamps:true
})

export  {quotesModel};
