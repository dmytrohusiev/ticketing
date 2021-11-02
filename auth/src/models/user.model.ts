import mongoose, { Document, Model } from "mongoose";
import { Password } from "../services/password";

export interface UserAttrs {
  email: string;
  password: string;
}

export interface UserDoc extends Document, UserAttrs {}

export interface UserModel extends Model<UserAttrs> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema<UserAttrs, UserModel>(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      transform(_doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      }
    }
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

userSchema.static("build", function build(attrs: UserAttrs) {
  return new User(attrs);
});

export const User = mongoose.model<UserAttrs, UserModel>("User", userSchema);
