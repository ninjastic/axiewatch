import axios from 'axios';
import axiosThrottle from 'axios-request-throttle';
import { GraphQLClient } from 'graphql-request';
import throttle from 'fetch-throttle';

export const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
});

export const skyMavisApi = axios.create({
  baseURL: '/api/game/',
  timeout: 1000 * 15, // 15 seconds
});

export const axieInfinityGraphQl = new GraphQLClient(`${process.env.NEXT_PUBLIC_SERVER_URL}/graphql`, {
  fetch: throttle(fetch, 5, 1000),
  timeout: 1000 * 20, // 20 seconds
});

axiosThrottle.use(skyMavisApi, { requestsPerSecond: 100 });
axiosThrottle.use(serverApi, { requestsPerSecond: 50 });
