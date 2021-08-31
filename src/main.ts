import {Client, Intents} from "discord.js";
import {createLogger} from "./commons/Logger";
import * as dotenv from "dotenv"
import * as fs from 'fs'
import * as path from "path";

dotenv.config() // Read .env file into Environment Variables (process.env...)

const fetchEvents = () => {
    const eventModules = fs.readdirSync('./events/')
}

const main = () => {
    const logger = createLogger("main")

    const intents = [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ]

    const moduleLocations = [
        './events'
    ]

    const botClient = new Client({intents})
    botClient.login(process.env.DISCORD_API_TOKEN).then(() => {
        moduleLocations.forEach((location) => {
            const modulePath = path.join(__dirname, location)
            fs.readdir(modulePath, (err, files) => {
                if (err != undefined) {
                    throw err
                }
                files.forEach((file) => {
                    const filePath = path.join(modulePath, file)
                    import(filePath).then((modules) => {
                        Object.keys(modules).filter((event) => event !== "default")
                            .forEach((handler) => {
                                const {execute, target, once} = modules[handler]
                                if (once) {
                                    logger.info(`wiring up ${file} module for 'once' ${target}`)
                                    botClient.once(target, (...args) => execute(...args))
                                } else {
                                    logger.info(`wiring up ${file} module for 'on' ${target}`)
                                    botClient.on(target, (...args) => execute(...args))
                                }
                            })
                    })
                })
            })
        })
    }).catch((err) => logger.error(err));
    botClient.once('ready', () => logger.info(`bot ready: intents=${JSON.stringify(intents)}`))
}

// Kick out the epic...
main()
