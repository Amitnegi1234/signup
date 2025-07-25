import { Sequelize } from "sequelize";

const sequelize=new Sequelize('fullstack','root','Amitnegi@123',{
    host:'localhost',
    dialect:'mysql'
});

(async()=>{
    try {
        await sequelize.authenticate();
        console.log("database connected");
    } catch (error) {
        console.log(error);
    }
})()
export const db=sequelize;