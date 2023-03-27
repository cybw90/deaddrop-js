import { createHmac } from "crypto";
import { connect } from "./db";
import { getUserId } from "./user";

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
const calculateMac = async (message: string, sender: string, recipient: string): Promise<string> => {
    const key = Buffer.from(await getUserId(sender).toString());
    const hmac = createHmac("sha256", key);
    hmac.update(message);
    hmac.update(recipient);
    return hmac.digest("hex");
};

const verifyMac = async (message: string, sender: string, recipient: string, storedMac: string): Promise<boolean> => {
    const key = Buffer.from(await getUserId(sender).toString());
    const hmac = createHmac("sha256", key);
    hmac.update(message);
    hmac.update(recipient);
    const calculatedMac = hmac.digest("hex");
    return calculatedMac === storedMac;
};

export const getMessagesForUser = async (user: string) => {
    let db = await connect();

    let query = `
    SELECT Users.user as sender, Messages.data as message,  Messages.mac as mac
    FROM Messages
    JOIN Users ON Users.id = Messages.sender
    WHERE recipient = (SELECT id FROM Users WHERE user = :user);
  `;
    const messages = await db.all(query, {
        ":user": user,
    });

    const filteredMessages = await Promise.all(messages.map(async (message) => {
        const { sender, message: messageText, mac } = message;
        const isMacValid = await verifyMac(messageText, sender, user, mac);
        if (!isMacValid) {
            console.log(`Error: Message from ${sender} to ${user} has been modified`);
            logger.info(`Error: Message from ${sender} to ${user} has been modified`);
            return null;
        }
        return { sender, message: messageText };
    }));

    return filteredMessages.filter(Boolean);

    // await db.each(`
    //     SELECT data FROM Messages
    //     WHERE recipient = (
    //         SELECT id FROM Users WHERE user = :user
    //     );
    // `, {
    //     ":user": user,
    // }, (err, row) => {
    //     if (err) {
    //         throw new Error(err);
    //     }
    //     messages.push(row.data);
    // });
    //
    // return messages;
}

export const saveMessage = async (message: string, sender: string,  recipient: string) => {
    const mac = await calculateMac(message, sender, recipient);
    let db = await connect();

    await db.run(`
        INSERT INTO Messages 
            (sender, recipient, data, mac)
        VALUES (
            (SELECT id FROM Users WHERE user = :sender),
            (SELECT id FROM Users WHERE user = :recipient),
            :message, 
            :mac
        )
    `, {
        ":sender": sender,
        ":recipient": recipient,
        ":message": message,
        ":mac": mac,
    });
}