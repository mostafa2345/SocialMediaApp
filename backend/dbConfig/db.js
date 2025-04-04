import mongoose from "mongoose";

async function connectDB(MONGO_URI) {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('db connected');
    } catch (error) {
        console.log(error.message);
    }


}
export default connectDB;
