import express from "express";
import helmet from "helmet";
import cors from "cors";
import logger from "./shared/config/logger.js";
import ResponseFormatter from "./shared/utils/responseFormatter.js";
import errorHandler from "./shared/middlewares/ErrorHandler.js";
import mongodb from "./shared/config/mongodb.js";
import postgres from "./shared/config/postgres.js";
import rabbitmq from "./shared/config/rabbitmq.js";
import config from "./shared/config/index.js";

/**
 * Initialize express app
 */
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, _, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });
    next();
})

app.get("/health", (_, res) => {
    res.status(200).json(
        ResponseFormatter.success(
            {
                status: 'healthy',
                timeStamp: new Date().toISOString(),
                uptime: process.uptime()
            },
            "Service is healthy"
        )
    );
});

/**
 * Base route for API information
 */
app.use("/", (_, res) => {
    res.status(200).json(
        ResponseFormatter.success(
            {
                service: 'API Hit Monitoring System',
                version: '1.0.0',
                endPoints: {
                    health: '/health',
                    auth: '/api/auth',
                    ingest: '/api/hit',
                    analytics: '/api/analytics'
                }
            },
            "Welcome to API Hit Monitoring System"
        )
    )
})

/**
 * 404 handler for undefined routes
 */
app.use((_, res) => {
    res.status(404).json(
        ResponseFormatter.error(
            "Endpoint Not Found",
            404
        )
    )
})

app.use(errorHandler);


async function initializeConnection() {
    try {
        logger.info('Initializing Database Connections');

        //MongoDb Connection
        await mongodb.connect();

        //Postgres Connection
        await postgres.testConnection();

        //Rabbitmq Connection
        await rabbitmq.connect();

        logger.info("All Connections established successfully");
    } catch (error) {
        logger.error("Failed to initialize connections", error);
        throw error
    }
}

async function startServer() {
    try {
        await initializeConnection();

        const server = app.listen(config.port, () => {
            logger.info(`Server started on port ${config.port}`);
            logger.info(`Environment: ${config.node_env}`);
            logger.info(`API available at: http://localhost:${config.port}`);
        });

        const gracefulShutdown = async (signal) => {
            logger.info(`${signal} received, shutting down gracefully ...`);

            server.close(async () => {
                logger.info("HTTP Server closed");
                try {
                    await mongodb.disconnect();
                    await postgres.close();
                    await rabbitmq.close();
                    logger.info("All connections closed, exiting process");
                    process.exit(0);
                } catch (error) {
                    logger.error("Error during graceful shutdown", error);
                    process.exit(1);
                }
            })

            setTimeout(() => {
                logger.error("Forced shutdown");
                process.exit(1);
            }, 10000);
        }

        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => gracefulShutdown("SIGTERM"));

        process.on("uncaughtException", (error) => {
            logger.error("Uncaught exception", error);
            gracefulShutdown("uncaughtException");
        });

        process.on("unhandleRejection", (error, promise) => {
            logger.error("Uncaught Rejection at: ", promise, 'reason:', error);
            gracefulShutdown("unhandleRejection");
        });

    } catch (error) {
        logger.error('Failed to start server');
        process.exit(1);
    }
}

startServer()