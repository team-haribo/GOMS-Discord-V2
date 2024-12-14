import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';
import { Command } from '../interfaces/Command';
import { axiosInstance } from '../utils/axios';

export default {
  data: new SlashCommandBuilder()
    .setName("send-custom-notification")
    .setDescription("푸시 알림을 전송합니다.")
    .addStringOption((role: SlashCommandStringOption) =>
        role.setName('title').setDescription('제목을 입력해주세요.').setRequired(true)
    )
    .addStringOption((role: SlashCommandStringOption) =>
        role.setName('content').setDescription('내용을 입력해주세요.').setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const title = interaction.options.getString("title");
    const content = interaction.options.getString("content")
    const interactionMember = interaction.member as GuildMember

    await interaction.deferReply();

    try {
        await axiosInstance.post("api/v2/notification/send", {
            title: title,
            content: content
        })
    } catch (error) {
        throw error
    }

    await interaction.reply({
        embeds: [
            {
                color: 0x0DBC79,
                title: "푸시 알림 전송 성공",
                description: `
                사용자: <@${interactionMember.user.id}>
                제목: ${title}
                내용: ${content}
                `,
            }
        ]
    })
  },
} as Command;
