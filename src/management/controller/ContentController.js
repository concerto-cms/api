import { Content, Model } from '../../domain';

module.exports = () => {
    return {
        getContent: (req, res) => {
            if (!req.site) {
                res.status(500).send('site not defined');
                return;
            }
            const conditions = {
                siteId: req.site._id,
            };
            if (req.model) {
                conditions.modelId = req.model._id;
            }
            Content.find(conditions)
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    res.status(400).json(err);
                    console.error(err);
                });
        },
        getContentItem: (req, res) => {
            if (!req.content) {
                res.status(500).send('content not defined');
                return;
            }
            res.status(200).send(req.content.toJSON());
        },

        createItem: (req, res) => {
            req.checkBody('name', 'Name is required').notEmpty();
            req.checkBody('modelId', 'Model is required').notEmpty();
            if (req.body.modelId) {
                Model.findById(req.body.modelId).then(model => {
                    console.log('Model: ', model.name);
                    console.log('Webpage: ', model.isWebpage);
                    if (model.isWebpage) {
                        req.checkBody(['webpage', 'url'], 'Url is required').notEmpty();
                        req.checkBody(['webpage', 'title'], 'Title is required').notEmpty();
                        req.checkBody(['webpage', 'meta', 'description'], 'Title is required').notEmpty();
                    }
                    req.getValidationResult().then(function(result) {
                        if (!result.isEmpty()) {
                            res.status(400).send(result.array());
                            return;
                        }
                        const content = new Content({
                            modelId: model._id,
                            siteId: req.site._id,
                            name: req.body.name,
                            webpage: model.isWebpage ? req.body.webpage : null,
                        });
                        content.save().then(() => {
                            res.status(200).send(content.toJSON());
                        }).catch(err => {
                            console.error(err);
                            res.status(500).send('error occured');
                        });
                    });

                })
            } else {
                res.status(400).send(['Model is required']);
                return;
            }
        },

        removeItem: (req, res) => {
            req.content.remove()
                .then(() => {
                    res.status(204).send();
                })
                .catch(err => {
                    res.status(400).json(err);
                    console.error(err);
                });

        }


        /*
                createSite: (req, res) => {
                    req.checkBody('name', 'Name is required').notEmpty();
                    req.getValidationResult().then(function(result) {
                        if (!result.isEmpty()) {
                            res.status(400).send(result.array());
                            return;
                        }
                        const site = new Site({
                            name: req.body.name,
                            users: [{userId: req.user.user_id, role: 'OWNER'}]
                        });
                        site.save().then(() => {
                            res.status(200).send(mapUserRole(site.toJSON(), req.user.user_id));
                        }).catch(err => {
                            console.error(err);
                            res.status(500).send('error occured');
                        });
                    });
                },

                /!**
                 * @param req
                 * @param res
                 *!/
                updateSite: (req, res) => {
                    if (req.site.role !== 'OWNER') {
                        return res.status(403).send('You are not the owner of this site');
                    }
                    req.checkBody('name', 'Name is required').notEmpty();
                    req.getValidationResult().then(function(result) {
                        if (!result.isEmpty()) {
                            res.status(400).send(result.array());
                            return;
                        }
                        const site = req.site;
                        site.set('name', req.body.name);

                        /!**
                         * @todo some logic will be required to deal with the users attribute:
                         *  - An owner can't remove himself from the list, or change his role
                         *!/
                        site.save()
                            .then(updated => {
                                res.status(200).send(mapUserRole(site.toJSON(), req.user.user_id));
                            })
                            .catch(err => {
                                console.error(err);
                                res.status(500).send('error occured');
                            });
                    });
                },

                removeSite: (req, res) => {
                    if (req.site.role !== 'OWNER') {
                        return res.status(403).send('You are not the owner of this site');
                    }
                    req.site.remove()
                        .then(() => {
                            res.status(204).send();
                        })
                        .catch(err => {
                            res.status(400).json(err);
                            console.error(err);
                        });
                }*/
    }
};
