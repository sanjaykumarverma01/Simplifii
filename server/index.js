const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const userRoute = require("./routes/user.routes");
const cors = require("cors");
const path = require("path");

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); //  to accept json data

app.use(cors());
app.use("/api/user", userRoute);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "client/build")));
  
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------

// error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, console.log(`listening on Port :  ${PORT}`));
