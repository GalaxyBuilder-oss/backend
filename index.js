import express from "express"
import portofolios from "./routes/portofolios.js"
import auth from "./routes/auth.js"
import cors from "cors"
import middleware from "./mid.js"
const app = express()
const serverPort = process.env.SERVER_PORT
app.use(express.json())
app.use(
    cors({
        origin: "*"
    })
)

app.use("/auth", auth)
app.use("/portofolios", middleware, portofolios)

app.listen(serverPort, () => {
    console.log(`Server Berjalan Di Port http://localhost:${serverPort}`)
})