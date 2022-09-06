import express from "express"
import "express-async-errors"
import mongoose from "mongoose"
import cookieSession from "cookie-session"
import { errorHandler, NotFoundError } from "@rticketing/common"

import { currentUserRouter } from "./routes/current-user"
import { signinRouter } from "./routes/signin"
import { signoutRouter } from "./routes/signout"
import { signupRouter } from "./routes/signup"

const app = express()
app.set("trust proxy", true)
app.use(express.json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
)

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signoutRouter)
app.use(signupRouter)

app.all("*", async (req, res, next) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
