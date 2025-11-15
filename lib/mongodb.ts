import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
// verificar la variable de entorno
if (!MONGODB_URI) {
  throw new Error("Por favor define la variable de entorno MONGODB_URI");
}

export const connectDB = async () => {
  try {
    // verificar si ya estamos conectados
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection.asPromise();
    }
    return await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
  }
};
