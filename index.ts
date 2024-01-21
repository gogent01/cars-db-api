import { App } from './src/App';

const PORT: string = process.env.PORT || '3000';
const app = new App(PORT);
app.launch();
