import { Color } from "#lib/enums";
import { AccountSecurity, FindOrCreateEntity } from "#lib/utils";
import { ulid } from "ulidx";
import type { BlossomID, Snowflake } from "#lib/types";
import type { APIEmbed } from "discord.js";

/**
 * An utility class for the client
 */
export class Utility {
	/**
	 * Creates an Blossom ID for a system
	 * @param {number} timestamp - The timestamp to use when creating the ID
	 * @returns {BlossomID} The Blossom ID
	 */
	public static CreateBlossomID(timestamp?: number): BlossomID {
		return ulid(timestamp ?? Date.now());
	}

	/**
	 * Creates a simple embed to be used
	 * @param {string} message - The message to use in the embed description
	 * @param {number} color - The color to use in the embed color
	 * @returns {APIEmbed} The embed data
	 */
	public static CreateSimpleEmbed(message: string, color?: number): APIEmbed {
		const data: APIEmbed = { description: message, color: color ?? this.DefaultColor() };
		return data;
	}

	/**
	 * Returns the client's default color, can be changed for holidays
	 * @returns {number} The color the client's currently using
	 */
	public static DefaultColor(): number {
		return Color.Default;
	}

	/**
	 * Checks if the user's ID is new to the client
	 * @param {Snowflake} userId - The user's ID to check
	 * @returns {Promise<boolean>} Whether the user is new or not
	 */
	public static async IsNewMemberAgreement(userId: Snowflake): Promise<boolean> {
		const { NewMemberAgreement } = await FindOrCreateEntity(AccountSecurity, { Snowflake: userId });
		return NewMemberAgreement;
	}
}
