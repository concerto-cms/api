import { Site } from '../../domain/site';
module.exports = () => {
    return {
        getAvailableSites: (req, res) => {
            Site.find({users:{$elemMatch:{userId: req.user.user_id}}})
                .then(result => {
                    res.json(result);
                })
                .catch(err => {
                    res.status(400).json(err);
                    console.error(err);
                });
        },
        getSite: (req, res) => {
            res.status(200).send(req.site);
        },

        /**
         * @todo implement dynamic parameters instead of mock data
         * @param req
         * @param res
         */
        createSite: (req, res) => {
            const site = new Site({
                name: 'test zimmo',
                users: [{userId: req.user.user_id, role: 'OWNER'}]
            });
            site.save();
            res.status(200).send(site.toJSON());
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
