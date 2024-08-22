var express = require("express");
var cors = require("cors");
require("dotenv").config();
const multer = require("multer");
const path = require("path");

var app = express();

app.use(cors());
app.use("/public", express.static(process.cwd() + "/public"));

// Set up storage options for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Directory to save the uploaded files
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize multer with storage options
const upload = multer({ storage: storage });

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.post("/api/fileanalyse", upload.single("upfile"), (req, res) => {
  try {
    res.status(200).json({
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred during the upload" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Your app is listening on port " + port);
});
