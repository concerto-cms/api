module.exports = () => {
    return {
        getProfile: (req, res) => {
            res.status(200).send({
                username: req.user.name,
                name: req.user.nickname,
                email: req.user.email,
                picture: req.user.picture,
                id: req.user.user_id,
            });
        }
    }
};
