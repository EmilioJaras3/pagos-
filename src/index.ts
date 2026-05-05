import { config, validateConfig } from './config';
import app from './app';

validateConfig();

app.listen(config.port, () => {
  console.log(`Servidor corriendo en puerto ${config.port}`);
});
