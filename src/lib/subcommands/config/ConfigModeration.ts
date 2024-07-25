import { CreateEntity, CreateResponse, FindOneEntity, FindOrCreateEntity, ModerationSetting, StaffTeamMember, UpdateEntity, Utility } from "#lib/utils";
import { ToTitleCase } from "@cosmosportal/utilities";
import { Duration, DurationFormatter, Time } from "@sapphire/duration";
import type { ChatInputCommandInteraction } from "discord.js";

export class ConfigModeration {
	public static async BanDeleteDays(interaction: ChatInputCommandInteraction<"cached">) {
		if (!(await StaffTeamMember.HasGuildSettingAuthorization(interaction.guild, interaction.member))) return void (await CreateResponse.InteractionError(interaction, `</${interaction.commandName} ${interaction.options.getSubcommandGroup()} ${interaction.options.getSubcommand()}:${interaction.commandId}> is restricted to Application Managers and members of the Management Team in **${interaction.guild.name}**.`));

		if (!(await FindOneEntity(ModerationSetting, { Snowflake: interaction.guild.id }))) await CreateEntity(ModerationSetting, { Snowflake: interaction.guild.id, BanDeleteDays: interaction.options.getInteger("days", true) });
		else await UpdateEntity(ModerationSetting, { Snowflake: interaction.guild.id }, { BanDeleteDays: interaction.options.getInteger("days", true) });

		return void (await interaction.editReply({ embeds: [Utility.CreateSimpleEmbed(`The default ban delete days was set to **${interaction.options.getInteger("days", true)}** Day(s).`, Utility.DefaultColor())] }));
	}

	public static async Settings(interaction: ChatInputCommandInteraction<"cached">) {
		if (!(await StaffTeamMember.HasGuildSettingAuthorization(interaction.guild, interaction.member))) return void (await CreateResponse.InteractionError(interaction, `</${interaction.commandName} ${interaction.options.getSubcommandGroup()} ${interaction.options.getSubcommand()}:${interaction.commandId}> is restricted to Application Managers and members of the Management Team in **${interaction.guild.name}**.`));

		const { BanDeleteDays, ConfirmationMessage, DirectMessageModeratedUser, RequireReason, TimeoutDuration } = await FindOrCreateEntity(ModerationSetting, { Snowflake: interaction.guild.id });

		return void (await interaction.editReply({
			embeds: [
				Utility.CreateSimpleEmbed(
					`## Overview\n### Default Data\n- **Ban Delete Days** • **${BanDeleteDays}** Day(s)\n> The default amount of messages to delete for a ban. Use </config moderation ban_delete_days:${interaction.commandId}> to set a time.\n- **Timeout Duration** • ${ToTitleCase(new DurationFormatter().format(TimeoutDuration, 4, { right: ", " }))}\n> The default timeout duration. Use </config moderation timeout_duration:${interaction.commandId}> to set a time.\n### System Configuration\n- **DM Moderated User** • ${!DirectMessageModeratedUser ? "No" : "Yes"}\n- **Require Reason?** • ${!RequireReason ? "No" : "Yes"}\n> Require the staff team to enter a moderation reason. Use </config moderation toggle:${interaction.commandId}> to edit this.\n- **Send Confirmation Message?** • ${!ConfirmationMessage ? "No" : "Yes"}\n> Send a confirmation message to the channel. Use </config moderation toggle:${interaction.commandId}> to edit this.\n- **Commands Access** • Moderation Team & Higher Positions\n> To control who can view commands, go to **Server Settings** ➔ **Integrations** ➔ **${interaction.client.user.username}**.`,
					Utility.DefaultColor()
				)
			]
		}));
	}

	public static async TimeoutDuration(interaction: ChatInputCommandInteraction<"cached">) {
		if (!(await StaffTeamMember.HasGuildSettingAuthorization(interaction.guild, interaction.member))) return void (await CreateResponse.InteractionError(interaction, `</${interaction.commandName} ${interaction.options.getSubcommandGroup()} ${interaction.options.getSubcommand()}:${interaction.commandId}> is restricted to Application Managers and members of the Management Team in **${interaction.guild.name}**.`));

		const duration = new Duration(interaction.options.getString("duration", true)).offset;

		if (isNaN(duration)) return void (await CreateResponse.InteractionError(interaction, "The duration you entered was not well formatted or had no numbers."));
		if (!Number.isInteger(duration)) return void (await CreateResponse.InteractionError(interaction, "The duration you entered was not converted into an integer."));
		if (!(duration >= Time.Second * 60 && duration <= Time.Day * 28)) return void (await CreateResponse.InteractionError(interaction, "The duration you entered did not reach our requirements. Duration can't be under 1 minute or over 28 days."));

		if (!(await FindOneEntity(ModerationSetting, { Snowflake: interaction.guild.id }))) await CreateEntity(ModerationSetting, { Snowflake: interaction.guild.id, TimeoutDuration: duration });
		else await UpdateEntity(ModerationSetting, { Snowflake: interaction.guild.id }, { TimeoutDuration: duration });

		return void (await interaction.editReply({ embeds: [Utility.CreateSimpleEmbed(`The default timeout timer was set to ${new DurationFormatter().format(duration, 4, { right: ", " })}.`, Utility.DefaultColor())] }));
	}

	public static async Toggle(interaction: ChatInputCommandInteraction<"cached">) {
		if (!(await StaffTeamMember.HasGuildSettingAuthorization(interaction.guild, interaction.member))) return void (await CreateResponse.InteractionError(interaction, `</${interaction.commandName} ${interaction.options.getSubcommandGroup()} ${interaction.options.getSubcommand()}:${interaction.commandId}> is restricted to Application Managers and members of the Management Team in **${interaction.guild.name}**.`));

		const moderationSetting = await FindOrCreateEntity(ModerationSetting, { Snowflake: interaction.guild.id });
		const feature = interaction.options.getString("feature", true) as "ConfirmationMessage" | "DirectMessageModeratedUser" | "RequireReason";

		await UpdateEntity(ModerationSetting, { Snowflake: interaction.guild.id }, { [feature]: moderationSetting[feature] });

		const updatedModerationSetting = await FindOrCreateEntity(ModerationSetting, { Snowflake: interaction.guild.id });

		return void (await interaction.editReply({ embeds: [Utility.CreateSimpleEmbed(`You have ${!updatedModerationSetting[feature] ? "enabled" : "disabled"} the feature **${feature === "ConfirmationMessage" ? "Send Confirmation Message" : feature === "DirectMessageModeratedUser" ? "DM Moderated User" : "Require Reason"}**.`)] }));
	}
}
