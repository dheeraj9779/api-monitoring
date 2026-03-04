import { AuthController } from "../controller/AuthController.js";
import { AuthService } from "../services/authService.js";
import MongoUserRepository from "../repository/UserRepository.js";

class Container {
    static init(){
        const repositories  = {
            userRepository: MongoUserRepository
        }

        const services = {
            authService: new AuthService(repositories.userRepository)
        }

        const controllers = {
            authController : new AuthController(services.authService)
        }

        return {
            repositories, services, controllers
        }
    }
}

const initialized = Container.init();
export {Container};
export default initialized
