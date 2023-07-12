import { all } from 'redux-saga/effects';
import { watchCalendar } from './sagas/calendar';
import { watchSettingsCalendars } from './sagas/settingsCalendars';

// eslint-disable-next-line import/no-anonymous-default-export
export default function*() {
  yield all([watchCalendar(), watchSettingsCalendars()]);
}
