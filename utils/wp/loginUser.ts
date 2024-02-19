import { WP_USERNAME, WP_PASSWORD } from '../dev/config';
import { createURL } from './createURL';
import { isCurrentURL } from './isCurrentURL';
import { pressKeyWithModifier } from '../misc';

/**
 * Performs log in with specified username and password.
 *
 * @param {?string} username String to be used as user credential.
 * @param {?string} password String to be used as user credential.
 */
export async function loginUser(username = WP_USERNAME, password = WP_PASSWORD): Promise<void> {
	if (!isCurrentURL('wp-login.php')) {
		await page.goto(createURL('wp-login.php'));
	}

	await page.focus('#user_login');
	await pressKeyWithModifier('primary', 'a');
	await page.type('#user_login', username);
	await page.focus('#user_pass');
	await pressKeyWithModifier('primary', 'a');
	await page.type('#user_pass', password);

	await Promise.all([page.waitForNavigation(), page.click('#wp-submit')]);
}
