import { Router } from "express";
//importar el controlador
import { ViewsController } from "../controllers/views.controller.js";
//import { checkIsUser} from "../middlewares/auth.js";


const router = Router();
//router.get("/", ViewsController.homeView);
router.get('/not-authorized', ViewsController.notAuthorizedView);  
router.get("/",ViewsController.renderHome);
router.get("/registro", ViewsController.renderSignup);
router.get("/login",ViewsController.renderLogin);
router.get("/perfil",ViewsController.renderProfile);
router.get("/forgot-password", ViewsController.renderForgot);
router.get("/reset-password", ViewsController.renderResetPass);
router.get("/accesorios",ViewsController.renderAccesorios);
router.get("/contacto",ViewsController.renderContact);
router.get("/parlantes",ViewsController.renderSpeakers);
router.get("/subwofers",ViewsController.renderSubwofers);
router.get("/alarmas",ViewsController.renderAlarmas);
router.get("/amplificadores",ViewsController.renderAmplificadores);
router.get("/cart",ViewsController.renderCart);
router.get("/estereos",ViewsController.renderStereo);




export {router as viewsRouter}