import { Router } from 'express';
import { ActionController } from '../controllers/ActionController';

const actionController = new ActionController();

export const actionRouter = Router();

actionRouter.get('/valve/:id/flow/:flow', actionController.openValve);
