require('dotenv').config(); 
module.exports = {
    "development": {
        "username": process.env.DB_USER,
        "password": process.env.DB_PW,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "dialect": process.env.DB_DIALECT,
        "logging": false,
        "pool": {
            "max": 5,
            "min": 0,
            "idle": 20000,
            "acquire": 60000
        }
        // "dialectOptions": {
        //     "ssl": {
        //         "require": true,
        //         "rejectUnauthorized": false
        //     }
        // }
    },
    "test": {
        "username": process.env.DB_USER,
        "password": process.env.DB_PW,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "dialect": process.env.DB_DIALECT,
        "logging": false,
        "pool": {
            "max": 5,
            "min": 0,
            "idle": 20000,
            "acquire": 60000
        }
        // "dialectOptions": {
        //     "ssl": {
        //         "require": true,
        //         "rejectUnauthorized": false
        //     }
        // }
    },
    "production": {
        "username": process.env.DB_USER,
        "password": process.env.DB_PW,
        "database": process.env.DB_NAME,
        "host": process.env.DB_HOST,
        "dialect": process.env.DB_DIALECT,
        "logging": false,
        "pool": {
            "max": 5,
            "min": 0,
            "idle": 20000,
            "acquire": 60000
        }
        // "dialectOptions": {
        //     "ssl": {
        //         "require": true,
        //         "rejectUnauthorized": false
        //     }
        // }
    }
};