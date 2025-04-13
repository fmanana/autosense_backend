import express from 'express';
import * as bodyParser from 'body-parser';
import * as jwt from 'jsonwebtoken';
import * as config from './config';

import helmet from 'helmet';

import cors from 'cors';
import * as middlewares from './middlewares';
import swaggerJsdoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';

import stations from './routes/stations';

const api = express();

api.use(cors());
api.use(bodyParser.json());

api.use(helmet());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(middlewares.allowCrossDomain);

api.get('/', (req: express.Request, res: express.Response) => {
    const token = jwt.sign({ id: '1234567890' }, config.JWT_KEY, { expiresIn: '7d' });

    res.status(200).json({
        name: 'autoSense Challenge API',
        jwt: token,
    });
});

api.use('/stations', stations);

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "AutoSense Challenge API",
            version: "1.0.0",
            description:
                "This is a CRUD API made with Node.JS, Express.JS and TypeScript and documented with Swagger",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "Fezile Manana",
                email: "fezimanana@gmail.com",
            },
        },
        servers: [
            {
                url: "http://localhost:4000",
            },
        ],
    },
    apis: ["./dist/src/routes/*.js"],
};

const specs = swaggerJsdoc(options);
api.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
        explorer: true,
        customCssUrl:
            "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css",
    })
);

api.use((req: express.Request, res: express.Response) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'The requested URL was not found on this server: ' + req.url,
    });
});

export default api;
