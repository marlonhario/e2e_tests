import { saveVideo } from 'playwright-video';
import { NOW } from '@eventespresso/constants';
import { add, getMonthName } from '@eventespresso/dates';

import { createNewEvent, setListDisplayControl, TicketFields, TicketEditor } from '@e2eUtils/admin/event-editor';

import { expectCardToContain } from '../../assertions';

const namespace = 'event.tickets.edit';

beforeAll(async () => {
	await saveVideo(page, `artifacts/${namespace}.mp4`);
	await createNewEvent({ title: namespace });
});

const formData: TicketFields = {
	name: 'new ticket name',
	description: 'new ticket description',
	quantity: '1000',
	startDate: add('months', NOW, 1),
	endDate: add('months', NOW, 1),
};

const editor = new TicketEditor();

describe(namespace, () => {
	// eslint-disable-next-line jest/expect-expect
	it('should edit an existing ticket', async () => {
		const item = await editor.getItem();
		await editor.editTicket(item, formData);

		await setListDisplayControl('ticket', 'both');

		await expectCardToContain({
			...formData,
			endDate: formData.endDate.getDate(),
			endDateMonth: getMonthName(formData.endDate),
			startDate: formData.startDate.getDate(),
			startDateMonth: getMonthName(formData.startDate),
			type: 'ticket',
		});
	});
});
