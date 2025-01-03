import {Server, Upload} from '@tus/server'
import {FileStore} from '@tus/file-store'
import path from 'path';
import fs from 'fs';

const tusServer = new Server({
  path: '/api/upload', // 上传接口路径
  datastore: new FileStore({
    directory: path.join(process.cwd(), 'uploads'), // 文件存储目录
  }),
});


export const config = {
  api: {
    bodyParser: false, // 禁用默认的 bodyParser
  },
};

export default async function handler(req, res) {
  return tusServer.handle(req, res);
}