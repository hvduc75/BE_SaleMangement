import express from "express"

const router = express.Router();

const initApiRoutes = (app) => {
    router.get("/", (req, res) => {
        res.send("Hello world");
    })

    return app.use("/api/v1", router)
}

export default initApiRoutes