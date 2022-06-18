import { SALESFORCE_LOGIN_URL, SALESFORCE_CLIENT_SECRET, SALESFORCE_CLIENT_ID, SALESFORCE_USER_EMAIL, SALESFORCE_SECURITY_PASSWORD, ACCOUNT_API_DOMAIN } from "./constants";
import _ from "underscore";
import moment from "moment";

let jsforce = require('jsforce');

let conn = new jsforce.Connection({
    loginUrl: SALESFORCE_LOGIN_URL,
    clientId: SALESFORCE_CLIENT_ID,
    clientSecret: SALESFORCE_CLIENT_SECRET
});


module.exports = {

    CONNECTION: conn,

    loginSalesforce: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let auth = await conn.login(SALESFORCE_USER_EMAIL, SALESFORCE_SECURITY_PASSWORD);
                resolve(auth);
            } catch (error) {
                console.log("Error at loginSalesforce =>" + error)
                resolve(null);
            }
        })
    },

    checkIfSessionExist: ()=> {
        return new Promise(async (resolve, reject) => {
            try {
                const identity = await conn.identity();
                resolve(identity);
            } catch (error) {
                console.log("Error at checkIfSessionExist =>" + error)
                resolve(null);
            }
        });
    },

    findContactUsingMobileNumberAndBirtDate: (phone_number, birthDate) => {
        return new Promise(async (resolve, reject) => {
            try {
                let query = await conn.query("SELECT Id, Birthdate, Name, Sex__c, Phone_number_text__c, MobilePhone, Email, MailingAddress, Zip_Code__c, HealthCloudGA__Age__c, Passport_Number__c, SSN__c, Driver_s_License_or_Passport_Number__c, Ethnicity__c, Race__c, QR_Code__c FROM Contact WHERE Phone_number_text__c LIKE '%" + phone_number + "' AND Birthdate = "+birthDate+" ");
                resolve(query);
            } catch (error) {
                console.log("Error at findContactUsingMobileNumberAndBirtDate =>" + error)
                resolve(null);
            }
        });
    },

    findContactUsingEmailAndBirtDate: (email, birthDate) => {
        return new Promise(async (resolve, reject) => {
            try {
                // let Birthdate = new Date(birthDate);
                let query = await conn.query("SELECT Id, Birthdate, Name, Sex__c, Phone_number_text__c, MobilePhone, Email, MailingAddress, Zip_Code__c, HealthCloudGA__Age__c, Passport_Number__c, SSN__c, Driver_s_License_or_Passport_Number__c, Ethnicity__c, Race__c, QR_Code__c FROM Contact WHERE Email LIKE '%" + email + "' AND Birthdate = "+birthDate+" ");
                resolve(query);
            } catch (error) {
                console.log("Error at findContactUsingEmailAndBirtDate =>" + error)
                resolve(null);
            }
        });
    },

    createAccountContact: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let accountObj = null;                
                let signature = null;
                let userImage = null;
                let insuranceFrontImage = null;
                let insuranceBackImage = null;
                /*
                if(data.signatureImage !== undefined && data.signatureImage !== null && data.signatureImage !== "" ){
                    let key = await uploadBase64Image(data.signatureImage, S3_USER_BUCKET_NAME);
                    let findBucket = S3_BUCKETS.find(x => x.bucketName === S3_USER_BUCKET_NAME);
                    if(findBucket !== undefined){
                        signature = `${ACCOUNT_API_DOMAIN_URL}image/${findBucket.code}/${key}`
                    }
                }

                if(data.id_image !== undefined && data.id_image !== null && data.id_image !== "" ){
                    let key = await uploadBase64Image(data.id_image, S3_USER_BUCKET_NAME);
                    let findBucket = S3_BUCKETS.find(x => x.bucketName === S3_USER_BUCKET_NAME);
                    if(findBucket !== undefined){
                        userImage = `${ACCOUNT_API_DOMAIN_URL}image/${findBucket.code}/${key}`
                    }
                }

                if(data.front_insurance_card_image !== undefined && data.front_insurance_card_image !== null && data.front_insurance_card_image !== ""){
                    let key = await uploadBase64Image(data.front_insurance_card_image, S3_INSURANCE_BUCKET_NAME);
                    let findBucket = S3_BUCKETS.find(x => x.bucketName === S3_INSURANCE_BUCKET_NAME);
                    if(findBucket !== undefined){
                        insuranceFrontImage = `${ACCOUNT_API_DOMAIN_URL}image/${findBucket.code}/${key}`
                    }
                }
                
                if(data.back_insurance_card_image !== undefined && data.back_insurance_card_image !== null && data.back_insurance_card_image !== ""){
                    let key = await uploadBase64Image(data.back_insurance_card_image, S3_INSURANCE_BUCKET_NAME);
                    let findBucket = S3_BUCKETS.find(x => x.bucketName === S3_INSURANCE_BUCKET_NAME);
                    if(findBucket !== undefined){
                        insuranceBackImage = `${ACCOUNT_API_DOMAIN_URL}image/${findBucket.code}/${key}`
                    }
                }
                */

                let contactObj = null;
                let carrierAddress = `${data.insurance_street_address} ${data.insurance_street_address_line2}, ${data.insurance_city}, ${data.insurance_state}, ${data.insurance_zip_code} `;
                contactObj = await conn.sobject("Contact").insert(
                    {
                        Birthdate: data.birth_date,
                        MobilePhone: data.phone_number,
                        FirstName: `${data.first_name}`,
                        LastName: `${data.last_name}`,
                        Email: data.email,
                        Ethnicity__c: data.ethnicity,
                        Race__c: data.race,
                        Sex__c: data.gender,
                        Zip_Code__c: data.zipcode,
                        Health_Insurance_Carrier_Name__c: data.insurance_provider,
                        Health_Insurance_Carrier_Phone_Number__c: data.provider_phone_number,
                        Health_Insurance_Policy_Group_Number__c: data.policy_group_number,
                        Health_Insurance_Carrier_Address__c: carrierAddress,
                        Image_From_Amazon__c: true,
                        Signature_URL__c: signature,
                        Uploadimageurl__c : userImage,
                        Insurancecardimageurl__c: insuranceFrontImage,
                        Health_Insurance_Policy_Number_Member_ID__c: data.health_insurance_policy_member_id !== null && data.health_insurance_policy_member_id !== "" ? data.health_insurance_policy_member_id.slice(0,18) : null,
                        MailingStreet: data.address_line1,
                        MailingCity: data.city,
                        MailingState: data.state,
                        MailingPostalCode: data.zipcode,
                        SSN__c: data.ssn_number !== null ? data.ssn_number.slice(0,9) : null,
                        Driver_s_License_Number__c: data.license_number !== null ? data.license_number.slice(0,50) : null,
                        Passport_Number__c: data.passport_number !== null ? data.passport_number.slice(0, 35) : null
                    }, function (err, ret) {
                        if (err || !ret.success) { return console.error(err, ret); }
                        console.log('Contact Created Successfully : ' + ret.id);
                    }
                )
                let resultObj = {}
                resultObj.Id = contactObj.id;
                resultObj.Name = contactObj.Name;
                resultObj.Birthdate = contactObj.Birthdate;
                resultObj.Email = contactObj.Email;
                resultObj.Ethnicity__c = contactObj.Ethnicity__c;
                resultObj.Race__c = contactObj.Race__c;
                resultObj.Sex__c = contactObj.Sex__c;
                resolve(resultObj);
            } catch (error) {
                console.log("Error at createAccountContact =>" + error)
                resolve(null);
            }
        })
    },

    createTestResult: (data, testTypes, body) => {
        return new Promise(async (resolve, reject) => {
            try {
                // create a test result
                if(testTypes.length > 0){
                    for(let testType of testTypes){
                        // console.log(`Testtype ===> ${JSON.stringify(testType)}`)
                        let amountPaid = testType.is_paid_type === true ? testType.price : 0 ;
                        let { accuityId, physician_order, not_covered } = body;

                        // console.log(`Location Testtype Salesforce id===> ${testType.location_test_type_ref}`)
                        // Check the test type code for CAB Test
                        if(testType.location_test_type_ref.indexOf(',') > -1){
                            let fetchSalesforceIds = testType.location_test_type_ref.split(',');
                            if(fetchSalesforceIds.length > 0){
                                for(let currentSalesforceId of fetchSalesforceIds){
                                    let salesforceId = currentSalesforceId.trim();
                                    await conn.sobject("Test_Result__c").insert(
                                        {
                                            Patient__c: data.Id,
                                            Test_Type__c: salesforceId,
                                            Amount_Paid__c: amountPaid,
                                            Acuity_Appointment_ID__c: accuityId !== undefined && accuityId !== null ? accuityId : null,
                                            Exposed_to_COVID_or_Physician_Order__c: physician_order !== undefined && physician_order !== null ? (physician_order === true || physician_order === "true") ? 'Yes' : null : null,
                                            I_am_not_covered_under_health_insurance__c: not_covered !== undefined && not_covered !== null ? (not_covered === true || not_covered === "true") ? 'Yes' : null : null
                                        }, function (err, ret) {
                                            if (err || !ret.success) { return console.error(err, ret); }
                                            console.log('Test Result Created Successfully : ' + ret.id);
                                        }
                                    )
                                }
                            }

                        }else{
                            await conn.sobject("Test_Result__c").insert(
                                {
                                    Patient__c: data.Id,
                                    Test_Type__c: testType.location_test_type_ref,
                                    Amount_Paid__c: amountPaid,
                                    Acuity_Appointment_ID__c: accuityId !== undefined && accuityId !== null ? accuityId : null,
                                    Exposed_to_COVID_or_Physician_Order__c: physician_order !== undefined && physician_order !== null ? (physician_order === true || physician_order === "true") ? 'Yes' : null : null,
                                    I_am_not_covered_under_health_insurance__c: not_covered !== undefined && not_covered !== null ? (not_covered === true || not_covered === "true") ? 'Yes' : null : null
                                }, function (err, ret) {
                                    if (err || !ret.success) { return console.error(err, ret); }
                                    console.log('Test Result Created Successfully : ' + ret.id);
                                }
                            )
                        }
                    }
                }

                resolve("success");

            } catch (error) {
                console.log("Error at createTestResult =>" + error)
                resolve(null);
            }
        })
    },

}