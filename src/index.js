import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import managementModule from './management/module';
import mongoose from 'mongoose';
import jwt from'express-jwt';

let app = express();
app.server = http.createServer(app);

app.use((req, res, next) => {
    if (req.headers.authorization) {
        return next();
    }
    req.headers.authorization = "bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImVtYWlsIjoibWF0aGlldUB3ZWJiZXJpZy5iZSIsImNsaWVudElEIjoiaGFKTDZiaWk2NFJqVllhTHBXaU9jQk9raE9VbW1hbTkiLCJ1cGRhdGVkX2F0IjoiMjAxNy0wNS0yNVQxOTowOTo1Ny43MDZaIiwibmFtZSI6Im1hdGhpZXVAd2ViYmVyaWcuYmUiLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvZjA0OTcxZWYzMWYwNTk0YWRmOTU4ZDAwYTA3MDYwODY_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZtYS5wbmciLCJ1c2VyX2lkIjoiYXV0aDB8NTkyNzI4NTdlOTNlOTEwODFhMzMxOTM1Iiwibmlja25hbWUiOiJtYXRoaWV1IiwiaWRlbnRpdGllcyI6W3sidXNlcl9pZCI6IjU5MjcyODU3ZTkzZTkxMDgxYTMzMTkzNSIsInByb3ZpZGVyIjoiYXV0aDAiLCJjb25uZWN0aW9uIjoiVXNlcm5hbWUtUGFzc3dvcmQtQXV0aGVudGljYXRpb24iLCJpc1NvY2lhbCI6ZmFsc2V9XSwiY3JlYXRlZF9hdCI6IjIwMTctMDUtMjVUMTg6NTQ6MTUuMTA5WiIsInBlcnNpc3RlbnQiOnt9LCJpc3MiOiJodHRwczovL2NvbmNlcnRvLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1OTI3Mjg1N2U5M2U5MTA4MWEzMzE5MzUiLCJhdWQiOiJoYUpMNmJpaTY0UmpWWWFMcFdpT2NCT2toT1VtbWFtOSIsImV4cCI6MTQ5NjA5OTM5NywiaWF0IjoxNDk1NzM5Mzk3LCJub25jZSI6InVuaG5oS1M1WGJtTWkxbS51OTJyNWF6N2k5bX5SQkh5IiwiYXRfaGFzaCI6IlBiV0kzRkFJWlVsMy1TRlpTNmtQeXcifQ.vuqzKOMc5k21Sg0W-RxHseCPOiDzNowjSoDDKq3Axxw";
    next();
});
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

// API modules
managementModule(app);

// Errors
app.use((req, res, next) => {
    res.status(404).send({
        code: res.statusCode,
        message: 'Not found',
    });
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
});

// Mongo connection
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_DB_URI || 'mongodb://mongo:27017/concerto').then(() => {
    app.server.listen(process.env.PORT || 3000, () => {
        console.log(`Started on port ${app.server.address().port}`);
    });
});

export default app;
