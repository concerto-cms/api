const mongoose = require('mongoose');

export const modelSchema = new mongoose.Schema({
    id: String,
    name: String,
    siteId: String,
    structure: String,
    isWebpage: Boolean,
    fields: [{
        name: String,
        label: String,
        type: {
            type: String,
        },
        options: {
            type: mongoose.Schema.Types.Mixed,
        }
    }],

});

export const Model = mongoose.model('Model', modelSchema);
