import { Router } from "express";
import { ContestsModel } from "../database/models/";

const api_router = Router();

api_router.get('/why', (req, res) => {
  res.status(200).json({server_data: "hello"})
})

api_router.get('/data', async (req, res) => {
  // peter.jones3@example.com
  const contestUsers =  await ContestsModel.find({}).populate("participants.user", "first_name email username")
  res.status(200).json({server_data: contestUsers})
})

export default api_router;