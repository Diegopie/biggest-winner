import { Router } from "express";

const api_router = Router();

api_router.get('/why', (req, res) => {
  res.status(200).json({server_data: "hello"})
})

export default api_router;