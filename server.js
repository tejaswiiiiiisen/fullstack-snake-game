const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const scoreRoutes = require("./routes/scoreRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", scoreRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/snakegame")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Snake Backend Running");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});