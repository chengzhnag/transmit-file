import { sessions } from './create-session';
import fs from 'fs';
import path from 'path';
const tmpPath = require('os').tmpdir()

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '200mb', // 设置上传文件大小限制
    },
  },
};

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { code, file } = req.body;
    if (sessions[code]) {
      console.log('tmpPath:', tmpPath);
      const filePath = path.resolve(tmpPath, `${code}_${file.name}`);
      fs.writeFileSync(filePath, Buffer.from(file.data, 'base64'));
      sessions[code].file = filePath;
      sessions[code].fileName = `${code}_${file.name}`;
      res.status(200).json({ message: 'File sent successfully', sessions });
    } else {
      res.status(404).json({ message: 'Session not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
