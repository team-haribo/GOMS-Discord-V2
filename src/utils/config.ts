import "dotenv/config";

export interface Config {
  discordToken: string;
  discordGomsToken: string;
  guildId: string;
  councilRoleId: string;
}

export const config: Config = {
  discordToken: process.env.DISCORD_TOKEN ?? "",
  discordGomsToken: process.env.DISCORD_GOMS_TOKEN ?? "",
  guildId: process.env.GUILD_ID ?? "",
  councilRoleId: process.env.COUNCIL_ROLE_ID ?? "",
};
