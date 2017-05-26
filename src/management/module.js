import swagger from 'swagger-express-router';
import swaggerUi from 'swagger-ui-express';
import SitesController from './controller/SitesController';
import ProfileController from './controller/ProfileController';
import { Site } from '../domain/site';
const getSiteMiddleware = (req, res, next) => {
    if (!req.params || !req.params.siteID) {
        return next();
    }
    return Site.findOne({_id: req.params.siteID}).then((result) => {
        if (!result) {
            res.status(404).send({message: "Site not found"});
            return next();
        }
        for (let siteUser of result.users) {
            if (siteUser.userId === req.user.user_id) {
                req.site = result;
                return next();
            }
        }
        res.status(403).send({message: "Forbidden"});
        return next();
    })
    .catch((err) => {
        console.error(err);
        res.status(400).send(err);
        return next();
    });
};

module.exports = (app) => {
    const mgmtSpec = require('../spec/management-api/swagger.json');
    // Management API
    app.use('/mgmt/v1/sites/:siteID', getSiteMiddleware);
    app.use('/mgmt/v1/doc', swaggerUi.serve, swaggerUi.setup(mgmtSpec));
    swagger.setUpRoutes({
        sites: SitesController(),
        profile: ProfileController(),
        blocks: {},
        models: {},
        content: {},
    }, app, mgmtSpec, true);
};
