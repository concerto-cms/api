import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import managementModule from './management/module';
let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors());

app.use(bodyParser.json({
	limit : '1000kb'
}));

managementModule(app);

app.use((req, res, next) => {
    res.status(404).send({
        code: res.statusCode,
        message: 'Not found',
    });
});

app.use((err, req, res, next) => {
    res.status(500).send({
    	code: res.statusCode,
		message: err.message,
	});
});

app.server.listen(process.env.PORT || 3000, () => {
	console.log(`Started on port ${app.server.address().port}`);
});

export default app;
