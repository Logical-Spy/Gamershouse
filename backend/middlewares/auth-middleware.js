const tokenService = require("../services/token-service");

module.exports = async function(req, res, next) {
    try {
        const { accessToken } = req.cookies;
        console.log('Access Token:', accessToken);

        if (!accessToken) {
            console.error('No access token found');
            return res.status(401).json({ message: 'No access token' });
        }

        const userData = await tokenService.verifyAccessToken(accessToken);
        console.log('User Data:', userData);

        if (!userData) {
            console.error('Invalid access token');
            return res.status(401).json({ message: 'Invalid access token' });
        }

        req.user = userData; 
        next();
    } catch (err) {
        console.error(`Auth Middleware Error: ${err.message}`);
        res.status(401).json({ message: 'Invalid Token' });
    }
};
