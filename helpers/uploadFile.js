import multer from "multer";
// Use memory storage to avoid saving files locally
const storage = multer.memoryStorage();

const upload = multer({ storage });

export default upload;