import fs from 'fs';
import cache from '../../lib/catch';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({ message: '文件传输code不能为空' });
    }

    const globalSeesion = cache.get('globalSeesion') || {};

    // 获取文件信息
    const fileInfo = globalSeesion[code];
    if (!fileInfo) {
      return res.status(404).json({ message: '文件不存在' });
    }

    const { fileName, localFilePath } = fileInfo;

    if (!fs.existsSync(localFilePath)) {
      return res.status(404).json({ message: '文件不存在' });
    }
    fs.unlinkSync(localFilePath); // 删除文件
    fs.unlinkSync(`${localFilePath}.json`); // 删除文件
    delete globalSeesion[code];
    console.log(`文件 ${fileName} 已删除`);
    cache.set('globalSeesion', globalSeesion);
    return res.status(200).json({ message: `文件 ${fileName} 已删除`, status: 1 });
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}