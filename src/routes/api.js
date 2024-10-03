import express from "express";
import userController from "../controllers/userController";
import multer from "multer";

// config form data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

const initApiRoutes = (app) => {
    // user
    router.post("/create-user", upload.single("image"), userController.createFunc);
    router.get("/get-All-User", userController.readFunc);
    router.put("/update-user", upload.single("image"), userController.updateFunc)
    router.delete("/delete-user", userController.deleteFunc)

    return app.use("/api/v1", router)
}

export default initApiRoutes