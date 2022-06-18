"use strict";

var _models = require("../models");

var _models2 = _interopRequireDefault(_models);

var _crypto = require("crypto");

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    /**
    * Create unique user code and return the code
    */
    createRandomString: async charLength => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = _crypto2.default.randomBytes(Math.ceil(charLength / 2)).toString("hex");
                result = parseInt(code, 16).toString().slice(0, charLength);
                resolve(result);
            } catch (error) {
                console.log("error========>" + error);
                resolve(error);
            }
        });
    },

    /**
       * Create new location code
    */
    createTypeCode: async () => {
        return new Promise(async (resolve, reject) => {
            try {
                let code = "";
                while (true) {
                    code = await module.exports.createRandomString(4);
                    let findTestType = await _models2.default.TestType.findOne({
                        where: {
                            code: code
                        }
                    });
                    if (findTestType === null) {
                        break;
                    }
                }
                resolve(code);
            } catch (error) {
                console.log("error========>" + error);
                reject(error);
            }
        });
    }

};