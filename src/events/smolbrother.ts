import {createLogger} from "../commons/logger"
import {DiscordEventListener} from "../DiscordEventListener";
import {ingestMessage} from "../services/fattypipes";
import {Message} from "discord.js";

const logger = createLogger("smolbrother")

module.exports = [
    {
        target: "messageCreate",
        execute(message: Message): void {
            logger.info(`messageCreate fired: tag=${message.author.tag}, message=${message}`)
            ingestMessage(message)
        }
    },
] as DiscordEventListener[]
