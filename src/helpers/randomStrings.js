import db from "../models";
import cryptoModule from "crypto";

module.exports = {
  /**
  * Create unique user code and return the code
  */
   createRandomString: async (charLength) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = cryptoModule.randomBytes(Math.ceil(charLength / 2)).toString("hex");
            result = parseInt(code, 16).toString().slice(0, charLength);
            resolve(result)
        } catch (error) {
            console.log("error========>" + error)
            resolve(error);
        }
    })
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
                let findTestType = await db.TestType.findOne({
                    where: {
                        code: code
                    }
                });
                if (findTestType === null) {
                    break;
                }
            }
            resolve(code)
        } catch (error) {
            console.log("error========>" + error)
            reject(error);
        }
    })
}

}