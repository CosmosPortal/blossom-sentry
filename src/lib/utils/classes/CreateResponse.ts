import { LoadingMessage } from "#lib/constants";
import { EnvData, RandomString, Utility } from "#lib/utils";
import { ButtonBuilder } from "@cosmosportal/utilities";
import { ButtonStyle, type APIEmbed, type ContextMenuCommandInteraction, type InteractionResponse, type Message, type MessageComponentInteraction, type RepliableInteraction } from "discord.js";
import type { LoadingMessageData } from "#lib/interfaces";

/**
 * A class for creating a response
 */
export class CreateResponse {
	/**
	 * Creates an interaction ephemeral response to be used for the error system
	 * @param {ContextMenuCommandInteraction | RepliableInteraction } interaction - Your interaction class for creating the interaction response
	 * @param {string} message - The error message
	 * @param {number} error_color - The error color
	 * @returns {Promise<Message<boolean> | InteractionResponse<boolean>>} The interaction response
	 */
	public static async InteractionError(interaction: ContextMenuCommandInteraction | RepliableInteraction, message: string, error_color: number = 0xffb7c5): Promise<Message<boolean> | InteractionResponse<boolean>> {
		return await interaction[interaction.deferred || interaction.replied ? "followUp" : "reply"]({ embeds: [Utility.CreateSimpleEmbed(message, error_color)], ephemeral: true });
	}

	/**
	 * Creates an interaction reply response with a random loading message
	 * @param {ContextMenuCommandInteraction | RepliableInteraction} interaction - Your interaction class for creating the interaction response
	 * @param {LoadingMessageData} data - The structure of data to toggle
	 * @returns {Promise<InteractionResponse<boolean> | Message<boolean>>} The interaction response
	 */
	public static async LoadingMessageReply(interaction: ContextMenuCommandInteraction | RepliableInteraction, data: LoadingMessageData): Promise<InteractionResponse<boolean> | Message<boolean>> {
		if (data.defer) await interaction.deferReply({ ephemeral: data.ephemeral });
		return await interaction[interaction.deferred || interaction.replied ? "followUp" : "reply"]({ embeds: [Utility.CreateSimpleEmbed(RandomString(LoadingMessage), Utility.DefaultColor())], ephemeral: data.ephemeral });
	}

	/**
	 * Creates an interaction update response with a random loading message
	 * @param {ContextMenuCommandInteraction} interaction - Your interaction class for creating the interaction response
	 * @param {boolean} defer - Whether to defer the response or not
	 * @returns {Promise<InteractionResponse<boolean> | Message<boolean>>} The interaction response
	 */
	public static async LoadingMessageUpdate(interaction: MessageComponentInteraction, defer?: boolean): Promise<InteractionResponse<boolean> | Message<boolean>> {
		if (defer) await interaction.deferUpdate();
		return await interaction[interaction.deferred || interaction.replied ? "editReply" : "update"]({ content: "", embeds: [Utility.CreateSimpleEmbed(RandomString(LoadingMessage), Utility.DefaultColor())], components: [], files: [] });
	}

	/**
	 * Creates a member agreement message
	 * @param {ContextMenuCommandInteraction | RepliableInteraction } interaction - Your interaction class for creating the interaction response
	 * @returns {Promise<Message<boolean> | InteractionResponse<boolean>>} The interaction response
	 */
	public static async MemberAgreement(interaction: ContextMenuCommandInteraction | RepliableInteraction): Promise<Message<boolean> | InteractionResponse<boolean>> {
		let embed: APIEmbed;

		if (await Utility.IsNewMemberAgreement(interaction.user.id)) embed = Utility.CreateSimpleEmbed(`Welcome to ${interaction.client.user.username}! Before you get started, please take a moment to review our [Terms of Service](${EnvData("TERMS_OF_SERVICE")} "Terms of Service") and [Privacy Policy](${EnvData("PRIVACY_POLICY")} "Privacy Policy").\n\nBy clicking "Agree", you acknowledge that you have read and accept our [Terms of Service](${EnvData("TERMS_OF_SERVICE")} "Terms of Service") and [Privacy Policy](${EnvData("PRIVACY_POLICY")} "Privacy Policy").`, Utility.DefaultColor());
		else embed = Utility.CreateSimpleEmbed(`Hey <@${interaction.user.id}>! Before continuing with ${interaction.client.user.username}, please take a moment to review our updaetd [Terms of Service](${EnvData("TERMS_OF_SERVICE")} "Terms of Service") and [Privacy Policy](${EnvData("PRIVACY_POLICY")} "Privacy Policy").\n\nBy clicking "Agree", you acknowledge that you have read and accept our [Terms of Service](${EnvData("TERMS_OF_SERVICE")} "Terms of Service") and [Privacy Policy](${EnvData("PRIVACY_POLICY")} "Privacy Policy").`, Utility.DefaultColor());

		const actionRow = new ButtonBuilder()
			.CreateRegularButton({
				custom_id: `CreateMemberAgreement_Agree`,
				style: ButtonStyle.Success,
				label: "Agree"
			})
			.CreateRegularButton({
				custom_id: `CreateMemberAgreement_Decline`,
				style: ButtonStyle.Danger,
				label: "Decline"
			})
			.BuildActionRow();

		return await interaction[interaction.deferred || interaction.replied ? "followUp" : "reply"]({ embeds: [embed], components: [actionRow], ephemeral: true });
	}
}
