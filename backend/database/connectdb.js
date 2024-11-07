import mongoose from "mongoose";

const connectiondb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("connection is successfully");
  } catch (error) {
    console.log("Error Connecting to Database", error);
  }
};

export default connectiondb;
