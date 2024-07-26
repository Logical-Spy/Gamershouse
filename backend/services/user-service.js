const UserModel = require('../models/user-model');

class UserService {
    async findUser(filter) {
        try {
            const user = await UserModel.findOne(filter);
            return user;
        } catch (error) {
            console.error('Error finding user:', error);
            throw new Error('Could not find user');
        }
    }

    async createUser(data) {
        try {
            const user = await UserModel.create(data);
            return user;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Could not create user');
        }
    }
}

module.exports = new UserService();
