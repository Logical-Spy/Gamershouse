
const Jimp = require('jimp');
const path = require('path');
const userService = require('../services/user-service');
const UserDto = require('../dtos/user-dto');

class ActivateController{
    async activate(req, res){

        const {name, avatar} = req.body;
        if(!name || !avatar){
            return res.status(400).json({message: "All fields are required"});
        }


        const buffer = Buffer.from(
            avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/,''),
            'base64'
        );

        const imagePath = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}.png`;
        // 5274028672-2563342636.png

        try{
            const jimpRes = await Jimp.read(buffer);
            jimpRes
                .resize(150, Jimp.AUTO)
                .write(path.resolve(__dirname, `../storage/${imagePath}`));

        }catch(err){
            return res.status(500).json({message: "Could not process the image"})
        }

        const userId = req.user._id;
        // const userId = req.user.id;

        // Update user
        try{
            const user = await userService.findUser({_id: userId});
            console.log(user);
            if(!user){
                return res.status(404).json({message: "User not found"});
            }
            user.activated = true;
            user.name = name;
            user.avatar = `/storage/${imagePath}`;
            await user.save();
            return res.json({user: new UserDto(user), auth: true});
        }catch(err){
            return res.status(500).json({message: "Something Went wrong, Db error"});
        }
        
        
    }
}



module.exports = new ActivateController();