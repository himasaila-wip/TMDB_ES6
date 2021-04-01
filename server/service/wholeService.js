import axios from 'axios';
import https from 'https';
import apis from '../constants/constants';
const agent = new https.Agent({
  rejectUnauthorized: false,
});
let api1 = apis.movies;

const wholeResponse = () => {
  try {
    const resp = axios.get(api1, {
      httpsAgent: agent
    });
    return resp;
  } catch (err) {
    console.error(err);
  }
};

export default wholeResponse();