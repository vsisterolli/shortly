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
                                        process.env.JWT_KEY);
    res.send(token);
}

export async function displayUsersLinks(req, res) {
    try {
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
    catch(e) {
        console.log(e);
        res.status(500).send(e.message);
    }
}

export async function getRanking(req, res) {
    try {
        const ranking = await connection.query(`SELECT
                                                    u.id, u.username AS name,
                                                    COUNT(l) AS "linksCount",
                                                    SUM(COALESCE(l.views, 0)) AS "visitCount"
                                                FROM users u
                                                LEFT JOIN links l ON l."userId"=u.id
                                                GROUP BY u.id
                                                ORDER BY "visitCount" DESC
                                                LIMIT 10`);
        res.send(ranking.rows)
    }
    catch(e) {
        console.log(e);
        res.status(500).send(e.message);
    }
}
