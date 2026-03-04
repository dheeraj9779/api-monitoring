import jwt from "jsonwebtoken";
import logger from "../../../shared/config/logger.js";
import config from "../../../shared/config.js";

export class AuthService {
    constructor(userRepository){
        if(!userRepository){
            throw new Error("UserRepository is required");
        }

        this.userRepository = userRepository;
    }

    generateToken(user){
        const {_id, email, username, role, clientId } = user;
        
        const payload = {
            userId: _id,
            username,
            email,
            role,
            clientId
        }

        return jwt.sign(payload, config.jwt.secret, {
            expiresIn: config.jwt.expiresIn
        })
    }

    responseFormatter(user){
        const userObj = user.toObject ? user.toObject() : {...user};
        delete userObj.password;
        return userObj;
    }

    async onboardSuperAdmin(superAdminData){
        try {
            const existingUser = await this.userRepository.findAll();

            if(existingUser && existingUser.length > 0){
                throw new Error("Super admin onboarding is disabled", 403)   
            }

            const user = await this.userRepository.create(superAdminData);

            const token = this.generateToken(user);

            logger.info("Admin onboarded successfully", {
                username: user.username
            })

            return {
                user: responseFormatter(user),
                token
            }
        } catch(error){
            logger.error("Error in Admin onboarding",error);
            throw error;
        }
    }
}