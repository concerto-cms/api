import { Site } from '../../domain/site';
const getUserRole = (site, userId) => {
    for (let user of site.users) {
        if (user.userId === userId) {
            return user.role;
        }
    }
    return null;
};
const mapUserRole = (site, userId) => {
    site.role = getUserRole(site, userId);
    return site;
};

module.exports = () => {
    return {
        getAvailableSites: (req, res) => {
            Site.find({users:{$elemMatch:{userId: req.user.user_id}}})
                .then(result => {
                    result = result.map(site => mapUserRole(site.toJSON(), req.user.user_id));
                    res.json(result);
                })
                .catch(err => {
                    res.status(400).json(err);
                    console.error(err);
                });
        },
        getSite: (req, res) => {
            if (!req.site) {
                res.status(500).send('site not defined');
                return;
            }
            res.status(200).send(mapUserRole(req.site.toJSON(), req.user.user_id));
        },

        /**
         * @param req
         * @param res
         */
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

        /**
         * @param req
         * @param res
         */
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
        }
    }
};
