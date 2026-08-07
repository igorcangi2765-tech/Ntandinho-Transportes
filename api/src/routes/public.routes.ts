import { Router, Request, Response } from 'express';

const publicRouter = Router();

// Healthcheck público
publicRouter.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    scope: 'public',
    timestamp: new Date().toISOString(),
  });
});

// Exemplo: Formulário de solicitação de cotação vindo do site público
publicRouter.post('/quote-request', (req: Request, res: Response) => {
  const { name, email, phone, details } = req.body;
  res.status(201).json({
    success: true,
    message: 'Solicitação de cotação recebida com sucesso.',
    data: { name, email, phone, details },
  });
});

export default publicRouter;
