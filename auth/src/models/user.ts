import mongoose from "mongoose"
import { Password } from "../services/password"

// An interface that desdribes the properties that are required to create a new User
interface UserAttrs {
  email: string
  password: string
}

interface UserModel extends mongoose.Model<UserAttrs> {
  build(attrs: UserAttrs): mongoose.HydratedDocument<UserAttrs>
}

const userSchema = new mongoose.Schema<UserAttrs>(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.password
        delete ret.__v
      },
    },
  }
)

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"))
    this.set("password", hashed)
  }
  done()
})

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs)
}
userSchema.index({ email: 1 }, { unique: true })

const User = mongoose.model<UserAttrs, UserModel>("User", userSchema)

const user = User.build({
  email: "test@test.com",
  password: "password",
})

user.email
user.password

export { User }
