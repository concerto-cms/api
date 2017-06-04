import { Site } from '../../domain/site';
export const siteMiddleware = (req, res, next) => {
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
                console.log('site: ', result.name);
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
