import { ConfigModeration } from "#lib/subcommands";
import { CreateResponse, Sentry } from "#lib/utils";
import { ApplicationCommandOptionType } from "discord.js";
import { config, CooldownScope, execute, Slash } from "sunar";

const slash = new Slash({
	name: "config",
	description: "Configure Blossom Sentry's server settings",
	dmPermission: false,
	options: [
		{
			name: "moderation",
			description: "Configure the moderation plugin",
			type: ApplicationCommandOptionType.SubcommandGroup,
			options: [
				{
					name: "ban_delete_days",
					description: "Set the default ban delete days",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "days",
							description: "How many days of messages should Blossom Sentry delete when a member is banned?",
							type: ApplicationCommandOptionType.Integer,
							choices: [
								{ name: "7 Days", value: 7 },
								{ name: "6 Days", value: 6 },
								{ name: "5 Days", value: 5 },
								{ name: "4 Days", value: 4 },
								{ name: "3 Days", value: 3 },
								{ name: "2 Days", value: 2 },
								{ name: "1 Day", value: 1 },
								{ name: "None", value: 0 }
							],
							required: true
						}
					]
				},
				{
					name: "settings",
					description: "View the current settings for the moderation plugin",
					type: ApplicationCommandOptionType.Subcommand
				},
				{
					name: "timeout_duration",
					description: "Set the default timeout timer",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "duration",
							description: "How long should a timeout last when a member is timed out?",
							type: ApplicationCommandOptionType.String,
							required: true
						}
					]
				},
				{
					name: "toggle",
					description: "Enable or Disable a moderation feature",
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: "feature",
							description: "What will you like to toggle?",
							type: ApplicationCommandOptionType.String,
							choices: [
								{ name: "DM Moderated User", value: "DirectMessageModeratedUser" },
								{ name: "Require Reason", value: "RequireReason" },
								{ name: "Send Confirmation Message", value: "ConfirmationMessage" }
							],
							required: true
						}
					]
				}
			]
		}
	]
});

config(slash, { cooldown: { time: 3000, scope: CooldownScope.User } });

execute(slash, async (interaction) => {
	if (!interaction.inCachedGuild()) return;
	if (await Sentry.MaintenanceModeStatus(interaction.client, interaction.user.id)) return void (await CreateResponse.InteractionError(interaction, "The developers are currently performing scheduled maintenance. Sorry for any inconvenience."));
	if (interaction.guild && (await Sentry.MaintenanceModeStatus(interaction.client, interaction.guild.id))) return void (await CreateResponse.InteractionError(interaction, "The developers are currently performing scheduled maintenance. Sorry for any inconvenience."));
	if (interaction.guild && !(await Sentry.IsAuthorized(interaction.guild.id))) return void (await CreateResponse.InteractionError(interaction, `**${interaction.guild.name}** is unauthorized to use ${interaction.client.user.username}.`));
	if (!(await Sentry.IsAuthorized(interaction.user.id))) return void (await CreateResponse.InteractionError(interaction, `You are unauthorized to use ${interaction.client.user.username}.`));
	if (!(await Sentry.MemberAgreementStatus(interaction.user.id))) return void (await CreateResponse.MemberAgreement(interaction));

	await CreateResponse.LoadingMessageReply(interaction, { defer: true, ephemeral: true });

	if (interaction.options.getSubcommandGroup() === "moderation" && interaction.options.getSubcommand() === "ban_delete_days") return void (await ConfigModeration.BanDeleteDays(interaction));
	if (interaction.options.getSubcommandGroup() === "moderation" && interaction.options.getSubcommand() === "settings") return void (await ConfigModeration.Settings(interaction));
	if (interaction.options.getSubcommandGroup() === "moderation" && interaction.options.getSubcommand() === "timeout_duration") return void (await ConfigModeration.TimeoutDuration(interaction));
	if (interaction.options.getSubcommandGroup() === "moderation" && interaction.options.getSubcommand() === "toggle") return void (await ConfigModeration.Toggle(interaction));
});

export { slash };
