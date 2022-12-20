import Joi from "joi";
import connection from "../database/db.js";

const signUpSchema = Joi.object({
    "name": Joi.string().max(19).required(),
    "email": Joi.string().email().required(),
    "password": Joi.string().max(19).required(),
    "confirmPassword": Joi.ref("password")
});

export default async function validateSignUp(req, res, next) {
    try {
        const validation = signUpSchema.validate(req.body);
        if(validation.error)
            return res.status(422).send(validation.error.message);
        
        const email = await connection.query("SELECT email FROM users WHERE email=$1", [req.body.email])
        if(email.rows.length)
            return res.status(409).send("Email já cadastrado");

        next();
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}