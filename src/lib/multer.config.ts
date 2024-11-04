import multer from 'multer';
import { join } from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = join(process.cwd(), 'public', 'product');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileName = file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop();
    cb(null, fileName);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    console.error('File rejected (not an image):', file.originalname); // Log rejected file
    cb(new Error('Only image files are allowed'));
  }
};

export const upload = multer({ storage: storage, fileFilter: fileFilter }).single('file');
