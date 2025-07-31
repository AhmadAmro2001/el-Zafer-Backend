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
    // phoneCode: {
    //     type: DataTypes.JSON,
    //     allowNull: false,
    //     defaultValue: {
    //       flag: '',
    //       id: '',
    //       code: ''
    //     },
    //     validate: {
    //         isValidJson(value) {
    //           const allowed = new Set(countries.map(normalize));
    //           const incoming = normalize(value);
          
    //           console.log('Normalized incoming:', incoming);
    //           if (!allowed.has(incoming)) {
    //             throw new Error('Invalid phone code object');
    //           }
    //         }
    //       }
    // },
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
