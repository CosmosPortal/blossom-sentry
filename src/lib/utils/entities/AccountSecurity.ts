import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "AccountSecurity" })
export class AccountSecurity {
	@PrimaryColumn()
	Snowflake!: string;

	@Column({ default: 1, type: "integer" })
	AuthorizationLevel!: number;

	@Column({ default: false })
	MemberAgreement!: boolean;

	@Column({ default: true })
	NewMemberAgreement!: boolean;
}
