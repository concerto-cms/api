import { Model } from '../../domain';
export const modelMiddleware = (req, res, next) => {
    if (!req.params || !req.params.modelID) {
        console.log('model: no modelID', req.params);
        return next();
    }
    return Model.findOne({_id: req.params.modelID}).then((result) => {
        if (!result) {
            res.status(404).send({message: "Model not found"});
            return next();
        }
        req.model = result;
        console.log('model: ', result.name);
        return next();
    })
        .catch((err) => {
            console.error(err);
            res.status(400).send(err);
            return next();
        });
};
