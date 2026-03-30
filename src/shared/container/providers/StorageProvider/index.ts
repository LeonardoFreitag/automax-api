import { container } from 'tsyringe';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider';
import S3StorageProvider from '@shared/container/providers/StorageProvider/implementations/S3StorageProvider';
import DOStorageProvider from '@shared/container/providers/StorageProvider/implementations/DOStorageProvider';

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
  do: DOStorageProvider,
};

type StorageDriver = keyof typeof providers;

const driver = (process.env.STORAGE_DRIVER as StorageDriver) || 'disk';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[driver],
);
