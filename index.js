import express from "express"
import portofolios from "./routes/portofolios.js"
import auth from "./routes/auth.js"
import cors from "cors"
import dotenv from "dotenv"
import middleware from "./mid.js"
dotenv.config();
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

app.get("/",(req,res)=>{
    res.send({message:"Hello World", success:true})
})

app.listen(serverPort, () => {
    console.log(`Server Berjalan Di Port http://localhost:${serverPort}`)
})