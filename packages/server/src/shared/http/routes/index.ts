import { Router } from 'express';

import { ScholarController } from '../controllers/ScholarController';
import { BatchScholarController } from '../controllers/BatchScholarController';
import { BatchExplorerController } from '../controllers/BatchExplorerController';
import { PveController } from '../controllers/PveController';
import { DailyController } from '../controllers/DailyController';
import { ExplorerController } from '../controllers/ExplorerController';
import { SalesController } from '../controllers/SalesController';
import { RpcController } from '../controllers/RpcController';
import { SyncController } from '../controllers/SyncController';
import { DashboardController } from '../controllers/DashboardController';
import { MatchesController } from '../controllers/MatchesController';
import { StatusController } from '../controllers/StatusController';
import { GraphQLController } from '../controllers/GraphQLController';

const router = Router();

const scholarController = new ScholarController();
const batchScholarController = new BatchScholarController();
const batchExplorerController = new BatchExplorerController();
const pveController = new PveController();
const dailyController = new DailyController();
const explorerController = new ExplorerController();
const salesController = new SalesController();
const rpcController = new RpcController();
const syncController = new SyncController();
const dashboardController = new DashboardController();
const matchesController = new MatchesController();
const statusController = new StatusController();
const graphQLController = new GraphQLController();

router.get('/scholar', scholarController.get);
router.post('/batch-scholar', batchScholarController.post);
router.get('/pve', pveController.get);
router.get('/daily', dailyController.get);
router.get('/explorer/*', explorerController.get);
router.post('/batch-explorer', batchExplorerController.post);
router.post('/sales', salesController.post);
router.post('/rpc', rpcController.post);
router.get('/sync', syncController.get);
router.post('/sync', syncController.post);
router.get('/dashboard', dashboardController.get);
router.post('/dashboard', dashboardController.post);
router.get('/matches', matchesController.get);
router.get('/status', statusController.get);
router.post('/graphql', graphQLController.post);

export { router };
