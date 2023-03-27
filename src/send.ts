import readline from "readline";
import { saveMessage, userExists } from "./db";
import {authenticate} from "./session";
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
export const sendMessage = async (sender: string, recipient: string ) => {
    try {
        if (!await userExists(sender)) {
            throw new Error("Sender does not exist");
        }

        if (!(await authenticate(sender))) {
            throw new Error("Unable to authenticate sender");
        }

        if (!await userExists(recipient)) {
            throw new Error("Destination user does not exist");
        }

        getUserMessage().then(async (message) => {
            await saveMessage(message, sender, recipient);
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