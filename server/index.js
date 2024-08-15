const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const userRoute = require("./routes/user.routes");
const cors = require("cors");

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); //  to accept json data

app.use(cors());
app.use("/api/user", userRoute);

// error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, console.log(`listening on Port :  ${PORT}`));
