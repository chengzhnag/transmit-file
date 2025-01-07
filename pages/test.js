import React, { useState } from 'react';
const tus = require('tus-js-client');

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = () => {
    if (!file) {
      alert('请先选择文件');
      return;
    }

    setUploading(true);
    setProgress(0);

    const upload = new tus.Upload(file, {
      endpoint: '/api/upload', // 服务器上传接口
      retryDelays: [0, 1000, 3000, 5000], // 重试延迟
      chunkSize: 3 * 1024 * 1024, // 分片大小（3MB）
      metadata: {
        code: '1234',
        filename: file.name,
        filetype: file.type,
      },
      onError: (error) => {
        console.error('上传失败:', error);
        alert('上传失败，请重试');
        setUploading(false);
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
        setProgress(Number(percentage));
      },
      onSuccess: () => {
        console.log('upload:', upload);
        setUploading(false);
        setUploadedFileUrl(upload.url); // 上传成功后的文件 URL
        alert('文件上传成功！');
      },
    });

    upload.start(); // 开始上传
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>分片上传文件</h1>
      <div>
        <input type="file" onChange={handleFileChange} disabled={uploading} />
      </div>
      <div style={{ marginTop: '10px' }}>
        <button onClick={uploadFile} disabled={!file || uploading}>
          {uploading ? '上传中...' : '开始上传'}
        </button>
      </div>
      {uploading && (
        <div style={{ marginTop: '10px' }}>
          <progress value={progress} max="100" />
          <span style={{ marginLeft: '10px' }}>{progress}%</span>
        </div>
      )}
      {uploadedFileUrl && (
        <div style={{ marginTop: '10px' }}>
          <a href={uploadedFileUrl} download>
            下载文件
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUploader;