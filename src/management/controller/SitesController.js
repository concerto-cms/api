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
                    res.json(result.map(site => mapUserRole(site, req.user.user_id)));
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
            res.status(200).send(mapUserRole(req.site, req.user.user_id));
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
            const site = req.site;
            const role = getUserRole(req.site, req.user.user_id);
            console.log(req.site, req.user);
            if (role !== 'OWNER') {
                return res.status(403).send('you are not the owner', role);
            }
            if (req.body.name) {
                site.set('name', req.body.name);
            }
            /**
             * @todo some logic will be required to deal with the users attribue:
             *  - An owner can't remove himself from the list, or change his role
             *  - Only owners are allowed to update this list
             */
            site.save().then(() => {
                res.status(200).send(mapUserRole(site.toJSON(), req.user.user_id));
            }).catch(err => {
                console.error(err);
                res.status(500).send('error occured');
            });

        },

        removeSite: (req, res) => {
            req.site.remove()
                .then(() => {
                    res.status(204).send('');
                })
                .catch(err => {
                    res.status(400).json(err);
                    console.error(err);
                });
        }
    }
};
