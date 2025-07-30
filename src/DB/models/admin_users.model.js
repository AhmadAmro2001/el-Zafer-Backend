import { DataTypes } from "sequelize";
import { sequelizeConfig } from "../connection.js";


const adminModel = sequelizeConfig.define('tbl_admin',{
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            checkPasswordLength(value){
                if(value.length < 6){
                    throw new Error('Password must be at least 6 characters long')
                }
            }
        }
    }
},{
    timestamps:true,
    createdAt:'created_at'
})

export {adminModel};