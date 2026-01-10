import { DataTypes } from "sequelize";
import { sequelizeConfig } from "../connection.js";


const dashboardModel = sequelizeConfig.define('tbl_dashboard',{
    email:{
        type:DataTypes.STRING,
        allowNull:false
    },
    type:{
        type:DataTypes.STRING,
        allowNull:false
    },
    place:{
        type:DataTypes.STRING,
        allowNull:false
    },
    order:{
        type:DataTypes.INTEGER,
        allowNull:false,

    }
},{
    timestamps:true,
    createdAt:'created_at'
})

export {dashboardModel};