
import db from "../models";

module.exports = {
    sequenceNumber: (category_id) => {
        return new Promise(async (resolve, reject) => {
            let t = await db.sequelize.transaction();
            try {
                let test = await db.TestCategory.findOne({
                    where: { id: category_id },
                    lock: t.LOCK.UPDATE,
                    transaction: t
                });
                let sequenceNumber = parseInt(test.sequence_number) + 1;
                await db.TestCategory.update({
                    sequence_number: sequenceNumber
                }, {
                    where: { id: category_id },
                    transaction: t
                });
                await t.commit();
                resolve(sequenceNumber)
            } catch (error) {
                await t.rollback();
                console.log("error=========>" + error)
                resolve(null)
            }
        });
    }
}

