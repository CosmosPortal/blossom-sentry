import { AccountSecurity, CreateResponse, Sentry, UpdateEntity } from "#lib/utils";
import { Button, execute } from "sunar";

const button = new Button({ id: /^CreateMemberAgreement_.+$/ });

execute(button, async (interaction) => {
	if (await Sentry.MaintenanceModeStatus(interaction.client, interaction.user.id)) return void (await CreateResponse.InteractionError(interaction, "The developers are currently performing scheduled maintenance. Sorry for any inconvenience."));
	if (interaction.guild && (await Sentry.MaintenanceModeStatus(interaction.client, interaction.guild.id))) return void (await CreateResponse.InteractionError(interaction, "The developers are currently performing scheduled maintenance. Sorry for any inconvenience."));
	if (interaction.guild && !(await Sentry.IsAuthorized(interaction.guild.id))) return void (await CreateResponse.InteractionError(interaction, `**${interaction.guild.name}** is unauthorized to use ${interaction.client.user.username}.`));
	if (!(await Sentry.IsAuthorized(interaction.user.id))) return void (await CreateResponse.InteractionError(interaction, `You are unauthorized to use ${interaction.client.user.username}.`));

	const [customId, agreement] = interaction.customId.split("_");

	if (agreement === "Agree") await UpdateEntity(AccountSecurity, { Snowflake: interaction.user.id }, { MemberAgreement: true, NewMemberAgreement: false });

	return void (await interaction.update({ components: [] }));
});

export { button };
