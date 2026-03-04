import { Router } from "express";
import { UserDatabase } from "./user.database.js";
import { UserService } from "./user.service.js";
import { UserController } from "./user.controller.js";

const router = Router();

const db = new UserDatabase();
const service = new UserService(db);
const controller = new UserController(service);

router.get('/', controller.list);
router.post('/register', controller.register);
router.post('/bulk-register', controller.bulkRegister);

router.patch('/:id', controller.update);

export const userRoutes = router;

