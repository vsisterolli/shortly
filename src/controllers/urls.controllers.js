import { nanoid } from "nanoid";
import connection from "../database/db.js";

export async function shortenUrl(req, res) {
    try {
        const shortUrl = nanoid(8);
        await connection.query(`INSERT INTO links (url, "userId", "shortUrl") VALUES ($1, $2, $3)`,
                                [req.body.url, res.locals.userId, shortUrl]);
        res.status(201).send({"shortUrl": shortUrl}); 
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}

export async function getUrl(req, res) {
    try {
        const { id } = req.params;
        const url = await connection.query(`SELECT id, "shortUrl", url FROM links WHERE id=$1`, [id]);
        if(!url.rows.length)
            return res.sendStatus(404);
        res.send(url.rows[0]);
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}