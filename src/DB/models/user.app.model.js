import { DataTypes } from "sequelize";
import { sequelizeConfig } from "../connection.js";


const userModel = sequelizeConfig.define('tbl_user_app',{
    userName:{
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
    },
    phoneNumber:{
        type:DataTypes.STRING,
        allowNull:true
    }
},{
    timestamps:true,
    createdAt:'created_at'
})

export {userModel};