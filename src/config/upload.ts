import path from 'path';
import crypto from 'crypto';
import multer, { StorageEngine } from 'multer';
import OnlyText from '@shared/container/providers/StorageProvider/implementations/OnlyText';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
  tmpFolder: string;
  uploadsFolder: string;
  driver: 's3' | 'disk';

  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: {
      pathBucket: string;
    };
    aws: {
      bucket: string;
    };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, 'uploads'),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${OnlyText(file.originalname)}`;

        return callback(null, fileName);
      },
    }),
  },
  config: {
    disk: {},
    aws: {
      bucket: 'automax',
    },
  },
} as IUploadConfig;
