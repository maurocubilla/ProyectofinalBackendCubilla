import { UsersService } from "../services/users.service.js";
import { generateEmailToken, recoveryEmail } from "../helpers/gmail.js";
import {validateToken, createHash} from "../utils.js";
import { checkIsLogged } from "../middlewares/auth.js";

export class SessionsController{
    static redirectLogin = (req,res)=>{
        res.redirect("/login");
    };

    static failSignup = (req,res)=>{
        res.json({status:"error",message: "<p>No se pudo registrar al usuario, "});
    };

    static successSignup = (req,res)=>{
        res.json({status:"succsess",message:"registro exitoso"});
    };

    static successLogin = (req,res)=>{
        res.json({status:"success", message: "login exitoso"});
    };


    static renderProfile = (req,res)=>{
        const user = req.user;
        console.log("user", user);
        res.render("profile",{user});
    };

    static failLogin = (req,res)=>{
        res.json({status:"error",message: "<p>No se pudo loguear al usuario, , <a href='/login'>intenta de nuevo</a></p> "});
    };

    static forgotPassword = async(req,res)=>{
        try {
            const {email} = req.body;
            const user = await UsersService.getUserByEmail(email);
            if(!user){
                return res.json({status:"error", message:"No es posible restablecer la constraseña"});
            }
            //generamos el token con el link para este usuario
            const token = generateEmailToken(email,3*60); //token de 3 min.
            //Enviar el mensaje al usuario con el enlace
            await recoveryEmail(req,email,token);
            res.send("Correo enviado, volver al home");
        } catch (error) {
            res.json({status:"error", message:"No es posible restablecer la constraseña"});
        }
    };

    static resetPassword = async(req,res)=>{
        try {
            const token = req.query.token;
            const {newPassword} = req.body;
            const validEmail = validateToken(token);
            if(validEmail){//token correcto
                const user = await UsersService.getUserByEmail(validEmail);
                if(user){
                    user.password = createHash(newPassword);
                    
                    await UsersService.updateUser(user._id,user);
                    res.send("Contraseña actualizada <a href='/login'>Ir al login</a>")
                }
            } else {
                return res.send("El token ya caduco, volver a intentarlo <a href='/forgot-password'>Restablecer contraseña</a>");
            }
        } catch (error) {
            res.send("No se pudo restablecer la contraseña, volver a intentarlo <a href='/forgot-password'>Restablecer contraseña</a>");
        }
    };
    
    static logout = async(req,res)=>{
        try {
            const user = req.user;
            user.last_connection= new Date();
            await UsersService.updateUser(user._id, user);
            await req.session.destroy();
            res.json({status:"success", message:"sesion finalizada"});
        } catch (error) {
            console.log(error);
            res.json({status:"error", message:"No se pudo cerrar la sesion"});
        }
    }
}
//  class AuthController {

//     static createJwtAndSetCookie(user, res) {
//         const jwt_payload = {
//             id: user._id,
//             cartId: user.cartId,
//             chatId: user.chatId,
//             email: user.email,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             role: user.role
//         };
//         const options = { expiresIn: '1h' };
//         const token = jwt.sign(jwt_payload, config.auth.jwtSecret, options);
        
//         res.cookie('jwt', token, {
//             httpOnly: true,
//             maxAge: 3600000
//         });
//     }

//     static registerView(req, res,customResponse = {}) {
//         return res.render('register', { ...customResponse });
//     }

//     static registerUser(req, res, next) {
//         passport.authenticate('signupStrategy', (error, user, info) => {
//             if (error || !user) {
//                 return res.redirect('/auth/registered-failed');
//             }
//             res.redirect('/auth/registered-successfully'); 
//         })(req, res, next);
//     }

//     static registrationSuccessView(req, res) {
//         return AuthController.loginView(req, res, { message: 'User registered successfully. Please log in' });
//     }

//     static registrationFailedView(req, res) {
//         return AuthController.registerView(req, res, { error: 'Unable to register user.' });
//     }

