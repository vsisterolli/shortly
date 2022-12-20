import connection from "../database/db.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export async function signUp(req, res) {
    try {
        const {name, email, password} = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        await connection.query(`INSERT INTO users (username, email, password)
                                VALUES ($1, $2, $3)`, [name, email, hashedPassword]);
        res.sendStatus(201);
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}

export async function signIn(req, res) {
    const token = jsonwebtoken.sign({userId: res.locals.id}, 
                                        process.env.JWT_KEY || "cabra macho");
    res.send(token);
}