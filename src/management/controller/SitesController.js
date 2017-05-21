module.exports = () => {
    return {
        getAvailableSites(req, res) {
            res.status(200).send("Hello, world!");
        },

        getSite(req, res) {
            throw new Error('Something is not right');
        }
    }
};
