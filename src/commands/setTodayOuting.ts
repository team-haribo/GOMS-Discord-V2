import { ChatInputCommandInteraction, GuildMember, SlashCommandBooleanOption, SlashCommandBuilder } from 'discord.js';
import { Command } from '../interfaces/Command';
import { axiosInstance } from '../utils/axios';

export default {
  data: new SlashCommandBuilder()
    .setName("set-today-outing")
    .setDescription("오늘의 외출제 여부를 선택합니다.")
    .addBooleanOption((role: SlashCommandBooleanOption) =>
        role.setName('outing-check').setDescription('외출제 여부를 선택해주세요.').setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const isTodayOuting: boolean | null = interaction.options.getBoolean("outing-check");
    const interactionMember = interaction.member as GuildMember

    try {
        await axiosInstance.post("api/v2/outing-date/today", { outingStatus: isTodayOuting })
    } catch (error) {
        throw error
    }

    interaction.reply({
        embeds: [
            {
                color: 0x0DBC79,
                title: "외출제 상태 변경 성공",
                description: `
                사용자: <@${interactionMember.user.id}>
                외출제 상태: ${!isTodayOuting} → ${isTodayOuting}
                날짜: ${new Date().toISOString().slice(0, 10).replace(/-/g, '.')}
                `,
            }
        ]
    })
  },
} as Command;
