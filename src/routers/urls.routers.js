import { Router } from "express";
import {getUrl, shortenUrl, openUrl, deleteUrl} from "../controllers/urls.controllers.js";
import validateUrl from "../middlewares/validateUrl.middleware.js";
import validateUser from "../middlewares/validateUser.middleware.js";
import validateDelete from "../middlewares/validateDelete.middleware.js";

const urlsRouter = Router();

urlsRouter.post("/urls/shorten", validateUrl, validateUser, shortenUrl);
urlsRouter.get("/urls/:id", getUrl);
urlsRouter.get("/urls/open/:shortUrl", openUrl);
urlsRouter.delete("/urls/:id", validateUser, validateDelete, deleteUrl);


export default urlsRouter;