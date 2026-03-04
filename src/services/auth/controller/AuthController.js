import config from "../../../shared/config/index.js";
import { APPLICATION_ROLES } from "../../../shared/constants/roles.js";
import ResponseFormatter from "../../../shared/utils/responseFormatter.js";

export class AuthController {
    constructor(authService){
        if(!authService){
            throw new Error("Auth Service is required");
        }

        this.authService = authService;
    }

    async onboardSuperAdmin(req,res,next){
        try{
            const { username, email, password } = req.body;

            const superAdminData = {
                username, email, password, role : APPLICATION_ROLES.SUPER_ADMIN
            };

            const {token, user} = await this.authService.onboardSuperAdmin(superAdminData);
            res.cookies('authToken', token, {
                httpOnly: config.cookies.httpOnly,
                secure: config.cookies.secure,
                maxAge: config.cookies.expiresIn
            }) 

            res.status(201).json(ResponseFormatter.success(user, "Super admin created Successfully", 201))
        }
        catch(error){
            next(error);
        }
    }
}