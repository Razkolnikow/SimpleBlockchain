const express = require('express');
const config = require('./config/config');

let app = new express();
require('./config/body-parser')(app);

require('./config/routes')(app);

app.listen(config.port);