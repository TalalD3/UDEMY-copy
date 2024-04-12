import User from "../models/Users.js";
import jwt from 'jsonwebtoken';

export const login = async (req, res, next) => {

    let user = await User.findOne({ email: req.body.email });

    if (user) {
        if (req.body.password === user.password) {
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
        } else {
            res.json({
                success: false,
                message: "Passwords do not match"
            })
        }
    } else {
        res.json({
            success: false,
            message: "User not found"
        })
    }
}