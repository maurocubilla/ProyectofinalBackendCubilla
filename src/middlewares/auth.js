export const checkRole = (roles)=>{ // roles = ["admin", "superadmin"]
    return (req,res,next)=>{
        // console.log("req", req.user.role);
        if(roles.includes(req.user.role)){
            next();
        } else {
            res.json({status:"error", message:"No tienes permisos para usar este recurso"});
        }
    }
};

 export const checkAuthenticated = (req,res,next)=>{
     if(req.user){
         next();
     } else {
         res.json({status:"error", message:"Debes estar autenticado"});
     }
 };

 export const checkIsLogged = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    }
    next();
};

// const requireUserLogin = (req,res,next) => {
//     if (!req.user) {
//         return res.redirect('/auth/login');
//     } else if (req.user.role === 'admin') {
//         return res.redirect('/not-authorized');
//     } else {
//         next();
//     }
//   }
  
//   const requireLogin = checkRole( {roles:['user','premium','admin'], redirect: '/auth/login'})
//   const checkIsUser = checkRole( {roles:['user','premium']})
//   const checkIsPremiumOrAdmin = checkRole( {roles:['premium','admin']})
//   const checkIsAdmin = checkRole( {roles:['admin']})
//   const checkIsLogged = checkRole( {roles:['user', 'premium', 'admin']})
  
//   export {requireUserLogin, requireLogin, checkIsUser, checkIsAdmin, checkIsLogged, checkIsPremiumOrAdmin }