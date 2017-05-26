import { Site } from '../../domain/site';
const mapUserRole = (site, userId) => {
    for (let user in site.users) {
        if (user.userId === userId) {
            site.role = user.role;
            break;
        }
    }
    site.role = null;
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
