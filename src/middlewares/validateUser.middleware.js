import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function validateUser(req, res, next) {
    try {
        const authorization = req.headers.authorization;
        if(!authorization)
            return res.status(401).send("Header inválido");
        const uncryptedJwt = jsonwebtoken.verify(authorization, process.env.JWT_KEY || "cabra macho");
        res.locals.userId = uncryptedJwt.userId;
        next();
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}