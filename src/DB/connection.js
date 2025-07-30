import {Sequelize} from 'sequelize';
import pg from 'pg';
import tedious from 'tedious'; 

import {config} from 'dotenv';
config();

// mysql connection 
// export const sequelizeConfig = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,{
//     host:process.env.DB_HOST,
//     dialect:'mysql',
//     port:process.env.DB_PORT || 3306,
//     logging:false
// });
export const sequelizeConfig = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // required by Supabase
    }
  },
  logging: false,
});



// sql connection 
export const mssqlSequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mssql',
    port: process.env.DB_PORT,
    dialectOptions: {
      options: {
        trustServerCertificate: true,
        encrypt: false,
      }
    },
    logging: false
  });




  export const database_connection = async () => {
    try {
      // Connect to Supabase (PostgreSQL)
      await sequelizeConfig.authenticate();
      console.log("✅ Supabase connection established!");
  
      // await sequelizeConfig.sync({ alter: true });
      // console.log("✅ Supabase models synced!");
  
      // Connect to SQL Server
      await mssqlSequelize.authenticate();
      console.log("✅ SQL Server connection has been established successfully.");
  
    } catch (error) {
      console.error("❌ Unable to connect to one or more databases:", error);
    }
  }
  