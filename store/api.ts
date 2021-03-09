import * as rax from 'retry-axios';
import axios from 'axios';

const initClient = (baseURL) => {
  const client = axios.create({ baseURL, timeout: 10000 });

  client.defaults.raxConfig = {
    instance: client,
    retry: 4,
    noResponseRetries: 2,
    retryDelay: 250,
    httpMethodsToRetry: ['GET', 'HEAD', 'OPTIONS', 'DELETE', 'PUT', 'POST'],
    statusCodesToRetry: [[100, 199], [400, 429], [500, 599]],
    backoffType: 'exponential',
  };

  rax.attach(client);
  return client;
};

const BASE_URL = 'https://bumble-twitter-interview.herokuapp.com/murat-ozgul';

export default initClient(BASE_URL);