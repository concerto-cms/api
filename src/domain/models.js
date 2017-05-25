import * as schemas from './schemas';

const mongoose = require('mongoose');
const model = mongoose.model;

module.exports = {
    Site: model(schemas.site),
    Block: model(schemas.block),
    Model: model(schemas.model),
    Content: model(schemas.content),
};

