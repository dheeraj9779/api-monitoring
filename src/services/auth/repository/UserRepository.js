import User from "../../../shared/models/User.js";
import BaseRepository from "./BaseRepository.js";
import logger from "../../../shared/config/logger.js";

class MongoUserRepository extends BaseRepository {
    constructor(){
        super(User)
    }

    async create(userdata){
        try{
            let data = {...userdata};

            if(data.role === "super_admin" && !data.permission){
                data.permission = {
                    canCreateApiKeys: true,
                    canManageUsers: true,
                    canViewAnalytics: true,
                    canExportData: true
                }
            }

            const user = new this.model(data);
            await user.save();

            logger.info("User Created", {username: user.username});
            return user;
        }
        catch(error){
            logger.error("Error creating user", error);
            throw error;
        }
    }

    async findById(userId){
        try{
            const user = await this.model.findById(userId);
            return user;
        }
        catch(error){
            logger.error("Error finding user by id", error);
            throw error;
        }
    }

    async findByEmail(email){
        try {
            const user = await this.model.findOne({email})
        } catch (error) {
            logger.error("Error finding user by email", error);
            throw error;
        }
    }

    async findByEmail(username){
        try {
            const user = await this.model.findOne({username})
        } catch (error) {
            logger.error("Error finding user by username", error);
            throw error;
        }
    }

    async findAll(){
        try {
            const user = await this.model.findOne({ isActive: true }).select("-password");
            return user;
        } catch (error) {
            logger.error("Error finding user by username", error);
            throw error;
        }
    }
}

export default new MongoUserRepository()

 