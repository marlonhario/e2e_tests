import { addNewTicket, createNewEvent, TicketEditor, EDTRGlider } from '@e2eUtils/admin/event-editor';
import { EventRegistrar } from '@e2eUtils/public/reg-checkout';
import { data } from '../../shared/data';

const namespace = 'eventEditor.tickets.filters.status';

beforeAll(async () => {
	await createNewEvent({ title: namespace });

	for (const item of data) {
		await addNewTicket({ ...item, name: 'Ticket' + item.name });
	}
});

const ticketEditor = new TicketEditor();
const registrar = new EventRegistrar();
const edtrGlider = new EDTRGlider();

describe(namespace, () => {
	it('should filter tickets corresponding to status control', async () => {
		// By default, the status filter should be "all tickets for all dates"
		// We added 2 upcoming and 1 on sale ticket, the default ticket is also on sale, making it 4
		expect(await ticketEditor.getItemCount()).toBe(4);

		await ticketEditor.filterListBy('status', { value: 'on-sale-only' });
		// We have 2 on-sale tickets
		expect(await ticketEditor.getItemCount()).toBe(2);
		expect(await ticketEditor.getItemStatus()).toBe('on sale');

		await ticketEditor.filterListBy('status', { value: 'pending-only' });
		expect(await ticketEditor.getItemCount()).toBe(2);
		expect(await ticketEditor.getItemStatus()).toBe('pending');

		await ticketEditor.filterListBy('status', { value: 'next-on-sale-or-pending-only' });
		// It should show only one
		expect(await ticketEditor.getItemCount()).toBe(1);

		await ticketEditor.filterListBy('status', { value: 'expired-only' });
		expect(await ticketEditor.getItemCount()).toBe(2);
		expect(await ticketEditor.getItemStatus()).toBe('expired');

		await ticketEditor.filterListBy('status', { value: 'trashed-only' });
		expect(await ticketEditor.getItemCount()).toBe(1);
		expect(await ticketEditor.getItemStatus()).toBe('trashed');

		// There should be no sold out ticket
		await ticketEditor.filterListBy('status', { value: 'sold-out-only' });
		expect(await ticketEditor.getItemCount()).toBe(0);

		await ticketEditor.filterListBy('status', { value: 'all' });
		// We have total 7 tickets, but pagination will only show 6
		expect(await ticketEditor.getItemCount()).toBe(6);

		// Lets update the quantity of "Ticket3"
		await ticketEditor.updateQuantityInline(await ticketEditor.getItemBy('name', 'Ticket3'), 3);

		// Lets register for 3 tickets to make the date sold out
		registrar.setPermalink(await edtrGlider.getEventPermalink());
		await registrar.registerForEvent({
			tickets: [{ name: 'Ticket3', quantity: 3 }],
			attendeeInfo: {
				fname: 'Joe',
				lname: 'Doe',
				email: 'test@example.com',
			},
			redirectURL: await edtrGlider.getEventEditUrl(),
		});

		//Now there should be 1 sold out ticket
		await ticketEditor.filterListBy('status', { value: 'sold-out-only' });
		expect(await ticketEditor.getItemCount()).toBe(1);
		expect(await ticketEditor.getItemStatus()).toBe('sold out');
	});
});
