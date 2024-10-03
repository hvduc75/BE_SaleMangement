import express from "express";
import userController from "../controllers/userController";
import multer from "multer";

// config form data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

const initApiRoutes = (app) => {
    router.post("/create-user", upload.single("image"), userController.createFunc);
    router.get("/get-All-User", userController.readFunc);

    return app.use("/api/v1", router)
}

export default initApiRoutes