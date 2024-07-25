/**
 * A list of actions the client uses for all systems
 */
export enum ActionType {
	/**
	 * A ban has been added to the user
	 */
	BanAdd = "BanAdd",
	/**
	 * A ban has been removed from the user
	 */
	BanRemove = "BanRemove",
	/**
	 * A soft ban was executed
	 */
	BanSoft = "BanSoft",
	/**
	 * The user was kicked
	 */
	Kick = "Kick",
	/**
	 * A timeout has been added to the user
	 */
	TimeoutAdd = "TimeoutAdd",
	/**
	 * A timeout has been removed from the user
	 */
	TimeoutRemove = "TimeoutRemove",
	/**
	 * A warning has been added to the user
	 */
	WarnAdd = "WarnAdd",
	/**
	 * A warning has been removed from the user
	 */
	WarnRemove = "WarnRemove",
	/**
	 * The user was verbal warn
	 */
	WarnVerbal = "WarnVerbal"
}
