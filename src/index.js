import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import managementModule from './management/module';
import mongoose from 'mongoose';
import jwt from'express-jwt';
import expressValidator from 'express-validator';

let app = express();
app.server = http.createServer(app);

// authentication
app.use(jwt({
    secret: process.env.AUTH0_SECRET
}));

// logger
app.use(morgan('dev'));
/*
morgan.token('remote-user', (req, res) => req.user ? req.user.name : '_GUEST');
app.use(morgan(':remote-user :method :url :status :response-time ms - :res[content-length]'));
*/

// utilities
app.use(cors());
app.use(bodyParser.json({
	limit : '1000kb'
}));
app.use(expressValidator());

// API modules
managementModule(app);

// Errors
app.use((req, res, next) => {
    res.status(404).send({
        code: res.statusCode,
        message: 'Not found',
    });
    next();
});

app.use(function (err, req, res, next) {
    if (err.name !== 'UnauthorizedError') {
        return next();
    }
    console.error(err);
    res.status(401).send(err);
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send({
        code: res.statusCode,
		message: err.message,
	});
    next();
});

// Mongo connection
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_DB_URI || 'mongodb://mongo:27017/concerto').then(() => {
    app.server.listen(process.env.PORT || 3000, () => {
        console.log(`Started on port ${app.server.address().port}`);
    });
});

export default app;
