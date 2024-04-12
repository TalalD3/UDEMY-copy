import User from "../models/Users.js";
import jwt from 'jsonwebtoken';

export const signUp = async (req, res, next) => {

    let check = await User.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "existing user found for same email address" })
    }

    try {
        const user = await User.create({
            title: req.body.title,
            email: req.body.email,
            password: req.body.password,
        });

        const data = {
            user: {
                id: user.id,
            }
        }
        const token = jwt.sign(data, 'secret_ecom');
        res.json({
            success: true,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500);
        next(error);
    }

}