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

export async function displayUsersLinks(req, res) {
    const {userId} = res.locals;
    const user = await connection.query(`SELECT 
                                            u.id, u.username AS "name",
                                            SUM(l.views) AS "visitCount",
                                            array_agg(json_build_object(
                                                'id', l.id,
                                                'shortUrl', l."shortUrl",
                                                'url', l.url,
                                                'visitCount', l.views
                                            )) AS "shortenedUrls" 
                                        FROM users u
                                        JOIN links l ON l."userId"=$1
                                        WHERE u.id=$1
                                        GROUP BY u.id
                                        `, [userId]);
    res.send(user.rows[0])
}