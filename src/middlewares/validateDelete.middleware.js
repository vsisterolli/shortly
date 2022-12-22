import connection from "../database/db.js";

export default async function validateDelete(req, res, next) {
    try {
        const [{ userId }, { id }] = [res.locals, req.params]
        const url = await connection.query("SELECT * FROM links WHERE id=$1", [id]);
        
        if(!url.rows.length)
            return res.sendStatus(404);

        if(url.rows[0].userId !== userId) 
            return res.sendStatus(401);
    
        next();
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}