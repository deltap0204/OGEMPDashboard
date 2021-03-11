import axios from 'axios';
import config from '@app/Config';

export const generateSignedUrl = (dirName, fileName) =>
  new Promise(async (resolve, reject) => {
    try {
      const { endpoint, bucketName } = config.signedUrl;
      const response = await axios({
        method: 'get',
        url: `${config.dev.corsHandler}${endpoint}`,
        params: {
          bucket: bucketName,
          key: `${dirName}/${fileName}`
        }
      });
      if (response.status !== 200) {
        reject();
      }
      resolve(response.data);
    } catch (error) {
      console.log(error.message);
      reject(error);
    }
  });

export const axiosPutRequest = async (url, payload) => {
  try {
    const response = await axios({
      method: 'put',
      url: `${config.dev.corsHandler}${url}`,
      data: payload
    });
    return response;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};
