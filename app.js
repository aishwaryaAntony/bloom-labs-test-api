var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cluster = require('cluster');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
var cors = require('cors');
let cron = require('node-cron');
let sftpUtils = require('./src/helpers/sftpUtils')

let paymentServices = require('./src/helpers/stripeServices');

var indexRouter = require('./src/api/routes/v1/index');
var locationRouter = require('./src/api/routes/v1/location');
var locationTestTypeRouter = require('./src/api/routes/v1/locationTestType');
var testResultRouter = require('./src/api/routes/v1/testResult');
var testTypeRouter = require('./src/api/routes/v1/testType');
var paymentRouter = require('./src/api/routes/v1/payment');
var testSubTypeRouter = require('./src/api/routes/v1/testSubType');
var uploadTestResultRouter = require('./src/api/routes/v1/uploadTestResult');
var physicianRouter = require('./src/api/routes/v1/physician');
var testValueTypeRouter = require('./src/api/routes/v1/testValueType');
var testValueEnumRouter = require('./src/api/routes/v1/testValueEnum');
var testUploadRouter = require('./src/api/routes/v1/testUpload');
var searchResultRouter = require('./src/api/routes/v1/searchResult');
var testCategoryRouter = require('./src/api/routes/v1/testCategory');
var testGroupRouter = require('./src/api/routes/v1/testGroup');

var app = express();

const options = {
	swaggerDefinition: {
		// openapi: '3.0.1',
		info: {
			title: 'Test Service API',
			version: '1.0.0',
			description: 'Test Service API with Swagger doc',
		},
		schemes: ['http'],
		host: 'localhost:4001',
		// components: {
		// 	securitySchemes: {
		// 		bearerAuth: {
		// 			type: 'http',
		// 			scheme: 'bearer',
		// 			bearerFormat: 'JWT',
		// 		}
		// 	}
		// },
	},
	apis: ['./src/models/*.js', './src/api/routes/v1/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

cron.schedule('*/10 * * * *', () => {
    if (cluster.isMaster) {
        console.log(`Running a task every 10 minutes -> ${new Date()}`);
        paymentServices.updateCancelledPayments();
		sftpUtils.processFilesFromSFTP();
    }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/', indexRouter);
app.use('/location', locationRouter);
app.use('/location-test-type', locationTestTypeRouter);
app.use('/test-result', testResultRouter);
app.use('/test-type', testTypeRouter);
app.use('/payment', paymentRouter);
app.use('/test-sub-type', testSubTypeRouter);
app.use('/upload-test-result', uploadTestResultRouter);
app.use('/physician', physicianRouter);
app.use('/test-value-type', testValueTypeRouter);
app.use('/test-value-enum', testValueEnumRouter);
app.use('/test-upload', testUploadRouter);
app.use('/search-result', searchResultRouter);
app.use('/test-category', testCategoryRouter);
app.use('/test-group', testGroupRouter);

module.exports = app;
