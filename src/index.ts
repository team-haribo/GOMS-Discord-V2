import { Client, GatewayIntentBits } from "discord.js";
import express, { Express } from "express";
import { GOMS } from "./GOMS";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions
  ]
});

export const bot = new GOMS(client);

const app: Express = express();
const port = process.env.SERVER_PORT;

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Listening at ${port}`);
});
