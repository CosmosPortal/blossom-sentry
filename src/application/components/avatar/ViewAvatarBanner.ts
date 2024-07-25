import { CreateResponse, Sentry, Utility } from "#lib/utils";
import { ButtonBuilder, StringSelectMenuBuilder } from "@cosmosportal/utilities";
import { ButtonStyle, EmbedBuilder } from "discord.js";
import { Button, execute } from "sunar";

const button = new Button({ id: /^ViewAvatarBanner_.+$/ });

execute(button, async (interaction) => {
	if (await Sentry.MaintenanceModeStatus(interaction.client, interaction.user.id)) return void (await CreateResponse.InteractionError(interaction, "The developers are currently performing scheduled maintenance. Sorry for any inconvenience."));
	if (interaction.guild && !(await Sentry.IsAuthorized(interaction.guild.id))) return void (await CreateResponse.InteractionError(interaction, `${interaction.guild.name} is unauthorized to use ${interaction.client.user.username}.`));
	if (!(await Sentry.IsAuthorized(interaction.user.id))) return void (await CreateResponse.InteractionError(interaction, `You are unauthorized to use ${interaction.client.user.username}.`));
	if (!(await Sentry.MemberAgreementStatus(interaction.user.id))) return void (await CreateResponse.MemberAgreement(interaction));

	const [customId, userId] = interaction.customId.split("_");
	const user = await interaction.client.users.fetch(userId, { force: true }).catch(() => {
		return undefined;
	});

	if (!user) return void (await CreateResponse.InteractionError(interaction, `An issue occured with fetching the user. The user either no longer exist or ${interaction.client.user.username} couldn't fetch the user.`));
	if (!user.bannerURL()) await user.fetch(true);

	const bannerURL = user.bannerURL({ forceStatic: false, size: 4096 });

	if (!bannerURL) return void (await CreateResponse.InteractionError(interaction, "The user you entered does not have a banner."));

	await CreateResponse.LoadingMessageUpdate(interaction, true);

	const embed = new EmbedBuilder().setTitle(`@${user.tag}'s Banner`).setDescription("- **Extension** • Default\n- **Size** • 4096").setImage(bannerURL).setColor(Utility.DefaultColor());

	const actionRowOne = new ButtonBuilder()
		.CreateRegularButton({
			custom_id: `ViewAvatarGlobal_${user.id}`,
			style: ButtonStyle.Secondary,
			label: "Global"
		})
		.CreateRegularButton({
			custom_id: `ViewAvatarGuild_${user.id}`,
			style: ButtonStyle.Secondary,
			label: "Server"
		})
		.CreateRegularButton({
			custom_id: `ViewAvatarBanner_${user.id}`,
			style: ButtonStyle.Primary,
			disabled: true,
			label: "Banner"
		})
		.CreateLinkButton({
			custom_id: bannerURL,
			label: "Copy URL"
		})
		.BuildActionRow();

	const actionRowTwo = new StringSelectMenuBuilder({
		custom_id: `EditAvatarBannerExtension_${user.id}_Default_4096`,
		select_options: [
			{ label: "Extension • Default", value: "Default", default: true },
			{ label: "JPEG", value: "jpeg" },
			{ label: "JPG", value: "jpg" },
			{ label: "PNG", value: "png" },
			{ label: "WEBP", value: "webp" }
		],
		placeholder: "Change Extension?"
	}).BuildActionRow();

	const actionRowThree = new StringSelectMenuBuilder({
		custom_id: `EditAvatarBannerSize_${user.id}_Default_4096`,
		select_options: [
			{ label: "Size • 4096", value: "4096", default: true },
			{ label: "2048", value: "2048" },
			{ label: "1024", value: "1024" },
			{ label: "512", value: "512" },
			{ label: "256", value: "256" },
			{ label: "128", value: "128" },
			{ label: "64", value: "64" },
			{ label: "32", value: "32" },
			{ label: "16", value: "16" }
		],
		placeholder: "Change Size?"
	}).BuildActionRow();

	return void (await interaction.editReply({ embeds: [embed], components: [actionRowOne, actionRowTwo, actionRowThree] }));
});

export { button };
