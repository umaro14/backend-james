
// http://localhost:5000


import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

//Get the file path from the URL of the cureent module
const __filename = fileURLToPath(import.meta.url);

//Get the directory name from the file path
const __dirname = dirname(__filename);


//MIDDLEWARE
app.use(express.json());
//Serve the HTML file from the /public directory, tell express to serve all files from the public folder as static files
app.use(express.static(path.join(__dirname, "../public")));


//This is for serving the HTML file
app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname, "public", "index.html"))
});

//ROUTES, use this authRoutes when we hit endpoints that contains "/auth"

app.use("/auth", authRoutes);
app.use("/todos", authMiddleware, todoRoutes); //every single todo routes is blocked by this authMiddleware untill the authMiddleware verifies the token



app.listen(PORT, () => console.log(`Server has started on port: ${PORT}`));