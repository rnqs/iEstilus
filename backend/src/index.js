const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes');

const app = express();

const port = 3030;

mongoose.connect('mongodb+srv://admin:Zg8jTWceopGuQAdR@cluster0-mju2r.gcp.mongodb.net/TCC?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(express.json());

app.use(routes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
})