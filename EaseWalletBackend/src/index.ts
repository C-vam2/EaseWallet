import express from "express"
import  cors from "cors";
import router from "./router/rootRouter";

const app =  express();
app.use(express.json());

app.use(cors());
app.use("/api/v1",router);

app.listen(3000,()=>{
    console.log("Server is listening on PORT 3000...");
},);