import app from './app.js';

const port = process.env.PORT || 8080;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`EPA Calculator API running on http://localhost:${port}`);
});
