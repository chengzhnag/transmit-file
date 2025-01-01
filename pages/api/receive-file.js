import { sessions } from './create-session';
import fs from 'fs';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { code } = req.body;
    if (sessions[code] && sessions[code].file) {
      const fileData = fs.readFileSync(sessions[code].file, { encoding: 'base64' });
      res.status(200).json({ file: fileData, fileName: sessions[code].fileName });

      // 删除文件并使会话失效
      fs.unlinkSync(sessions[code].file);
      delete sessions[code];
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
