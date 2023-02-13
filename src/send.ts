import readline from "readline";
import { saveMessage, userExists } from "./db";
const winston = require('winston');
// created logger and dynamically assigning custom files name to log errors
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
//logger end...
export const sendMessage = async (user: string) => {
    try {
        if (!await userExists(user)) {
            throw new Error("Destination user does not exist");
        }

        getUserMessage().then(async (message) => {
            await saveMessage(message, user);
        });


    } catch (error) {
        console.error("Error occured during sending message.", error);
        logger.error("Error occured during sending message.", error);
    }
}

const getUserMessage = async (): Promise<string> => {
    let rl = readline.createInterface(process.stdin, process.stdout);
    let message: string = await new Promise(resolve => rl.question("Enter your message: ", resolve));
    rl.close();
    return message;
}