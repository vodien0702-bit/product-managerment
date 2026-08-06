const mongoose = require('mongoose');

let isConnected = false;

module.exports.connect = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(process.env.MONGO_URL);
    isConnected = db.connections[0].readyState;
    console.log("Connect Success!");
  } catch (error) {
    console.log("Connect Error:", error);
  }
};