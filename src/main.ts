import { doGet } from './handlers/get';
import { doPost } from './handlers/post';

declare var global: any;

global.doGet = doGet;
global.doPost = doPost;