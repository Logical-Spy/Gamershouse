const crypto = require('crypto');
const hashService = require('./hash-services');

const smsSid = process.env.TWILIO_ACCOUNT_SID;
const smsAuthToken = process.env.TWILIO_AUTH_TOKEN;

const twilio = require('twilio')(smsSid,smsAuthToken,

    {lazyLoading: true}
);

class OtpService {
    async generateOtp(){
        const otp = crypto.randomInt(1000, 9999);
        return otp;
    };

    async sendBySms(phone, otp){
        return await twilio.messages.create({
            to: phone,
            from: process.env.SMS_FROM_NUMBER,
            body: `Your Gamershouse OTP is ${otp}`
        });
    };

    verifyOtp(hashedOtp, data){
        let computedHash = hashService.hashOtp(data);
        
        return computedHash === hashedOtp;
    };
}

module.exports = new OtpService();