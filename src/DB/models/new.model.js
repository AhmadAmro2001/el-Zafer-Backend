import { DataTypes } from "sequelize";
import { sequelizeConfig } from "../connection.js";


const newsModel = sequelizeConfig.define('tbl_news',{
    title:{
        type:DataTypes.STRING,
        allowNull: true
    },
    content:{
        type:DataTypes.STRING,
        allowNull: true
    },
    images:{
        type:DataTypes.STRING,
        allowNull: true
    },
},{
    timestamps:true,
    createdAt:'created_at'
})

export {newsModel};