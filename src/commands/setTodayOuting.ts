import { ChatInputCommandInteraction, SlashCommandBooleanOption, SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/Command';
import { axiosInstance } from '../utils/axios';
import { config } from '../utils/config';

export default {
  data: new SlashCommandBuilder()
    .setName("set-today-outing")
    .setDescription("오늘의 외출제 여부를 선택합니다.")
    .addBooleanOption((role: SlashCommandBooleanOption) =>
        role.setName('outing-check').setDescription('외출제 여부를 선택해주세요.').setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const isTodayOuting: boolean | null = interaction.options.getBoolean("outing-check");

    try {
        await axiosInstance.post("outing-date/today", {
            outingStatus: isTodayOuting,
            token: config.discordGomsToken
        })
    } catch (error) {
        throw error
    }

    interaction.reply("성공적으로 외출제 여부를 변경하였습니다.")
  },
} as Command;
