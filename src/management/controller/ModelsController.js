import { Model } from '../../domain';

module.exports = () => {
    return {
        getAvailableModels(req, res) {
            Model.find({siteId: req.site._id})
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    res.status(400).json(err);
                    console.error(err);
                });
        },
        createModel(req, res) {
            if (!req.site) {
                res.status(500).send('site not defined');
                return;
            }
            if (req.site.role !== 'OWNER') {
                return res.status(403).send('You are not the owner of this site');
            }
            req.checkBody('name', 'Name is required').notEmpty();
            req.getValidationResult().then(function(result) {
                if (!result.isEmpty()) {
                    res.status(400).send(result.array());
                    return;
                }
                const model = new Model({
                    name: req.body.name,
                    siteId: req.site._id,
                    fields: []
                });
                model.save().then(() => {
                    res.status(200).send(model.toJSON());
                }).catch(err => {
                    console.error(err);
                    res.status(500).send('error occured');
                });
            });
        },
        removeModel(req, res) {
            if (req.site.role !== 'OWNER') {
                return res.status(403).send('You are not the owner of this site');
            }
            if (!req.model) {
                res.status(500).send('model not defined');
                return;
            }
            req.model.remove()
                .then(() => {
                    res.status(204).send();
                })
                .catch(err => {
                    res.status(400).json(err);
                    console.error(err);
                });
        },
        getModel(req, res) {
            if (!req.model) {
                res.status(500).send('model not defined');
                return;
            }
            res.status(200).send(req.model.toJSON());
        },
        updateModel: (req, res) => {
            if (req.site.role !== 'OWNER') {
                return res.status(403).send('You are not the owner of this site');
            }
            req.checkBody('name', 'Name is required').notEmpty();
            req.getValidationResult().then(function(result) {
                const site = req.site;
                /**
                 * @todo some logic will be required to deal with the users attribute:
                 *  - An owner can't remove himself from the list, or change his role
                 */
                site.save()
                    .then(updated => {
                        res.status(200).send(mapUserRole(site.toJSON(), req.user.user_id));
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).send('error occured');
                    });
            });

            const model = req.model;
            const role = getUserRole(site, req.user.user_id);
            if (role !== 'OWNER') {
                return res.status(403).send('you are not the owner', role);
            }
            if (req.body.name) {
                site.name = req.body.name;
            } else {
                console.error('no body name');
            }
            /**
             * @todo some logic will be required to deal with the users attribue:
             *  - An owner can't remove himself from the list, or change his role
             *  - Only owners are allowed to update this list
             */
            site.save().then(updated => {
                res.status(200).send(mapUserRole(site.toJSON(), req.user.user_id));
            })
                .catch(err => {
                    console.error(err);
                    res.status(500).send('error occured');
                });

        },
    }
};