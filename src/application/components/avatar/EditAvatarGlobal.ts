import { CreateResponse, Sentry, Utility } from "#lib/utils";
import { ButtonBuilder, StringSelectMenuBuilder } from "@cosmosportal/utilities";
import { ButtonStyle, ComponentType, EmbedBuilder } from "discord.js";
import { execute, SelectMenu } from "sunar";
import type { AvatarExtension, AvatarSize } from "#lib/types";

const select = new SelectMenu({
	id: /^(EditAvatarGlobalExtension_|EditAvatarGlobalSize_).+$/,
	type: ComponentType.StringSelect
});

execute(select, async (interaction) => {
	if (await Sentry.MaintenanceModeStatus(interaction.client, interaction.user.id)) return void (await CreateResponse.InteractionError(interaction, "The developers are currently performing scheduled maintenance. Sorry for any inconvenience."));
	if (interaction.guild && !(await Sentry.IsAuthorized(interaction.guild.id))) return void (await CreateResponse.InteractionError(interaction, `${interaction.guild.name} is unauthorized to use ${interaction.client.user.username}.`));
	if (!(await Sentry.IsAuthorized(interaction.user.id))) return void (await CreateResponse.InteractionError(interaction, `You are unauthorized to use ${interaction.client.user.username}.`));
	if (!(await Sentry.MemberAgreementStatus(interaction.user.id))) return void (await CreateResponse.MemberAgreement(interaction));

	const [customId, userId, selectedExtension, selectedSize] = interaction.customId.split("_");
	const extension = customId === "EditAvatarGlobalExtension" ? interaction.values[0] : (selectedExtension as AvatarExtension);
	const size = Number(customId === "EditAvatarGlobalSize" ? interaction.values[0] : selectedSize) as AvatarSize;
	const user = await interaction.client.users.fetch(userId, { force: true }).catch(() => {
		return undefined;
	});

	if (!user) return void (await CreateResponse.InteractionError(interaction, `An issue occured with fetching the user. The user either no longer exist or ${interaction.client.user.username} couldn't fetch the user.`));

	await CreateResponse.LoadingMessageUpdate(interaction, true);

	const avatarURL = user.displayAvatarURL({
		size: size,
		extension: extension === "Default" ? undefined : (extension as Exclude<AvatarExtension, "Default">),
		forceStatic: !(extension === "Default")
	});

	const embed = new EmbedBuilder().setTitle(`@${user.tag}'s Global Avatar`).setDescription(`- **Extension** • ${extension}\n- **Size** • ${size}`).setImage(avatarURL).setColor(Utility.DefaultColor());

	const actionRowOne = new ButtonBuilder()
		.CreateRegularButton({
			custom_id: `ViewAvatarGlobal_${user.id}`,
			style: ButtonStyle.Primary,
			disabled: true,
			label: "Global"
		})
		.CreateRegularButton({
			custom_id: `ViewAvatarGuild_${user.id}`,
			style: ButtonStyle.Secondary,
			label: "Server"
		})
		.CreateRegularButton({
			custom_id: `ViewAvatarBanner_${user.id}`,
			style: ButtonStyle.Secondary,
			label: "Banner"
		})
		.CreateLinkButton({
			custom_id: avatarURL,
			label: "Copy URL"
		})
		.BuildActionRow();

	const actionRowTwo = new StringSelectMenuBuilder({
		custom_id: `EditAvatarGlobalExtension_${user.id}_${extension}_${size}`,
		select_options: [
			{ label: `${extension === "Default" ? "Extension • " : ""}Default`, value: "Default", default: extension === "Default" },
			{ label: `${extension === "jpeg" ? "Extension • " : ""}JPEG`, value: "jpeg", default: extension === "jpeg" },
			{ label: `${extension === "jpg" ? "Extension • " : ""}JPG`, value: "jpg", default: extension === "jpg" },
			{ label: `${extension === "png" ? "Extension • " : ""}PNG`, value: "png", default: extension === "png" },
			{ label: `${extension === "webp" ? "Extension • " : ""}WEBP`, value: "webp", default: extension === "webp" }
		],
		placeholder: "Change Extension?"
	}).BuildActionRow();

	const actionRowThree = new StringSelectMenuBuilder({
		custom_id: `EditAvatarGlobalSize_${user.id}_${extension}_${size}`,
		select_options: [
			{ label: `${size === 4096 ? "Size • " : ""}4096`, value: "4096", default: size === 4096 },
			{ label: `${size === 2048 ? "Size • " : ""}2048`, value: "2048", default: size === 2048 },
			{ label: `${size === 1024 ? "Size • " : ""}1024`, value: "1024", default: size === 1024 },
			{ label: `${size === 512 ? "Size • " : ""}512`, value: "512", default: size === 512 },
			{ label: `${size === 256 ? "Size • " : ""}256`, value: "256", default: size === 256 },
			{ label: `${size === 128 ? "Size • " : ""}128`, value: "128", default: size === 128 },
			{ label: `${size === 64 ? "Size • " : ""}64`, value: "64", default: size === 64 },
			{ label: `${size === 32 ? "Size • " : ""}32`, value: "32", default: size === 32 },
			{ label: `${size === 16 ? "Size • " : ""}16`, value: "16", default: size === 16 }
		],
		placeholder: "Change Size?"
	}).BuildActionRow();

	return void (await interaction.editReply({ embeds: [embed], components: [actionRowOne, actionRowTwo, actionRowThree] }));
});

export { select };
