require("dotenv/config");
const express = require("express");

const routes = require("./routes");

const app = express();

const port = process.env.PORT || 3030;

app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`🌎 iEstilus server is listening on port ${port}!`);
});
