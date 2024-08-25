import { loadFeature, defineFeature } from "jest-cucumber";
import { render, waitFor, within } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';
import Event from "../components/Event";
import NumberOfEvents from "../components/NumberOfEvents";

const feature = loadFeature('./src/features/specifyNumberOfEvents.feature');

defineFeature(feature, test => {
    test('User does not type in the number-of-events field', ({ given, when, then }) => {
        let AppComponent;
        let NumberOfEventsComponent;
        let AppDOM;
        given('I am an user', () => {
            AppComponent = render(<App />);
        });

        when('I look at the events list', () => {
            AppDOM = AppComponent.container.firstChild;
            const EventListDOM = AppDOM.querySelector('#event-list');
            NumberOfEventsComponent = render(<NumberOfEvents setCurrentNOE={() => { }} setErrorAlert={() => { }} />, { container: EventListDOM });
            expect(NumberOfEventsComponent).toBeTruthy();
        });

        then('I should see a list of 32 events', async () => {
            expect(NumberOfEventsComponent.getByRole('textbox')).toHaveValue('32');
        });
    });

    test('User types a number in the number of events field', ({ given, and, when, then }) => {
        let AppComponent;
        let NumberOfEventsComponent;
        given('I am an user', () => {
            AppComponent = render(<App />).container.firstChild;
        });

        and('I type a number in the number of events field', async () => {
            const EventListDOM = AppComponent.querySelector('#event-list');
            NumberOfEventsComponent = render(<NumberOfEvents setCurrentNOE={() => { }} setErrorAlert={() => { }} />, { container: EventListDOM });
            const user = userEvent.setup();
            const numberOfEvents = NumberOfEventsComponent.getByRole('textbox');
            await user.type(numberOfEvents, '{backspace}{backspace}10');
        });

        when('I change the number of events field', async () => {
            const user = userEvent.setup();
            const numberOfEvents = NumberOfEventsComponent.getByRole('textbox');
            await user.type(numberOfEvents, '{backspace}{backspace}10');
        });

        then('I should see the specified number of events shown', async () => {
            expect(NumberOfEventsComponent.getByRole('textbox')).toHaveValue('10');

        });
    });
});
