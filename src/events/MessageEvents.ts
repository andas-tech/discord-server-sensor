import {createLogger} from "../commons/Logger"
import {DiscordEventListener} from "../domain/DiscordEventListener";

import {Message, Presence} from "discord.js";
import {ingestMessage} from "../services/StreamingEventStreamingClient";

const logger = createLogger("smolbrother")

module.exports = [
    {
        target: "messageCreate",
        execute(message: Message): void {
            ingestMessage(message, "messageCreate")
        }
    },
    {
        target: "messageUpdate",
        execute(message: Message): void {
            ingestMessage(message, "messageUpdate")
        }
    },
    {
        target: "presenceUpdate",
        execute(message: Presence): void {
            ingestMessage(message)
        }
    }

] as DiscordEventListener[]
