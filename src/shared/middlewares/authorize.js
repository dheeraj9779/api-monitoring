import ResponseFormatter from "../utils/responseFormatter.js"


const authorize = (allowedRoles = []) => (req,res,next) => {
    try {
        if(!req.user || !req.user.role){
            return res.status(403).json(ResponseFormatter("Forbidden", 403));
        }

        if(allowedRoles.length === 0){
            next();
        }

        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json(ResponseFormatter("Insufficient Permission", 403))
        }

        next()
    } catch (error) {
        return res.status(403).json(ResponseFormatter("Forbidden", 403));
    }
}

export default authorize