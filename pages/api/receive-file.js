import fs from 'fs';
import cache from '../../lib/catch';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { code } = req.body;
    const globalSeesion = cache.get('globalSeesion') || {};
    if (globalSeesion[code]) {
      if (globalSeesion[code].filePath) {
        return res.status(200).json({
          filePath: globalSeesion[code].filePath,
          fileName: globalSeesion[code].fileName,
          status: 1,
          success: true
        });
        // 删除文件并使会话失效
        // fs.unlinkSync(globalSeesion[code].file);
        // delete globalSeesion[code];
      } else {
        return res.status(200).json({ filePath: null, status: 0, success: true });
      }
    } else {
      return res.status(404).json({ message: '该会话不存在，请输入正确的会话代码' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
