import { Client, Databases } from 'appwrite';

export const PROJECT_ID = '66cc2715002469d3e61e'
export const DATABASE_ID = '66cc281900108d643f07'
export const COLLECTION_ID_MESSAGES = '66cc282900342e29e124'

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('66cc2715002469d3e61e');

export const databases = new Databases(client);

 export default client;