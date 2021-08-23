/*

Streaming Event Streaming service --
a kafka integration for discord messages
 */

import {createLogger} from "../commons/logger";
import {Message, Presence} from "discord.js";
import {KafkaClient, Producer} from "kafka-node";
import {
    KAFKA_TOPIC_DISCORD_MESSAGE_CREATE,
    KAFKA_TOPIC_DISCORD_MESSAGE_FALLTHROUGH, KAFKA_TOPIC_DISCORD_MESSAGE_UPDATE,
    KAFKA_TOPIC_DISCORD_PRESENCE_UPDATE,
    MESSAGE_CREATE, MESSAGE_UPDATE
} from "../constants";

const logger = createLogger("StreamingEventStreamingClient")
const kafkaHost = process.env.KAFKA_HOST

type ValidTypes = Message | Presence

export const ingestMessage = (message: ValidTypes, nuance?: string) => {
    if (message instanceof Message) {
        if (nuance === MESSAGE_CREATE) {
            publish(KAFKA_TOPIC_DISCORD_MESSAGE_CREATE, JSON.stringify(message))
            return
        }
        if (nuance === MESSAGE_UPDATE) {
            publish(KAFKA_TOPIC_DISCORD_MESSAGE_UPDATE, JSON.stringify(message))
            return
        }
        publish(KAFKA_TOPIC_DISCORD_MESSAGE_FALLTHROUGH, JSON.stringify(message))
    }
    if (message instanceof Presence) {
        publish(KAFKA_TOPIC_DISCORD_PRESENCE_UPDATE, JSON.stringify(message))
        return
    }
}

const publish = (topic: string, message: string) => {
    const client = new KafkaClient({kafkaHost})
    const producer = new Producer(client)
    producer.on("ready", () => client.refreshMetadata(
        [topic], (err) => {
        if (err) {
            logger.error(err)
            return
        }


        producer.send([
            {
                topic,
                messages: [message]
            }
        ], (err => {
            if (err) {
                logger.error(err)
                return
            }
        }))
    }))

    producer.on("error", (err) => logger.error(err))
}