import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './services/database';

import { router } from './http/routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/v1', router);

app.listen(3333);
