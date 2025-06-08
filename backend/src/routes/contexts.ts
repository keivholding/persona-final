import { Router } from 'express';
import { ContextController } from '../controllers/contextController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply auth middleware to all routes
router.use(authenticateToken);

// Context CRUD routes
router.get('/', ContextController.getContexts);
router.get('/stats', ContextController.getContextStats);
router.get('/:id', ContextController.getContext);
router.post('/', ContextController.createContext);
router.put('/:id', ContextController.updateContext);
router.delete('/:id', ContextController.deleteContext);

export default router;
