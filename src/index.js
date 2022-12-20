import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import usersRouter from  "./routers/users.routers.js";
dotenv.config();

const app = express();
const router = express.Router();

router.use(usersRouter);

app.use(cors());
app.use(express.json())
app.use(router);

app.listen(process.env.PORT || 4000)