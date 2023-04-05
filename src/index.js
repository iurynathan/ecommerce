const createServer = require('./server');
require('dotenv').config();

const app = createServer();
const PORT = process.env.SERVER_PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server has started on PORT: ${PORT}`);
});
