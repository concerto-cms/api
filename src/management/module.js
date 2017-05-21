import swagger from 'swagger-express-router';
import swaggerUi from 'swagger-ui-express';
import SitesController from './controller/SitesController';
module.exports = (app) => {
    const mgmtSpec = require('../../spec/management-api/swagger.json');

    // Management API
    app.get('/mgmt/v1', swaggerUi.serve, swaggerUi.setup(mgmtSpec));
    swagger.setUpRoutes({
        sites: SitesController(),
        profile: {

        },
    }, app, mgmtSpec, true);
};
