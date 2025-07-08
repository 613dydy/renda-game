const express = require('express');
const fs = require('fs');
const app = express();

// ルートにアクセスが来たらログを記録
app.get('/', (req, res) => {
  const log = {
    ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'],
    time: new Date().toISOString(),
  };

  // logs.txt に記録
  fs.appendFileSync('logs.txt', JSON.stringify(log) + '\n');

  res.send('アクセスが記録されました。');
});

// Renderで必要なポートの設定
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
