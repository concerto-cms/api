const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema(Object.assign({
    id: 'string',
}), { strict: false });


export const Content = mongoose.model('Content', contentSchema);