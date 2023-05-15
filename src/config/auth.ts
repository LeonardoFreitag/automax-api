export default {
  jwt: {
    secret: process.env.APP_SECRET || 'a4a66e5f30cf9a71262ff86a7a54a189',
    expiresIn: '1d',
    secret_refresh:
      process.env.APP_SECRET_REFRESH || '9e77aa1b811dbcc874a9de06e421ab6b',
    expiresInRefresh: '30d',
    expiresInRefreshDays: 30,
  },
};
