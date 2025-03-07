import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    if (conn) console.log("DB connected:" + conn.connection.name);
  } catch (error) {
    console.error("Error in connectDb", error.message);
    process.exit(1);
  }
};

export default connectDb;
