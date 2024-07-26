const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
const refreshModel = require('../models/refresh-model');

class TokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: '1m'
        });
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: '1y'
        });
        return {accessToken, refreshToken};
    }

    async storeRefreshToken(token, userId){
        try{
            await refreshModel.create({
                token,
                userId,
            })
        }
        catch(err){
            console.log(err.message);
        }
    }
    async verifyAccessToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, accessTokenSecret, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded);
            });
        });
    }
    async verifyRefreshToken(refreshToken) {
        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, refreshTokenSecret, (err, decoded) => {
                if (err) {
                    return reject(err);
                }
                resolve(decoded); 
            });
        });
    }

    async findRefreshToken(userId, refreshToken){
        return await refreshModel.findOne({
            userId: userId, 
            token: refreshToken,
        });
    }
    async updateRefreshToken(userId, refreshToken){
        return await refreshModel.updateOne(
            {userId: userId},
            {token: refreshToken}
        );
    }

    async removeToken(refreshToken){
        return await refreshModel.deleteOne({token: refreshToken});
    }
}

module.exports = new TokenService();