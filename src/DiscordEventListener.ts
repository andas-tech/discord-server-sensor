export interface DiscordEventListener {
    target: string
    once?: boolean
    execute: (...args: any) => void
}