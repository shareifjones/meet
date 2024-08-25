import { loadFeature, defineFeature } from "jest-cucumber";
import { render, waitFor, within } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';
import Event from "../components/Event";

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, test => {
    test('An event element is collapsed by default.', ({ given, when, then }) => {
        let AppComponent;
        given('the user opened the app', () => {
            AppComponent = render(<App />);
        });

        when('the list of events are rendered', async () => {
            const AppDOM = AppComponent.container.firstChild;
            const EventListDOM = AppDOM.querySelector('#event-list');

            await waitFor(() => {
                const EventListItems = within(EventListDOM).queryAllByRole('listitem');
                expect(EventListItems.length).toBe(32);
            });
        });

        then('event details should not show', () => {
            const AppDOM = AppComponent.container.firstChild;
            const eventDetails = AppDOM.querySelector('.details');
            expect(eventDetails).not.toBeInTheDocument();
        });
    });

    test('User can expand an event to see details.', ({ given, when, then }) => {
        let EventComponent;
        let allEvents;
        given('the user is seeing the events rendered', async () => {
            allEvents = await getEvents();
            EventComponent = render(<Event event={allEvents[0]} />);
            expect(EventComponent.container.querySelector('.details')).not.toBeInTheDocument();

        });


        when('the user clicks the show details button', async () => {
            const user = userEvent.setup();
            const showDetails = EventComponent.queryByText('Show details');
            await user.click(showDetails);

        });

        then('the event details should be shown', () => {
            const eventDetails = EventComponent.container.querySelector('.details');
            expect(eventDetails).toBeInTheDocument;
        });
    });



    test('User can collapse an event to hide details.', ({ given, when, then }) => {
        let EventComponent;
        let allEvents;
        given('the user has clicked the show details button', async () => {
            const user = userEvent.setup();
            const allEvents = await getEvents();
            const EventComponent = render(<Event event={allEvents[0]} />)
            const showDetails = EventComponent.queryByText('Show details');
            await user.click(showDetails);

        });

        when('the user clicks the hide details button', async () => {
            const user = userEvent.setup();
            const allEvents = await getEvents();
            const EventComponent = render(<Event event={allEvents[0]} />)
            const hideDetails = EventComponent.queryByText('Hide details');
            await user.click(hideDetails);
        });

        then('the event details should be hidden', () => {
            let AppComponent = render(<App />);
            const AppDOM = AppComponent.container.firstChild;
            const eventDetails = AppDOM.querySelector('.details');
            expect(eventDetails).not.toBeInTheDocument();
        });
    });
});