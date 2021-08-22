"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../commons/logger");
const fattypipes_1 = require("../services/fattypipes");
const logger = logger_1.createLogger("smolbrother");
module.exports = [
    {
        target: "messageCreate",
        execute(message) {
            logger.info(`messageCreate fired: tag=${message.author.tag}, message=${message}`);
            fattypipes_1.ingestMessage(message);
        }
    },
];
