import Joi from "joi";
import connection from "../database/db.js";
import bcrypt from "bcrypt";

const signInSchema = Joi.object({
    "email": Joi.string().email().required(),
    "password": Joi.string().max(19).required()
});

export default async function validateSignIn(req, res, next) {
    try {
        const validation = signInSchema.validate(req.body);
        if(validation.error)
            return res.status(422).send(validation.error.message);
        
        const passwords = await connection.query("SELECT password FROM users WHERE email=$1", [req.body.email])
        if(!passwords.rows.length)
            return res.status(401).send("Combinação de usuário/senha não encontrada");
        
        const encryptedPasssword = passwords.rows[0].password;
        if(!bcrypt.compareSync(req.body.password, encryptedPasssword)) 
            return res.status(401).send("Combinação de usuário/senha não encontrada");

        next();
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}