import mongoose from "mongoose";
import config from "./index";
import logger from "./logger";


/**
 * MongoDb database connector
 */
class MongoConnection {
    constructor(){
        this.connection = null
    }

    /**
     * Method to Connect to mongoDB database
     * @returns {Promise<mongoose.Connection>}
     */
    async connect(){
        try{
            if(this.connection){
                logger.info("MongoDb already connected");
                return this.connection;
            }
            else{
                await mongoose.connect(config.mongo.uri,{
                    dbName : config.mongo.dbName
                })

                this.connection = mongoose.connection;

                logger.info(`MongoDb connected: ${config.mongo.uri}`);

                this.connection.on("error", error => {
                    logger.error("Mongodb connection error",error)
                })

                this.connection.on("disconnected", () => {
                    logger.error("Mongodb Disconnected")
                })

                return this.connection;
            }
        }
        catch(error){
            logger.error("Failed to connect MongoDB:",error)
            throw error;
        }
    }

    /**
     * Method to disconnect to the mongoDB database
     */
    async disconnect(){
        try{
            if(this.connection){
                await mongoose.disconnect();
                this.connection = null;
                logger.info("MongoDb disconnected");
            }
        }
        catch(error){
            logger.error("Failed to disconnect MongoDB:",error)
            throw error;
        }
    }

    /**
     * Get the active connection
     * @returns {mongoose.Connection}
     */
    getConnection(){
        return this.connection;
    }

}

export default MongoConnection;