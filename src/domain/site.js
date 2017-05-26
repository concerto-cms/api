const mongoose = require('mongoose');

export const siteSchema = new mongoose.Schema({
    id: 'string',
    name: { type: String, required: true },
    users: [{
        userId: { type: String, required: true },
        role: { type: String, required: true },
    }],
});

export const Site = mongoose.model('Site', siteSchema);