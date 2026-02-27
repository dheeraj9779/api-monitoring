import amqp from "amqplib";
import logger from "./logger";
import config from "./index";

class RabbitmqConnection{
    constructor(){
        this.connection = null;
        this.channel = null;
        this.isConnecting = false;
    }

    async connect(){
        if(this.channel){
            return this.channel
        }

        if(this.isConnecting){
            await new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if(!this.isConnecting){
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100)
            })
            return this.channel;
        }

        try {
            this.isConnecting = true;
            logger.info("Connecting to Rabbitmq", config.rabbitmq.url);
            this.connection = await amqp.connect(config.rabbitmq.url);
            this.channel = await this.connection.createChannel();

            //Creating key for the deadletter queue | Queue Name
            const dlqName = `${config.rabbitmq.queue}.dlq`;

            await this.channel.assertQueue(dlqName, {
                durable: true
            })

            //Normal Queue
            await this.channel.assertQueue(config.rabbitmq.queue, {
                durable: true,
                arguments: {
                    "x-dead-letter-exchange" : "",
                    "x-deal-letter-routing-key": dlqName
                }
            })

            logger.info("Rabbitmq connected, queue:",config.rabbitmq.queue)

            this.connection.on("close",() => {
                logger.warn("RabbitMQ connection closed");
                this.connection = null;
                this.channel = null;
            })

            this.connection.on("error",(error) => {
                logger.error("RabbitMQ connection error",error);
                this.connection = null;
                this.channel = null;
            })

            this.isConnecting = false;
            return this.channel;
        } catch (error) {
            this.isConnecting = false;
            logger.error("Failed to connect to RabbitMQ",error);
            throw error;
        }
    }

    getChannel(){
        this.channel;
    }

    getStatus(){
        if(!this.connection && !this.channel) return "disconnected";
        if(this.connection && this.connection.closing) return "closing";
        return "connected";
    }

    async close(){
        try{
            if(this.channel){
                await this.channel.close();
                this.channel = null;
            }
            if(this.connection){
                await this.connection.close();
                this.connection = null;
            }
            logger.info("RabbitMQ connection closed");
        }
        catch(error){
            logger.error("Failed to close RabbitMQ connection",error);
            throw error;
        }
    }
}

export default new RabbitmqConnection();