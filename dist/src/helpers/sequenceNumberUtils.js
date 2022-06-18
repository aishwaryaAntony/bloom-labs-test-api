"use strict";

var _models = require("../models");

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
    sequenceNumber: category_id => {
        return new Promise(async (resolve, reject) => {
            let t = await _models2.default.sequelize.transaction();
            try {
                let test = await _models2.default.TestCategory.findOne({
                    where: { id: category_id },
                    lock: t.LOCK.UPDATE,
                    transaction: t
                });
                let sequenceNumber = parseInt(test.sequence_number) + 1;
                await _models2.default.TestCategory.update({
                    sequence_number: sequenceNumber
                }, {
                    where: { id: category_id },
                    transaction: t
                });
                await t.commit();
                resolve(sequenceNumber);
            } catch (error) {
                await t.rollback();
                console.log("error=========>" + error);
                resolve(null);
            }
        });
    }
};