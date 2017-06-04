import swagger from 'swagger-express-router';
import swaggerUi from 'swagger-ui-express';
import SitesController from './controller/SitesController';
import ProfileController from './controller/ProfileController';
import ModelsController from './controller/ModelsController';
import ContentController from './controller/ContentController';
import { middleware } from './middleware';

module.exports = (app) => {
    const mgmtSpec = require('../spec/management-api/swagger.json');
    // Management API
    app.use('/mgmt/v1/sites/:siteID/models/:modelID', middleware);
    app.use('/mgmt/v1/sites/:siteID/content/:contentID', middleware);
    app.use('/mgmt/v1/sites/:siteID', middleware);
    app.use('/mgmt/v1/doc', swaggerUi.serve, swaggerUi.setup(mgmtSpec));
    swagger.setUpRoutes({
        profile: ProfileController(),
        sites: SitesController(),
        models: ModelsController(),
        content: ContentController(),
        blocks: {},
    }, app, mgmtSpec, true);
};
