const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(Object.assign({
    id: String,
    modelId: String,
    siteId: String,
    name: String,
    lastModified: {type: Date, default: Date.now},
    parentId: String,
    webpage: {
        title: String,
        meta: {
            description: String,
        },
        url: { type: String }
    },
    data: [{
        key: String,
        value: mongoose.Schema.Types.Mixed,
    }],
}));


export const Content = mongoose.model('Content', contentSchema);
