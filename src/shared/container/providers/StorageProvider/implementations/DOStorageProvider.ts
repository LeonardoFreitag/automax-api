import fs from 'fs';
import path from 'path';
import mime from 'mime';
import aws, { S3 } from 'aws-sdk';
import uploadConfig from '@config/upload';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

class DOStorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      endpoint: uploadConfig.config.do.endpoint,
      s3ForcePathStyle: false,
      s3BucketEndpoint: true,
      credentials: new aws.Credentials({
        accessKeyId: process.env.DO_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.DO_SPACES_SECRET || '',
      }),
      region: 'nyc3',
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    let contentType = mime.getType(originalPath);

    if (!contentType) {
      contentType = 'application/xml';
    }

    const fileContent = await fs.promises.readFile(originalPath);

    await this.client
      .putObject({
        Bucket: process.env.DO_SPACES_BUCKET || '',
        Key: file,
        ACL: 'public-read',
        Body: fileContent,
        ContentType: contentType,
        ContentDisposition: `inline; filename=${file}`,
      })
      .promise();

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: process.env.DO_SPACES_BUCKET || '',
        Key: file,
      })
      .promise();
  }
}

export default DOStorageProvider;
