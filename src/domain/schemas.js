const mongoose = require('mongoose');
const Schema    = mongoose.Schema;

const site = new Schema(Object.assign({
    id: String,
    name: String,
    users: [{
        userId: String,
        role: String,
    }],
}));

const block = new Schema(Object.assign({
    id: String,
    name: String,
    template: String,
    fields: [{
        name: String,
        label: String,
        type: String,
    }],
}));

const model = new Schema(Object.assign({
    id: String,
    name: String,
    fields: [{
        name: String,
        label: String,
        type: String,
    }],
}));

const content = new Schema(Object.assign({
    id: String,
}), { strict: false });


module.exports = { site, block, model, content };