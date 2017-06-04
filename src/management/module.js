import swagger from 'swagger-express-router';
import swaggerUi from 'swagger-ui-express';
import SitesController from './controller/SitesController';
import ProfileController from './controller/ProfileController';
import ModelsController from './controller/ModelsController';
import { siteMiddleware, modelMiddleware } from './middleware';

module.exports = (app) => {
    const mgmtSpec = require('../spec/management-api/swagger.json');
    // Management API
    app.use('/mgmt/v1/sites/:siteID', siteMiddleware);
    app.use('/mgmt/v1/sites/:siteID/models/:modelID', modelMiddleware);
    app.use('/mgmt/v1/doc', swaggerUi.serve, swaggerUi.setup(mgmtSpec));
    swagger.setUpRoutes({
        sites: SitesController(),
        profile: ProfileController(),
        blocks: {},
        models: ModelsController(),
        content: {},
    }, app, mgmtSpec, true);
};
