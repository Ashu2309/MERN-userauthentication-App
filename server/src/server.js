import express from "express";
import "./db/conn.js"
import router from "./router/router.js";
import morgan from "morgan"
import cors from "cors";


const app = express();
const port = 8000;

app.use(cors({
    origin: "http://localhost:3000"
}))

app.use(express.json())
app.use(morgan('tiny'))

app.use("/api", router)

app.listen(port, () => {
    console.log("App is running at ", port)
})