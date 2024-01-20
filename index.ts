import { app } from './src/app';

const PORT: string = process.env.PORT || '3000';
app.listen(PORT, () => console.log(`Cars DB API has been launched on port ${PORT}! 🚀`));
