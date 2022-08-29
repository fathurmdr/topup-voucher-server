const mongoose = require("mongoose");
const { mongoURI } = require("../config");

mongoose.connect(mongoURI);

const db = mongoose.connection;

module.exports = db;
