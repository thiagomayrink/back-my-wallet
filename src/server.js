import './setup.js';
import app from './app.js';

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.info(
        `Server is listening on port ${port} and NODE_ENV: ${process.env.NODE_ENV}.`,
    );
});
