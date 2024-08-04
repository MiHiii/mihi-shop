const app = require('./src/app');
const instanceMongodb = require('./src/dbs/init.mongodb'); // Đảm bảo rằng đường dẫn đúng

const PORT = 3055;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on('SIGINT', async () => {
  server.close(async () => {
    console.log('Server is closed');
    await instanceMongodb.close(); // Đóng kết nối MongoDB
    process.exit(0);
  });
});
