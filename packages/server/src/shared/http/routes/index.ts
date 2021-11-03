import { Router } from 'express';

import { ScholarController } from '../controllers/ScholarController';
import { PveController } from '../controllers/PveController';
import { DailyController } from '../controllers/DailyController';
import { ExplorerController } from '../controllers/ExplorerController';
import { SalesController } from '../controllers/SalesController';
import { RpcController } from '../controllers/RpcController';
import { SyncController } from '../controllers/SyncController';
import { DashboardController } from '../controllers/DashboardController';
import { MatchesController } from '../controllers/MatchesController';
import { StatusController } from '../controllers/StatusController';

const router = Router();

const scholarController = new ScholarController();
const pveController = new PveController();
const dailyController = new DailyController();
const explorerController = new ExplorerController();
const salesController = new SalesController();
const rpcController = new RpcController();
const syncController = new SyncController();
const dashboardController = new DashboardController();
const matchesController = new MatchesController();
const statusController = new StatusController();

router.get('/scholar', scholarController.get);
router.get('/pve', pveController.get);
router.get('/daily', dailyController.get);
router.get('/explorer/*', explorerController.get);
router.get('/sales', salesController.get);
router.post('/rpc', rpcController.post);
router.get('/sync', syncController.get);
router.post('/sync', syncController.post);
router.get('/dashboard', dashboardController.get);
router.post('/dashboard', dashboardController.post);
router.get('/matches', matchesController.get);
router.get('/status', statusController.get);

export { router };
