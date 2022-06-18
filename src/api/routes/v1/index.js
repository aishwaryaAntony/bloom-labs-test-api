var express = require('express');
var router = express.Router();
const cp = require('child_process');
const path = require("path");
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../../config/config.js')[env];
import { loginSalesforce, checkIfSessionExist } from "../../../helpers/salesforceUtils";


/* GET home page. */
router.get('/', async (req, res, next) => {
	res.json({
		payload: null
	})
});
router.get('/internal/healthcheck', async (req, res, next) => {
	res.status(200).json({
		status: 'success',
	});
});

router.post('/internal/run-script', async (req, res, next) => {
	try {
		const { filename, secret_key } = req.body;
		if (secret_key === "BL00M") {
			if (filename !== undefined && filename !== null && filename !== "") {
				let filepath = path.join(__dirname, `../../../../dbscripts/${filename}`);
				cp.exec(`sh ${filepath}`, function (err, stdout, stderr) {
					// handle err, stdout, stderr
					let message = null;
					if (stderr) {
						console.error(`error==> ${stderr}`);
						message = stderr;
					}
					console.log(`success===> ${stdout}`);
					message = stdout;
					res.status(200).json({
						status: 'success',
						message: message
					});
				});
			} else {
				console.log("Error while running script file ==> " + error);
				res.status(500).json({
					status: "failed",
					payload: {},
					message: "Error while running script file",
				});
			}
		} else {

			console.log("key error");
			res.status(500).json({
				status: "failed",
				payload: {},
				message: "Error while running script file",
			});
		}
	} catch (error) {
		console.log("Error while running script file ==> " + error);
		res.status(500).json({
			status: "failed",
			payload: {},
			message: "Error while running script file",
		});
	}
});

router.get('/internal/db-check', async (req, res, next) => {
	let sequelize = new Sequelize(config.database, config.username, config.password, config);
	try {
		await sequelize.authenticate()
		console.log('Connection has been established successfully.');
		res.status(200).json({
			status: 'success'
		});
	} catch (err) {
		console.error('Unable to connect to the database:', err)
		res.status(500).json({
			status: 'failed'
		});
	}
});

router.get('/login-salesforce', async (req, res, next)=> {
	try {
		let login = await loginSalesforce();
		res.status(200).json({
			status: 'success',
			payload: login
		});
	} catch (error) {
		console.error('Unable to connect to the salesforce:', err)
		res.status(500).json({
			status: 'failed'
		});
	}
});

router.get('/test-salesforce', async (req, res, next)=> {
	try {
		let isLoggedIn = await checkIfSessionExist();
		res.status(200).json({
			status: 'success',
			payload: isLoggedIn
		});
	} catch (error) {
		console.error('Unable to retain sesssion:', err)
		res.status(500).json({
			status: 'failed'
		});
	}
});


module.exports = router;