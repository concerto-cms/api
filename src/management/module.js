import swagger from 'swagger-express-router';
import swaggerUi from 'swagger-ui-express';
import SitesController from './controller/SitesController';
module.exports = (app) => {
    const mgmtSpec = require('../spec/management-api/swagger.json');

    // Management API
    app.use('/mgmt/v1/doc', swaggerUi.serve, swaggerUi.setup(mgmtSpec));
    swagger.setUpRoutes({
        sites: SitesController(),
        profile: {},
        blocks: {},
        models: {},
        content: {},
    }, app, mgmtSpec, true);
};
