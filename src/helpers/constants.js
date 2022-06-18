require('dotenv').config()

module.exports = {
    JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NY_STRIPE_SECRET_KEY: process.env.NY_STRIPE_SECRET_KEY,
    S3_USER_BUCKET_NAME: process.env.S3_USER_BUCKET_NAME,
    S3_BUCKET_KMS_ARN: process.env.S3_BUCKET_KMS_ARN,
    S3_BUCKETS: [
        { bucketName: process.env.S3_USER_BUCKET_NAME, code: "u" }
    ],
    CLIENT_DOMAIN:"http://localhost:4002/",
    MESSAGE_DOMAIN:"http://localhost:3002/",
    ACCOUNT_API_DOMAIN: "http://localhost:3000/",
    TEST_API_END_POINT: "http://localhost:3005/",
    FHIR_API_END_POINT: "http://localhost:3007/",

    SALESFORCE_LOGIN_URL: process.env.NODE_ENV === 'production' ? process.env.PROD_SALESFORCE_LOGIN_URL : process.env.QA_SALESFORCE_LOGIN_URL,
    SALESFORCE_CLIENT_SECRET: process.env.NODE_ENV === 'production' ? process.env.PROD_SALESFORCE_CLIENT_SECRET : process.env.QA_SALESFORCE_CLIENT_SECRET,
    SALESFORCE_CLIENT_ID: process.env.NODE_ENV === 'production' ? process.env.PROD_SALESFORCE_CLIENT_ID  : process.env.QA_SALESFORCE_CLIENT_ID,
    SALESFORCE_USER_EMAIL: process.env.NODE_ENV === 'production' ? process.env.PROD_SALESFORCE_CLIENT_EMAIL  : process.env.QA_SALESFORCE_CLIENT_EMAIL,
    SALESFORCE_SECURITY_PASSWORD:  process.env.NODE_ENV === 'production' ? `${process.env.PROD_SALESFORCE_PASSWORD}${process.env.PROD_SALESFORCE_SECRET_TOKEN}` : `${process.env.QA_SALESFORCE_PASSWORD}${process.env.QA_SALESFORCE_SECRET_TOKEN}`,
    NODE_ENV: process.env.NODE_ENV,
}

// module.exports = {
// JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
//     STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
//     CLIENT_DOMAIN:"https://play.sonorashield.com/",
//     MESSAGE_DOMAIN:"https://play-message.sonorashield.com/",
//     ACCOUNT_API_DOMAIN: "https://play-account.sonorashield.com/",
//     TEST_API_END_POINT: "https://play-test.sonorashield.com/",
// }