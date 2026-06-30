const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDTO = require('../dtos/user-dto')

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({email})
        if (candidate) {
            throw new Error(`User with ${email} already exists`)
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const activationLink = uuidv4()

        const user = await UserModel.create({email, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)
        
        const userDTO = new UserDTO(user); // id, email, isActivated
        const tokens = tokenService.generateTokens({...userDTO});
        await tokenService.saveToken(userDTO.id, tokens.refreshToken);

        return {...tokens, user: userDTO}
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink});
        if (!user) {
            throw new Error('Incorrect activation link')
        }

        user.isActivated = true;
        return user.save()
    }
}


module.exports = new UserService();