"use strict";
/*

fattypipes --
a client for the fat pipes kafka event bus that makes up the backbone of the HT64 event pipeline. thie client acts
primarily as a producer

 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingestMessage = void 0;
const logger_1 = require("../commons/logger");
const logger = logger_1.createLogger("fattypipes");
const ingestMessage = (message) => {
    logger.info(message);
    logger.info(`Not implemented, but got message: ${message}`);
};
exports.ingestMessage = ingestMessage;
