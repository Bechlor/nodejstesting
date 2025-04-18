import response from "./response.js";

export const tryCatchHandler = (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      console.log("tryCatch error", error.stack);
      req.message = error.message;
     if(error.message.includes("cannot be null")){
      req.statusCode = 400
      req.message = "Required data missing"
     }
      return response(req, res);
    }
  };
};