const mongoose = require('mongoose');

export const siteSchema = new mongoose.Schema({
    id: 'string',
    name: 'string',
    users: [{
        userId: 'string',
        role: 'string',
    }],
});

export const Site = mongoose.model('Site', siteSchema);