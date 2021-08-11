import './setup.js';
import app from './app.js';

const port = process.env.PORT;

app.listen(port, () => {
    console.info(
        `Server is listening on port ${port || 4000} and NODE_ENV: ${
            process.env.NODE_ENV
        }.`,
    );
});
