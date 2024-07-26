const otpService = require('../services/otp-services');
const hashService = require('../services/hash-services');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto');

class AuthController{
    async sendOtp(req, res) {

        const { phone } = req.body;
        if(!phone){
            res.status(400).json({message: 'Phone field is required'});
        }

        const otp = await otpService.generateOtp();

        // Hash
        const ttl = 1000 * 60 * 2;
        const expires = Date.now() + ttl;
        const data = `${phone}.${otp}.${expires}`;
        const hash = hashService.hashOtp(data);

        // Hash

        // Send OTP 
        try{
            // await otpService.sendBySms(phone, otp);
            res.json({
                hash: `${hash}.${expires}`,
                phone,
                otp,
            });
        }
        catch(err){
            console.log(err);
            res.status(500).json({message: 'message sending failed'});
        }
        // Send OTP
    }
    async verifyOtp(req, res){
        
        const {otp, hash, phone} = req.body;
        if(!otp || !hash || !phone){
            res.status(400).json({message: 'All fields are required'});
        }

        const [hashedOtp, expires] = hash.split('.');
        if(Date.now() > +expires){
            return res.status(400).json({message:'OTP expired'});
        }

        const data = `${phone}.${otp}.${expires}`;

        const isValid = otpService.verifyOtp(hashedOtp, data);

        if(!isValid){
            res.status(400).json({message: 'Invalid OTP'});
        }

        let user;
        try{
            user = await userService.findUser({phone: phone});
            if(!user){
                user = await userService.createUser({phone: phone});
            }
        }
        catch(err){
            console.log(err);
            res.status(500).json({message: 'Db Error'});
        }

        // Token 
        const {accessToken, refreshToken} = tokenService.generateTokens({
            _id: user._id,
            activated: false
        });

        await tokenService.storeRefreshToken(refreshToken, user._id);

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000* 60* 60* 24* 30,
            httpOnly: true,
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000* 60* 60* 24* 30,
            httpOnly: true,
        });

        const userDto = new UserDto(user);
        res.json({user: userDto, auth: true});
    };

    async refresh(req, res){
        // get refresh token from cookie
        const { refreshToken: refreshTokenFromCookie } = req.cookies;
        
        if (!refreshTokenFromCookie) {
            return res.status(401).json({ message: 'Refresh token not found' });
        }

        // Check if token is valid
        let userData;
        try{
            userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
        }
        catch(err){
            return res.status(401).json({ message: "Invalid token"})
        }
        // Check if token is in DB
        try{
            const token = await tokenService.findRefreshToken(
            userData._id,
            // userData.id,
            refreshTokenFromCookie
            );
            if(!token){
                return res.status(401).json({ message: "Invalid token"})
            }
        }   
        catch(err){
            return res.status(500).json({ message: "Internal Error"})
        }
        // Check if valid user
        const user = await userService.findUser({ _id: userData._id});
        // const user = await userService.findUser({ _id: userData.id});
        if(!user){
            return res.status(404).json({ message: "No User"})
        }
        // Generate new token
        const {refreshToken, accessToken} = tokenService.generateTokens({
            _id: userData._id,
            // _id: userData.id,
        });
        // Update refresh token
        try{
            await tokenService.updateRefreshToken(userData._id, refreshToken);
            // await tokenService.updateRefreshToken(userData.id, refreshToken);

        }
        catch(err){
            return res.status(500).json({ message: "Internal Error"})
        }
        // put in cookie
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000* 60* 60* 24* 30,
            httpOnly: true,
        });

        res.cookie('accessToken', accessToken, {
            maxAge: 1000* 60* 60* 24* 30,
            httpOnly: true,
        });

        // response
        const userDto = new UserDto(user);
        res.json({user: userDto, auth: true});
    };

    async logout(req, res){
        const { refreshToken } = req.cookies;
        await tokenService.removeToken(refreshToken);
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        res.json({user: null, auth: false});
    }
}


module.exports = new AuthController();