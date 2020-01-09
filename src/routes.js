import { Router } from 'express';

import authMiddleware from './app/middlewares/auth';
import SessionController from './app/controllers/SessionController';
import StudentsController from './app/controllers/StudentsController';
import SearchController from './app/controllers/SearchController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinsController from './app/controllers/CheckinsController';
import HelpOrdersController from './app/controllers/HelpOrdersController';
import AnswerController from './app/controllers/AnswerController';
import AdministratorController from './app/controllers/AdministratorController';

const routes = new Router();

routes.post('/sessions', SessionController.store);
routes.get('/search', SearchController.index);

routes.post('/students/:studentId/checkins', CheckinsController.store);
routes.get('/students/:studentId/checkins', CheckinsController.index);

routes.post('/help-orders/:studentId', HelpOrdersController.store);
routes.get('/help-orders/:studentId', HelpOrdersController.index);

// auth admin
// routes.use(authMiddleware);

routes.post('/admin', AdministratorController.store);
routes.put('/admin', AdministratorController.update);

routes.get('/questions', AnswerController.index);
routes.put('/answer/:helpOrderId', HelpOrdersController.update);

routes.post('/students', StudentsController.store);

routes.put('/students', StudentsController.update);
routes.delete('/students', StudentsController.delete);
routes.get('/students', StudentsController.index);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans/:planId', PlanController.update);
routes.delete('/plans/:planId', PlanController.delete);

routes.post('/enrollment', EnrollmentController.store);
routes.get('/enrollment', EnrollmentController.index);
routes.put('/enrollment/:enrollmentId', EnrollmentController.update);
routes.delete('/enrollment/:enrollmentId', EnrollmentController.delete);

export default routes;
