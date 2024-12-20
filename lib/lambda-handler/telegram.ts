import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";

dotenv.config();

const chatId = process.env.CHAT_ID!;
const botToken = process.env.BOT_TOKEN!;
const bot = new Telegraf(botToken);

export const sendTelegramMessage = async (message: string): Promise<void> => {
  await bot.telegram.sendMessage(chatId, message);
};
