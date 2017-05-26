const mongoose = require('mongoose');

export const blockSchema = new mongoose.Schema({
    id: 'string',
    name: 'string',
    template: 'string',
    fields: [{
        name: 'string',
        label: 'string',
        type: 'string',
    }],
});

export const Block = mongoose.model('Block', blockSchema);