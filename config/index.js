const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

module.exports = {
  rootPath: path.resolve(__dirname, ".."),
  serviceName: process.env.SERVICE_NAME,
  jwtKey: process.env.SECRET,
  mongoURI: process.env.MONGO_URI,
  imageURL: process.env.IMAGE_URL,
};
