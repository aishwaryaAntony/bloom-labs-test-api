import { JWT_PRIVATE_KEY, MESSAGE_DOMAIN, ACCOUNT_API_DOMAIN } from "./constants";
const axios = require('axios');
import jwt from "jsonwebtoken";

export default {
    sendMessage(body) {
        return new Promise(async (resolve, reject) => {
            try {
                let data = {};
                data.from = "ACCOUNT_API";
                data.account_token = "12345";

                let token = jwt.sign(data, JWT_PRIVATE_KEY);
                const instance = axios.create({
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                await instance.post(`${MESSAGE_DOMAIN}message`, body).then(function (response) {
                    if (response.statusText === "OK" || response.status === 200) {
                        console.log("Message Send Successfully ==>" + JSON.stringify(response.data));
                    } else {
                        console.log("Error While sending message api error ==>");
                        console.log(response)
                    }
                }).catch(function (error) {
                    console.log("Error While sending message api error ==>" + error);
                });

                resolve("success")

            } catch (error) {
                resolve(null)
                console.log(error)
                console.log("Error While sending message error ==>" + error)
            }
        });
    },

    fetchMemberDetails(body) {
        return new Promise(async (resolve, reject) => {
            try {
                let data = {};
                data.from = "ACCOUNT_API";
                data.account_token = "12345";

                let token = jwt.sign(data, JWT_PRIVATE_KEY);
                const instance = axios.create({
                    headers: { 'Authorization': 'Bearer ' + token }
                });

                await instance.post(`${ACCOUNT_API_DOMAIN}members/tokens/member`, body).then(function (response) {
                    // console.log(`Respo ---> ${JSON.stringify(response.statusText)}`)
                    if (response.statusText === "OK" || response.status === 200) {
                        resolve(response.data.payload);
                    } else {                        
                        console.log(response)
                        resolve({});
                    }
                }).catch(function (error) {
                    console.log("Error While fetch Member Details api error =>" + error);
                    resolve({});
                });

                // resolve("success")

            } catch (error) {
                resolve(null)
                console.log(error)
                console.log("Error While sending message error=====================>" + error)
            }
        });
    },

    sendPRLEmailAttachment(body) {
        return new Promise(async (resolve, reject) => {
            try {
                let data = {};
                data.from = "ACCOUNT_API";
                data.account_token = "12345";

                let token = jwt.sign(data, JWT_PRIVATE_KEY);
                let headers = body.getHeaders();
                headers.Authorization = 'Bearer ' + token;
                const instance = axios.create({
                    // headers: {
                    //     'Content-Type': 'multipart/form-data',
                    //     'Authorization': 'Bearer ' + token,
                    // }
                    headers: headers
                    // headers: formData.getHeaders()
                });
                await instance.post(`${MESSAGE_DOMAIN}message/send-prl-report`, body).then(function (response) {
                    if (response.statusText === "OK" || response.status === 200) {
                        console.log("Message attachment Send Successfully ==>" + JSON.stringify(response.data));
                        resolve(response.data.payload);
                    } else {
                        console.log("Error while sending attachment message api error ==>");
                        console.log(response);
                        resolve({});
                    }
                }).catch(function (error) {
                    console.log("Error while sending attachment message api error ==>" + error);
                    resolve({});
                });

                resolve("success")
            } catch (error) {
                resolve(null)
                console.log(error)
            }
        });
    }
}