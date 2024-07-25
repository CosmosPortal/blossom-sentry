/**
 * The structure of data to toggle
 */
export interface LoadingMessageData {
	/**
	 * Whether to defer the response
	 */
	defer?: boolean;
	/**
	 * Whether to make the response ephemeral
	 */
	ephemeral?: boolean;
}
