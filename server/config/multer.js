const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profiles') 
    },
    filename: (req, file, cb) => {
        console.log(path.extname(file.originalname))
        const uniqueName = `${Date.now()}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpeg|png|gif|webp|svg/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimeType = allowedTypes.test(file.mimetype)
    if(extName && mimeType) {
        cb(null, true)
    }
    else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, SVG, and WebP are allowed.'))
    }
}
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  fileFilter  
})

module.exports = upload;