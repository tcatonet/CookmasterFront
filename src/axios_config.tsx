/* Thomas Catonet */
/* VERSION 1.0 */

import axios from 'axios';

const Axios = axios.create({
  baseURL: 'http://172.20.0.3:5000/'
});

export default Axios;
