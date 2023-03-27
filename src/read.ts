import { getMessagesForUser, userExists } from "./db";
import { authenticate } from "./session";
const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        //
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `info.log`
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'info.log' }),
    ],
});

export async function readMessages(user: string) {
    try {
        if (!await userExists(user)) {
            //logger.info("User does not exist");
            throw new Error("User does not exist");
        }

        if (!await authenticate(user)) {
            //logger.info("Unable to authenticate");
            throw new Error("Unable to authenticate");

        }

        getMessagesForUser(user).then((messages) => {
            messages.forEach(function(e){
                console.log(e, "\n");
                logger.info(e);
            });
        });

    } catch (error) {
        logger.error("Error occured during reading.", error);
        console.error("Error occured during reading.", error);
    }
}