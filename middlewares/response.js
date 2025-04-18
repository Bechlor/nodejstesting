import { messages } from "../utilis/messages.js";

const response = async (req, res) => {
  const httpCode = req.statusCode || 500;
  const data = req.data || null;
  const status = req.status || 0;
  const count = req.count || 0;
  const result = messages("en"); //  const result = messages(req.lang || "en");

  const message = req.message;

  let msg = result[message];
  msg = msg ? msg : req.message;
  return res.status(httpCode).json({ status, message: msg, data, count });
};

export default response;

