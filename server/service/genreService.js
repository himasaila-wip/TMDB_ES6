import axios from 'axios';
import https from 'https';
import apis from '../constants/constants';
const agent = new https.Agent({
  rejectUnauthorized: false,
});
let api2 = apis.genres;

const genreResponse = () => {
  try {
    const resp = axios.get(api2, {
      httpsAgent: agent
    });
    return resp;
  } catch (err) {
    console.error(err);
  }
};

export default genreResponse();