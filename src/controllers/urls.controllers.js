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

export async function openUrl(req, res) {
    try {
        const { shortUrl } = req.params;
        const url = await connection.query(`SELECT id, url, views FROM links WHERE "shortUrl"=$1`, [shortUrl]);
        if(!url.rows.length)
            return res.status(404).send("shortUrl não encontrada");
        await connection.query(`UPDATE links SET views=$1 WHERE id=$2`,
                                [url.rows[0].views + 1, url.rows[0].id])
        res.status(301).redirect("//" + url.rows[0].url);
    }
    catch(e) {
        console.log(e)
        res.status(500).send(e.message);
    }
}

export async function deleteUrl(req, res) {
    try {
        const { id } = req.params;
        await connection.query("DELETE FROM links WHERE id=$1", [id]);
        res.sendStatus(204)
    }
    catch(e) {
        console.log(e)
        res.status(500).send(e.message);
    }
}