import { Site, Model, Content } from '../../domain';

export const handleSite = (req, res) => {
    return new Promise((resolve) => {
        return Site.findOne({
            _id: req.params.siteID,
        }).then((result) => {
            if (!result) {
                res.status(404).send({message: "Site not found"});
                return resolve();
            }
            for (let siteUser of result.users) {
                if (siteUser.userId === req.user.user_id) {
                    req.site = result;
                    req.site.role = siteUser.role;
                    return resolve(result);
                }
            }
            res.status(403).send({message: "Forbidden"});
            return resolve();
        })
            .catch((err) => {
                console.error(err);
                res.status(400).send(err);
                return resolve();
            });

    })
};
export const handleModel = (req, res) => {
    return new Promise((resolve) => {
        return Model.findOne({
            _id: req.params.modelID,
            siteId: req.params.siteID,
        }).then((result) => {
            if (!result) {
                res.status(404).send({message: "Model not found"});
                return resolve();
            }
            req.model = result;
            return resolve(result);
        })
            .catch((err) => {
                console.error(err);
                res.status(400).send(err);
                return resolve();
            });

    })
};
export const handleContent = (req, res) => {
    return new Promise((resolve) => {
        return Content.findOne({
            _id: req.params.contentID,
            siteId: req.params.siteID,
        }).then((result) => {
            if (!result) {
                res.status(404).send({message: "Content not found"});
                return resolve();
            }
            req.model = result;
            return resolve(result);
        })
            .catch((err) => {
                console.error(err);
                res.status(400).send(err);
                return resolve();
            });

    })
};

export const middleware = (req, res, next) => {
    const p = [];
    if (req.params.siteID && !req.site) {
        p.push(handleSite(req, res));
        if (req.params.modelID  && !req.model) {
            p.push(handleModel(req, res));
        }
        if (req.params.contentID && !req.content) {
            p.push(handleContent(req, res));
        }
    }
    if (p.length === 0) {
        return next();
    }
    Promise.all(p).then(() => {
        if (req.site) {
            console.log('Site: ', req.site.name);
        }
        if (req.model) {
            console.log('Model: ', req.model.name);
        }
        if (req.content) {
            console.log('Content: ', req.content.name);
        }
        next();
    })
};
