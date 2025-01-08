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

    // 获取文件大小
    const fileStats = fs.statSync(localFilePath);
    const fileSize = fileStats.size;

    res.setHeader('Content-Length', fileSize);
    // 设置响应头，触发文件下载
    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(fileName)}`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // 创建可读流并管道到响应
    const fileStream = fs.createReadStream(localFilePath);
    fileStream.pipe(res);

    // 文件下载完成后删除文件
    fileStream.on('end', () => {
      fs.unlinkSync(localFilePath); // 删除文件
      fs.unlinkSync(`${localFilePath}.json`); // 删除文件
      delete globalSeesion[code];
      console.log(`文件 ${fileName} 已删除`);
      cache.set('globalSeesion', globalSeesion);
    });

    fileStream.on('error', (err) => {
      console.error('文件下载失败:', err);
      res.status(500).json({ message: '文件下载失败' });
    });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}