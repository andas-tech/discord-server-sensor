/*

fattypipes --
a client for the fat pipes kafka event bus that makes up the backbone of the HT64 event pipeline. thie client acts
primarily as a producer

 */

import {createLogger} from "../commons/logger";
import {Message} from "discord.js";

const logger = createLogger("fattypipes")

export const ingestMessage = (message: any) => {
    logger.info(`Not implemented, but got message: ${message}`)
}