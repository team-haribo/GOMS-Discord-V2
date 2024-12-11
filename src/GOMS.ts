import axios from "axios";
import {
    Client,
    Events,
    GuildMemberRoleManager,
    Interaction,
    REST,
    Routes
} from "discord.js";
import sendCustomNotification from "./commands/sendCustomNotification";
import setTodayOuting from "./commands/setTodayOuting";
import { Command } from "./interfaces/Command";
import { config } from "./utils/config";

export class GOMS {
  private slashCommandMap = new Map<string, Command>();

  public constructor(private readonly client: Client) {
    this.client.login(config.discordToken);

    this.client.on("ready", () => {
      this.registerSlashCommands();
      console.log(`${this.client.user?.username ?? ""} ready!`);
    });

    this.client.on("warn", (info) => console.log(info));
    this.client.on("error", console.error);

    this.onInteractionReceived();
  }

  private async registerSlashCommands() {
    const discordREST = new REST({ version: "10" }).setToken(
      config.discordToken
    );
    const slashCommands: Array<Command> = [
      setTodayOuting,
      sendCustomNotification
    ];

    this.slashCommandMap = slashCommands.reduce((map, command) => {
      map.set(command.data.name, command);
      return map;
    }, new Map<string, Command>());

    await discordREST.put(
      Routes.applicationCommands(this.client.user?.id ?? ""),
      {
        body: slashCommands.map((command) => command.data.toJSON()),
      }
    );
  }

  private async onInteractionReceived() {
    this.client.on(
      Events.InteractionCreate,
      async (interaction: Interaction) => {
        const guildId = config.guildId
        const councilRoleId = config.councilRoleId;

        if (!interaction.isChatInputCommand()) return;
        if (interaction.guildId !== guildId) {
          await interaction.reply({
            content: "GOMS 명령어 서버 전용 봇입니다.",
            ephemeral: true,
          });
          return;
        }

        const councilCommands = ["set-today-outing"];
        const memberRoles = interaction.member?.roles as GuildMemberRoleManager

        if (councilCommands.includes(interaction.commandName)) {
          if (!memberRoles.cache.hasAny(councilRoleId)) {
            await interaction.reply({
              content: "이 명령어는 학생회만 사용할 수 있습니다.",
              ephemeral: true,
            });
            return;
          }
        }

        const command = this.slashCommandMap.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
          } catch (error: any) {
            console.error(error);

            if (interaction.replied) {
              await interaction.followUp({
                content: error.toString()
              });
            } else if(axios.isAxiosError(error)) {
                await interaction.reply({
                    content: error.response?.data.message
                })
            } else {
              await interaction.reply({
                content: error.toString()
              });
            }
          }
      }
    );
  }
}
