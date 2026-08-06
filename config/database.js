const mongoose = require('mongoose');

let isConnected = false; // Biến lưu trạng thái kết nối

module.exports.connect = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URL);
    isConnected = db.connections[0].readyState;
    console.log("CONNECT SUCCESS!");
  } catch (error) {
    console.log("Connect Error:", error);
  }
};