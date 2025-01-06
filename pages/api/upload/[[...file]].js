import { Server, Upload } from '@tus/server'
import { FileStore } from '@tus/file-store'
import path from 'path';
const tmpPath = require('os').tmpdir();
import cache from '../../../lib/catch';

const tusServer = new Server({
  path: '/api/upload', // 上传接口路径
  maxSize: 200 * 1024 * 1024,
  datastore: new FileStore({
    directory: path.resolve(tmpPath), // 文件存储目录
  }),
  onUploadFinish: (req, res, upload) => {
    const globalSeesion = cache.get('globalSeesion') || {};
    const code = upload.metadata.code;
    globalSeesion[code].filePath = req.url;
    globalSeesion[code].localFilePath = upload?.storage?.path;
    globalSeesion[code].fileName = upload?.metadata?.filename;
    cache.set('globalSeesion', globalSeesion);
  }
});


export const config = {
  api: {
    bodyParser: false, // 禁用默认的 bodyParser
  },
};

export default async function handler(req, res) {
  return tusServer.handle(req, res);
}