const app = require('./app');

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`HerdSourcing backend running at http://localhost:${PORT}`);
});