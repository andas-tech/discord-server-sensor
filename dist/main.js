"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_1 = require("./commons/logger");
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
dotenv.config(); // Read .env file into Environment Variables (process.env...)
const fetchEvents = () => {
    const eventModules = fs.readdirSync('./events/');
};
const main = () => {
    const logger = logger_1.createLogger("main");
    const intents = [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
        discord_js_1.Intents.FLAGS.GUILD_BANS,
        discord_js_1.Intents.FLAGS.GUILD_PRESENCES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGES,
        discord_js_1.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ];
    const moduleLocations = [
        './events'
    ];
    const botClient = new discord_js_1.Client({ intents });
    botClient.login(process.env.DISCORD_API_TOKEN).catch((err) => logger.error(err));
    botClient.once('ready', () => logger.info(`bot ready: intents=${JSON.stringify(intents)}`));
    moduleLocations.forEach((location) => {
        const modulePath = path.join(__dirname, location);
        fs.readdir(modulePath, (err, files) => {
            if (err != undefined) {
                throw err;
            }
            files.forEach((file) => {
                const filePath = path.join(modulePath, file);
                Promise.resolve().then(() => __importStar(require(filePath))).then((modules) => {
                    Object.keys(modules).filter((event) => event !== "default")
                        .forEach((handler) => {
                        const { execute, target, once } = modules[handler];
                        if (once) {
                            logger.info(`wiring up ${file} module for 'once' ${target}`);
                            botClient.once(target, (...args) => execute(...args));
                        }
                        else {
                            logger.info(`wiring up ${file} module for 'on' ${target}`);
                            botClient.on(target, (...args) => execute(...args));
                        }
                    });
                });
            });
        });
    });
};
// Kick out the epic...
main();
