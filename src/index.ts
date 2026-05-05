import { config } from './config';
import app from './app';

app.listen(config.port, () => {
  console.log(`Servidor corriendo en puerto ${config.port}`);
});
