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
        
        const user = await connection.query("SELECT password, id FROM users WHERE email=$1", [req.body.email])
        if(!user.rows.length)
            return res.status(401).send("Combinação de usuário/senha não encontrada");
        
        const encryptedPasssword = user.rows[0].password;
        if(!bcrypt.compareSync(req.body.password, encryptedPasssword)) 
            return res.status(401).send("Combinação de usuário/senha não encontrada");

        res.locals.id = user.rows[0].id;
        next();
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}