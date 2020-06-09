require("dotenv/config");
const express = require("express");
const cors = require("cors");

const routes = require("./routes");

const app = express();

const port = process.env.PORT || 3030;

const corsOptions = {
  exposedHeaders: "X-Total-count",
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(routes);

app.listen(port, () => {
  console.log(`🌎 iEstilus server is listening on port ${port}!`);
});
