const mongoose = require("mongoose");

const connect = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/manage";

    await mongoose.connect(mongoUrl);

    console.log("✅ [Database] Đã kết nối tới MongoDB thành công!");
  } catch (err) {
    console.error("❌ [Database] Lỗi kết nối MongoDB:", err.message);
    process.exit(1); // dừng app nếu DB lỗi
  }
};

module.exports = { connect };