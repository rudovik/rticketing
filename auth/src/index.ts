import mongoose from "mongoose"
import { app } from "./app"

const closeMongooseConnection = () => {
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed!")
    process.exit()
  })
}

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined")
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined")
  }
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to MongoDB")

    process.on("SIGINT", closeMongooseConnection)
    process.on("SIGTERM", closeMongooseConnection)

    app.listen(3000, () => {
      console.log("Listening on port 3000!!!!!")
    })
  } catch (error) {
    console.log(error)
    setTimeout(() => {
      process.exit()
    }, 2000)
  }
}

start()
