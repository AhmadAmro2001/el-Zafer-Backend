import { DataTypes } from "sequelize";
import { sequelizeConfig } from "../connection.js";


const blacklistTokensModel = sequelizeConfig.define('tbl_blacklist_tokens',{ 
    tokenId:{
        type:DataTypes.STRING,
        allowNull:false
    },
    expiryDate:{
        type:DataTypes.STRING,
        allowNull:false
    }
},{
    timestamps:true
})

export  {blacklistTokensModel};