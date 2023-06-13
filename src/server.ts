import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const jsonFolderPath = path.join(__dirname, 'jsons');

app.all('*', (req: Request, res: Response) => {
  const filePath = path.join(jsonFolderPath, `${req.url}.json`);

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      res.status(404).json({ error: 'Arquivo não encontrado' });
      return;
    }

    const jsonData = JSON.parse(data);
    const method = jsonData.method || 'GET';

    const supportedMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    if (!supportedMethods.includes(method)) {
      res.status(400).json({ error: 'Método inválido' });
      return;
    }

    if (req.method !== method) {
      res.status(400).json({ error: 'Bad Request' });
      return;
    }

    res.json(jsonData);
  });
});

app.listen(3000, () => {
  console.log('Servidor ouvindo na porta 3000');
});