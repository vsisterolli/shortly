import { response } from "express";
import Joi from "joi";

const urlSchema = Joi.object({
    "url": Joi.string().uri({allowRelative: true}).required()
});

export default function validateUrl(req, res, next) {
    try {
        console.log("Hi!")
        const validation = urlSchema.validate(req.body);
        if(validation.error)
            return res.status(422).send(validation.error.message);
        next();
    }
    catch(e) {
        res.status(500).send(e.message);
    }
}