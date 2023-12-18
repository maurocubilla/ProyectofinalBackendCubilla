import { CartsService, logfail } from "../services/carts.service.js";

export class ViewsController{
    static renderHome = (req,res)=>{
        res.render("home");
        
    };

    static renderSignup = (req,res)=>{
        res.render("signup");
    };

    static renderProducts = (req,res)=>{
        res.render("Products");
    };

    static renderLogin = (req,res)=>{
        res.render("login");
    };

    static renderProfile = (req,res)=>{
        const user = req.user;
        res.render("profile",{user});
    };

    static renderForgot = (req,res)=>{
        res.render("forgotPassword");
    };

    static renderContact = (req,res)=>{
        res.render("Contacto")
    };

    static renderSpeakers = (req,res)=>{
        res.render("parlantes")
    };

    static renderSubwofers = (req,res)=>{
        res.render("subwofers")
    };

    static renderAlarmas = (req,res)=>{
        res.render("alarmas")
    };

    static renderAmplificadores = (req,res)=>{
        res.render("amplificadores")
    };

    static renderAccesorios = (req,res)=>{
        res.render("accesorios")
    };
    
    static renderCart = (req,res)=>{
        res.render("cart")
    };

    static renderStereo = (req,res)=>{
        res.render("estereos")
    };
 
    static renderResetPass = (req,res)=>{
        const token = req.query.token;
        res.render("resetPassword",{token});
    };

    static async notAuthorizedView(req, res) {
        await ViewsController.homeView(req, res, { error: "No tienes permisos para acceder" });
      };

    static async cartView(req, res, customResponse = {}) {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    try {
      const cart = await CartsService.getCartById(req.user.cartId);
      res.status(200).render('cart', { ...cart, ...customResponse, user: req.user });
    } catch(error) {
      logfail(error);
      res.status(500).render('cart', { products: [], error: "El carrito no se pudo cargar correctamente" });
    };
  }
}

