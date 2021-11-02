import express from "express";
import { currentUser } from "@povertay/common";
import { config } from "../config";

const router = express.Router();

router.get("/api/users/currentuser", currentUser(config.jwt_secret), (req, res) => {
  res.send({ currentUser: req.currentUser ?? null });
});

export { router as currentUserRouter };
