const mongoose = require('mongoose');

export const modelSchema = new mongoose.Schema({
    id: String,
    name: String,
    siteId: String,
    fields: [{
        name: String,
        label: String,
        type: String,
    }],

});

export const Model = mongoose.model('Model', modelSchema);