//     static loginView(req, res, customResponse = {}) {
//         return res.render('login', { ...customResponse });
//     }

//     static loginFailedView(req, res) {
//         return AuthController.loginView(req, res, { error: 'Unable to log in' });
//     }

//     static restorePasswordView(req, res, customResponse = {}) {
//         return res.render('restore-password', { ...customResponse });
//     }

//     static createNewPasswordView(req, res, customResponse = {}) {
//         return res.render('create-password', { ...customResponse, email: req.params.email, date: req.params.date });
//     }

//     static async sendEmailToRestorePassword(req, res) {
//         const { email } = req.body;
//         const user = await UsersService.getUserByEmail(email);

//         if (!user) {
//             return AuthController.restorePasswordView(req, res, { error: 'User not found' });
//         }

//         // date as integer
//         const date = Date.now()
//         const mailOptions = {
//             from: 'rworls@coder.com', 
//             to: email,
//             subject: 'Restore password',
//             text: `Restore your password by going to this link: http://localhost:${config.server.port}/auth/restore-password-confirmation/${email}/${date}`   // TOFIX: Very insecure, encrypt the email and date, or create a code to save in the DB
//         };

//         try {
//             await emailTransporter.sendMail(mailOptions);
//             return AuthController.restorePasswordView(req, res, { message: `An restoration link was sent to ${email}. Please also check spam mailbox.` });
//         } catch (error) {
//             return AuthController.restorePasswordView(req, res, { error: 'Failed to send email.' });
//         }

//     }

//     static async restorePassword(req, res) {
//         const { email, date } = req.params;
//         const { newPassword, confirmPassword } = req.body;
//         const user = await UsersService.getUserByEmail(email);

//         if (!user) {
//             return AuthController.restorePasswordView(req, res, { error: 'User not found' });
//         }

//         const currentDate = Date.now();
//         const expirationTime = 60000; // 1 min
//         if (currentDate - date > expirationTime) {
//             return AuthController.restorePasswordView(req, res, { error: 'Link expired. Please try again.' });
//         }

//         if (newPassword !== confirmPassword) {
//             return AuthController.restorePasswordView(req, res, { error: 'Passwords do not match!' });
//         }

//         await UsersService.setUserPasswordByEmail(email, newPassword);
//         return AuthController.loginView(req, res, { message: 'Password updated successfully. Please log in with your new password.' });
//     }

//     static loginUser(req, res, next) {
//         passport.authenticate('loginStrategy', (err, user, info) => {
//             if (err || !user) {
//                 return res.redirect('/auth/login-failed');
//             }
//             AuthController.createJwtAndSetCookie(user, res);
//             UsersService.updateLoginDate(user._id);
//             res.redirect('/'); 
//         })(req, res, next);
//     }

//     static githubAuth(req, res, next) {
//         passport.authenticate('githubStrategy')(req, res, next);
//     }

//     static githubAuthCallback(req, res, next) {
//         passport.authenticate('githubStrategy', (err, user, info) => {
//             if (err || !user) {
//                 return res.redirect('/login-failed');
//             }
//             AuthController.createJwtAndSetCookie(user, res);
//             UsersService.updateLoginDate(user._id);
//             res.redirect('/'); 
//         })(req, res, next);
//     }

//     static googleAuth(req, res, next) {
//         passport.authenticate('googleStrategy', { scope: ['profile', 'email'] })(req, res, next);
//     }

//     static googleAuthCallback(req, res, next) {
//         passport.authenticate('googleStrategy', (err, user, info) => {
//             if (err || !user) {
//                 return res.redirect('/login-failed');
//             }
//             AuthController.createJwtAndSetCookie(user, res);
//             UsersService.updateLoginDate(user._id);
//             res.redirect('/'); 
//         })(req, res, next);
//     }

//     static logout(req, res) {
//         res.clearCookie('jwt');
//         UsersService.updateLoginDate(req.user.id);
//         return res.redirect('/');
//     }
    
// }

// export default AuthController;
