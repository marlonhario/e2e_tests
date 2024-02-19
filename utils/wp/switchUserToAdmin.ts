import { loginUser } from './loginUser';
import { WP_USERNAME, WP_ADMIN_USER } from '../dev/config';

/**
 * Switches the current user to the admin user (if the user
 * running the test is not already the admin user).
 */
export async function switchUserToAdmin(): Promise<void> {
	if (WP_USERNAME === WP_ADMIN_USER.username) {
		return;
	}

	await loginUser(WP_ADMIN_USER.username, WP_ADMIN_USER.password);
}
