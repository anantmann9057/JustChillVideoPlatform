import { Router } from "express";
import { healthCheck } from "../controllers/healthcheck.controller.js";

const healthcheckRouter = Router();

healthcheckRouter.route('/').get(healthCheck);

export default healthcheckRouter;