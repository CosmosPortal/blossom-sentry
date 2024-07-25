import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "ModerationSetting" })
export class ModerationSetting {
	@PrimaryColumn()
	Snowflake!: string;

	@Column({ default: 0, type: "integer" })
	BanDeleteDays!: number;

	@Column({ default: false })
	ConfirmationMessage!: boolean;

	@Column({ default: true })
	DirectMessageModeratedUser!: boolean;

	@Column({ default: false })
	RequireReason!: boolean;

	@Column({ default: 3600000, type: "integer" })
	TimeoutDuration!: number;
}
