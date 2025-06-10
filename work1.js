const express = require('express');
const app = express();

app.use(express.json());

const userRouter = require('./routes/user');
const postRouter = require('./routes/post');

// URL 경로에 따라 라우터 분리
app.use('/users', userRouter);
app.use('/posts', postRouter);


// async function testDbConnection() {
//   try {
//     await db.sequelize.authenticate();
//     console.log('데이터베이스 연결 성공!');
//   } catch (error) {
//     console.error('데이터베이스 연결 실패:', error);
//   }
// }

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`서버가 열림 http://localhost:${PORT}`);
})