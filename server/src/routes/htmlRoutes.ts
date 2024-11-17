import path from 'path';
import { Router, Request, Response } from 'express';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../../client/dist/index.html'));
});

export default router;