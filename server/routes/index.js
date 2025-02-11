import { Router } from "express";
import { ContestsModel } from "../database/models/index.js";

const api_router = Router();

api_router.get('/why', (req, res) => {
  res.status(200).json({server_data: "hello"})
})

api_router.get('/data', async (req, res) => {
  const contestUsers =  await ContestsModel.findById('67a99d547038e23bb61b8349').populate("participants.user", "first_name email username")
  res.status(200).json({server_data: contestUsers})
})

export default api_router;