import readline from "readline";
import bcrypt from "bcryptjs";
import { getUserPassHash, noUsers } from "./db";

export const getPassword = async (): Promise<string> => {
    return readPassIn("Enter Password: ",{ hidden: true })
        .then((pass) => saltAndHash(pass));
};

const saltAndHash = (pass: string): string => {
    // 10 is the recommended default difficulty for bcrypt as of jan 2023
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(pass, salt);
};

export const authenticate = async (user: string): Promise<boolean> => {
    // bypass authentication if no users have been created
    if ((await noUsers())) {
        return Promise.resolve(true);
    }

    let pass = await readPassIn("Enter Password: ", { hidden: true })
    let hash = await getUserPassHash(user);

    return bcrypt.compare(pass.toString(), hash.toString());
};

// from the impressive @sdgfsdh at https://stackoverflow.com/questions/24037545/how-to-hide-password-in-the-nodejs-console
// get a password from the cli replacing input with **** to hide it
export const readPassIn = (query: string, options: { hidden?: boolean } = {}) =>
    new Promise<string>((resolve, reject) => {
        const input = process.stdin;
        const output = process.stdout;

        type Rl = readline.Interface & { history: string[] };
        const rl = readline.createInterface({ input, output }) as Rl;

        if (options.hidden) {
            const onDataHandler = (charBuff: Buffer) => {
                const char = charBuff + '';
                switch (char) {
                    case '\n':
                    case '\r':
                    case '\u0004':
                        input.removeListener('data', onDataHandler);
                        break;
                    default:
                        readline.clearLine(process.stdout, 0);
                        readline.cursorTo(process.stdout, 0);
                        process.stdout.write(query + Array(rl.line.length + 1).join("*"));
                        break;
                }
            };
            input.on('data', onDataHandler);
        }

        rl.question(query, (value) => {
            if (options.hidden) rl.history = rl.history.slice(1);
            rl.close();
            resolve(value);
        });
    });
