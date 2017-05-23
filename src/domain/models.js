import * as schemas from './schemas';

const mongoose = require('mongoose');
const model = mongoose.model;

module.exports = {
    Site: model(schemas.site)
};

