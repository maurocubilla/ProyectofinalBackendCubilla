import { usersDao } from "../dao/managers/index.js";
import { CartsService } from "./carts.service.js";

export class UsersService{
    static getUserByEmail = async(email)=>{
        return await usersDao.getByEmail(email);
    };

    static saveUser = async(newUser)=>{
        return await usersDao.save(newUser);
    };

    static getUserById = async(userId)=>{
        return await usersDao.getById(userId);
    };

    static updateUser = async(userId,userInfo)=>{
        return await usersDao.update(userId,userInfo);
    };


static async registerUser(req, email, password) {
    const existingUser = await this.getUserByEmail(email);

    if (existingUser) {
        throw new CustomError('User already exists.', 'INVALID_DATA');
    }

    if (email.toLowerCase() === config.admin.email.toLowerCase()) {
        throw new CustomError('Admin already exists.', 'INVALID_DATA');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const cart = await CartsService.createCart();
    const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: email,
        age: req.body.age,
        password: hashedPassword,
        cartId: cart._id
    };
    
    return await usersDao.addNewUser(newUser);
}
};

 