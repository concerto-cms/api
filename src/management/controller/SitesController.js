module.exports = () => {
    return {
        getAvailableSites(req, res) {
            res.status(200).send("Hello, world!");
        },
/*
        getSite(req, res) {
            res.status(500).send('Something is not right');
        }
*/
    }
};
