const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(Object.assign({
    id: String,
    modelId: String,
    siteId: String,
}), { strict: false });


export const Content = mongoose.model('Content', contentSchema);