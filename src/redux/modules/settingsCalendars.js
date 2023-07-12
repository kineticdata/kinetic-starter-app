import { Record } from 'immutable';
import { namespaceBuilder, noPayload, withPayload } from '../../utils';
const ns = namespaceBuilder('settings/calendars');

export const CALENDAR_FORM_SLUG = 'calendar-configurations';

export const types = {
  FETCH_CALENDAR_REQUEST: ns('FETCH_CALENDAR_REQUEST'),
  FETCH_CALENDAR_SUCCESS: ns('FETCH_CALENDAR_SUCCESS'),
  FETCH_CALENDAR_FAILURE: ns('FETCH_CALENDAR_FAILURE'),

  CLONE_CALENDAR_REQUEST: ns('CLONE_CALENDAR_REQUEST'),
  DELETE_CALENDAR_REQUEST: ns('DELETE_CALENDAR_REQUEST'),
  SAVE_CALENDAR_REQUEST: ns('SAVE_CALENDAR_REQUEST'),
  CLEAR_CALENDAR: ns('CLEAR_CALENDAR'),

  FETCH_FORMS_REQUEST: ns('FETCH_FORMS_REQUEST'),
  FETCH_FORMS_SUCCESS: ns('FETCH_FORMS_SUCCESS'),
  FETCH_FORMS_FAILURE: ns('FETCH_FORMS_FAILURE'),

  FETCH_KAPPS_REQUEST: ns('FETCH_KAPPS_REQUEST'),
  FETCH_KAPPS_SUCCESS: ns('FETCH_KAPPS_SUCCESS'),
  FETCH_KAPPS_FAILURE: ns('FETCH_KAPPS_FAILURE'),

  FETCH_ATTRIBUTES_REQUEST: ns('FETCH_ATTRIBUTES_REQUEST'),
  FETCH_ATTRIBUTES_SUCCESS: ns('FETCH_ATTRIBUTES_SUCCESS'),
  FETCH_ATTRIBUTES_FAILURE: ns('FETCH_ATTRIBUTES_FAILURE'),

  SET_VIEW: ns('SET_VIEW'),
};

export const actions = {
  fetchCalendarRequest: withPayload(types.FETCH_CALENDAR_REQUEST),
  fetchCalendarSuccess: withPayload(types.FETCH_CALENDAR_SUCCESS),
  fetchCalendarFailure: withPayload(types.FETCH_CALENDAR_FAILURE),

  cloneCalendarRequest: withPayload(types.CLONE_CALENDAR_REQUEST),
  deleteCalendarRequest: withPayload(types.DELETE_CALENDAR_REQUEST),
  saveCalendarRequest: withPayload(types.SAVE_CALENDAR_REQUEST),
  clearCalendar: noPayload(types.CLEAR_CALENDAR),

  fetchFormsRequest: withPayload(types.FETCH_FORMS_REQUEST),
  fetchFormsSuccess: withPayload(types.FETCH_FORMS_SUCCESS),
  fetchFormsFailure: withPayload(types.FETCH_FORMS_FAILURE),

  fetchKappsRequest: withPayload(types.FETCH_KAPPS_REQUEST),
  fetchKappsSuccess: withPayload(types.FETCH_KAPPS_SUCCESS),
  fetchKappsFailure: withPayload(types.FETCH_KAPPS_FAILURE),

  fetchAttributesRequest: withPayload(types.FETCH_ATTRIBUTES_REQUEST),
  fetchAttributesSuccess: withPayload(types.FETCH_ATTRIBUTES_SUCCESS),
  fetchAttributesFailure: withPayload(types.FETCH_ATTRIBUTES_FAILURE),

  setView: withPayload(types.SET_VIEW),
};

export const State = Record({
  calendar: null,
  loadingCalendar: false,
  calendarError: null,
  variables: null,
  variablesError: null,
  kapps: null,
  kappsError: null,
  attributes: null,
  attributesError: null,
  attributesFetched: false,
  view: null,
  viewOptions: {},
});

export const reducer = (state = State(), { type, payload }) => {
  switch (type) {
    case types.FETCH_CALENDAR_REQUEST:
      return state
        .set('loadingCalendar', true)
        .set('calendarError', null)
        .set(
          'calendar',
          state.calendar && state.calendar.id !== payload.id
            ? null
            : state.calendar,
        );
    case types.FETCH_CALENDAR_SUCCESS:
      return state.set('calendar', payload).set('loadingCalendar', false);
    case types.FETCH_CALENDAR_FAILURE:
      return state.set('calendarError', payload).set('loadingCalendar', false);
    case types.CLEAR_CALENDAR:
      return state.set('calendar', null);

    case types.FETCH_FORMS_REQUEST:
      return state.set('variablesError', null).set('variables', null);
    case types.FETCH_FORMS_SUCCESS:
      return state.set('variables', payload);
    case types.FETCH_FORMS_FAILURE:
      return state.set('variablesErrors', payload);

    case types.FETCH_KAPPS_REQUEST:
      return state.set('kappsError', null).set('kapps', null);
    case types.FETCH_KAPPS_SUCCESS:
      return state.set('kapps', payload);
    case types.FETCH_KAPPS_FAILURE:
      return state.set('kappsErrors', payload);

    case types.FETCH_ATTRIBUTES_REQUEST:
      return state
        .set('attributesFetched', false)
        .set('attributesError', null)
        .set('attributes', null);
    case types.FETCH_ATTRIBUTES_SUCCESS:
      return state.set('attributes', payload).set('attributesFetched', true);
    case types.FETCH_ATTRIBUTES_FAILURE:
      return state.set('attributesErrors', payload);

    case types.SET_VIEW:
      return state
        .set('view', payload.view)
        .set('viewOptions', payload.options);

    default:
      return state;
  }
};
