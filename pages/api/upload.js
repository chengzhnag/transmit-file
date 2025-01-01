import fs from 'fs';
import path from 'path';
const tmpPath = require('os').tmpdir()

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // 设置上传文件大小限制
    },
  },
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { file } = req.body;

    const filePath = path.resolve(tmpPath, file.name);
    fs.writeFileSync(filePath, Buffer.from(file.data, 'base64'));

    res.status(200).json({ message: 'File uploaded successfully!' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
