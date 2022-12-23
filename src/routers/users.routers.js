import { Router } from "express";
import { signUp, signIn, displayUsersLinks, getRanking } from "../controllers/users.controllers.js";
import validateSignUp from "../middlewares/validateSignUp.middleware.js";
import validateSignIn from "../middlewares/validateSignIn.middleware.js";
import validateUser from "../middlewares/validateUser.middleware.js";

const usersRouter = Router();

usersRouter.post("/signup", validateSignUp, signUp);
usersRouter.post("/signin", validateSignIn, signIn);
usersRouter.get("/users/me", validateUser, displayUsersLinks);
usersRouter.get("/ranking", getRanking)

export default usersRouter;