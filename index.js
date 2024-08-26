const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database.js");
const Auth = require("./routes/Auth.js");
const Product = require("./routes/Product.js");
const User = require("./routes/User.js");

dotenv.config();

const app = express();
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cookieParser()); 
app.use(cors()); 

app.use("/", Auth);
app.use("/", Product);
app.use("/", User);

// app.get("/", (req, res) => {
//   res.json({ message: "REST API" });
// });

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
