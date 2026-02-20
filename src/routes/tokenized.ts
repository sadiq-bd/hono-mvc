import { Hono } from "hono";
import AuthTokenController from "../controllers/AuthTokenController";

export default new Hono()
    .post('/create', AuthTokenController.createToken)
    .post('/refresh', AuthTokenController.refreshToken)
    .delete('/remove', AuthTokenController.removeToken);
