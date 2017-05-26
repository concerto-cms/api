const mongoose = require('mongoose');

export const modelSchema = new mongoose.Schema({
    id: 'string',
    name: 'string',
    fields: [{
        name: 'string',
        label: 'string',
        type: 'string',
    }],

});

export const Model = mongoose.model('Model', modelSchema);