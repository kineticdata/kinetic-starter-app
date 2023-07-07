import { call, put, all, select, takeEvery } from 'redux-saga/effects';
import {
  searchSubmissions,
  SubmissionSearch,
  fetchBridgedResource,
} from '@kineticdata/react';
import { generateKey, bundle } from '@kineticdata/react';
import { OrderedMap, Map, List, Set, fromJS } from 'immutable';
import axios from 'axios';
import moment from 'moment';

import { actions, types } from '../modules/calendar';
import {
  getDateRange,
  getStartDate,
  getEndDate,
  buildFilterActions,
  updateEvents,
  updateFilterOptions,
  setEventsColor,
} from '../../components/calendar/calendarHelpers';

/********************* Helpers *********************/
export const parseJson = (jsonString, isLog) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    // TODO: better handle error.
    if (isLog) {
      console.log(e, jsonString);
    }
    return false;
  }
};

export const convertBool = allDayValue =>
  allDayValue.toLowerCase().trim() === 'true' ? true : false;

export const getResources = (acc, mapping, key, date, calendarView) => {
  let values = {};

  // Different sources have different parameters required to get dates in a range.
  if (mapping.has('parameters')) {
    values = mapping.get('parameters').reduce((acc, fieldObj, key) => {
      switch (key) {
        case 'Date Range':
          return { ...getDateRange(fieldObj, date, calendarView), ...acc };
        case 'Start Date':
          return { ...getStartDate(fieldObj, date), ...acc };
        case 'End Date':
          return { ...getEndDate(fieldObj, date), ...acc };
        default:
          return acc;
      }
    }, {});
    mapping = mapping.remove('parameters');
  }

  // fetch events.
  acc[key] = call(fetchBridgedResource, {
    ...mapping.toJS(),
    values,
  });
  return acc;
};

export const prefixKeys = (data, prefix) =>
  data.mapKeys(key => `${prefix}:${key}`);

/**
 * Check if the detail mapping for the detail is multiValue and if the value
 * for the event is an array.
 *
 * @param {*} detailMapping
 * @param {*} event
 * @param {*} itemId
 */
export const isMultiValue = (detailMapping, event, itemId) => {
  let isMultiValue =
    detailMapping.has(itemId) &&
    detailMapping.get(itemId).type === 'multiValue';

  const isJson = parseJson(event[itemId], false);
  if (isMultiValue && !Array.isArray(isJson)) {
    console.warn(
      `Detail mapping for ${itemId} is configured for multiValue but event detail is not an array of values.`,
    );
  }

  return isMultiValue && Array.isArray(isJson);
};

export const findRelatedData = (
  relatedData,
  relatedDataKey,
  relatedDataId,
  eventItemId,
) =>
  relatedData.get(relatedDataKey).find(ele => {
    if (!ele.has(relatedDataId)) {
      console.warn(`Related data does not have id '${relatedDataId}'.`);
    }

    return ele.get(relatedDataId) === eventItemId;
  });

/**
 * merge event with related data using the relationships configuration.
 *
 * @param {*} events
 * @param {*} relatedData
 * @param {*} relationships
 * @returns
 */
export const mergeRelatedData = (
  event, // event can get mutated
  relatedData,
  relationships,
  detailMapping,
) => {
  // Extend event with related data for every relationship.
  relationships.forEach(relationship => {
    const { relatedDataKey, relatedDataId, itemId } = relationship.toJS();

    // Update events only if related data is configured for the relationship.
    if (relatedData.has(relatedDataKey)) {
      // Update event only if event had a detail mapping that matches the relationship.
      if (event.hasOwnProperty(itemId)) {
        // True if detail mapping is 'multiVariable' and event detail is an array.
        if (isMultiValue(detailMapping, event, itemId)) {
          let detailArray = List();

          parseJson(event[itemId]).forEach(id => {
            let data = findRelatedData(
              relatedData,
              relatedDataKey,
              relatedDataId,
              id,
            );
            // When data is undefined don't attempt to update the event.
            if (data) {
              // // Add to the arrays of related data.
              detailArray = detailArray.push(
                (data = prefixKeys(data, relatedDataKey)),
              );
            }
          });

          event = {
            ...event,
            ...detailArray
              .reduce((acc, ele) => {
                acc = ele.map(
                  (detail, detailKey) =>
                    acc.has(detailKey)
                      ? acc.get(detailKey).add(detail)
                      : Set().add(detail),
                );
                return acc;
              }, Map())
              .map(
                detail => (detail.size > 1 ? detail.toJS() : detail.first(0)),
              )
              .toJS(),
          };
        } else {
          let data = findRelatedData(
            relatedData,
            relatedDataKey,
            relatedDataId,
            event[itemId],
          );

          // When data is undefined don't attempt to update the event.
          if (data) {
            data = prefixKeys(data, relatedDataKey);
            event = { ...event, ...data.toJS() };
          }
        }
      } else {
        console.warn(
          `Item Id '${itemId}' does not exist on the event's detail mappings.`,
        );
      }
    } else {
      console.warn(
        `Relationship '${relatedDataKey}' does not exist in related data.`,
      );
    }

    return event;
  });
  return event;
};

/**
 * Format the detail value for use with event title.
 *
 * @param {object} detail
 * @param {string} timezone
 */
export const getFormatDetail = (detail, timezone) =>
  detail.type === 'date-time'
    ? timezone === false
      ? moment(detail.value).format(detail.format)
      : moment(detail.value)
          .tz(timezone)
          .format(detail.format)
    : detail.value;

/**
 * Return the core mapping property correctly formatted to be used by the full
 * calendar components.
 *  * start and end are new date format,
 *  * all day is a boolean value,
 *  * title can be a concatenation of bridge attributes and related data.
 *
 * @param {*} property
 * @param {object} event
 * @param {object} coreMapping
 * @param {Immutable Map} details
 * @param {string} timezone
 * @returns
 */
export const getFormatProperty = (
  property,
  event,
  coreMapping,
  details,
  timezone,
) => {
  switch (property) {
    case 'start':
    case 'end':
      // timezone can be set to false to indicate no timezone
      return timezone
        ? new Date(event[coreMapping[property]])
        : new Date(event[coreMapping[property]]).toISOString();
    case 'allDay':
      return convertBool(event[coreMapping[property]]);
    case 'title':
      // The title can be an array of literal strings, event values, or details
      return Array.isArray(coreMapping[property])
        ? coreMapping[property]
            .map(ele => {
              // Array element was configured in detail mapping.
              if (details.has(ele)) {
                ele =
                  typeof details.get(ele) === 'object'
                    ? // Detail that are objects have been transformed.
                      Array.isArray(details.get(ele).value)
                      ? // The detail is configured for multiValue.
                        details.get(ele).value.join(' ')
                      : (ele = getFormatDetail(details.get(ele), timezone))
                    : details.get(ele);
                // Array element was an attribute on the bridge request.
              } else if (event.hasOwnProperty(ele)) {
                ele = event[ele];
              }
              return ele;
            })
            .join('')
        : details.has(coreMapping[property])
          ? details.get(coreMapping[property])
          : event[coreMapping[property]]
            ? event[coreMapping[property]]
            : coreMapping[property];
    default:
      return event[coreMapping[property]];
  }
};

const formattedNumber = number =>
  number.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

export const convertRecurring = (event, coreMapping) => {
  if (event['recurring'] === 'daily') {
    // Get Duration (https://thewebdev.info/how-to-get-the-hour-difference-between-two-times-with-moment-js)
    const startTime = moment(
      moment(event.start).format('HH:mm:ss a'),
      'HH:mm:ss a',
    );
    const endTime = moment(
      moment(event.end).format('HH:mm:ss a'),
      'HH:mm:ss a',
    );
    const duration = moment.duration(endTime.diff(startTime));
    const hourDuration = parseInt(duration.asHours());
    let minuteDuration = parseInt(duration.asMinutes()) % 60;

    // Ensure there are always at least two digits
    minuteDuration = ('0' + minuteDuration).slice(-2);

    event = {
      ...event,
      duration: `${hourDuration}:${minuteDuration}`,
      rrule: {
        freq: 'daily',
        interval: 1,
        dtstart: event.start,
        until: event.end,
      },
    };
  }

  return event;
};
/***************************************************/

export function* fetchCalendarConfigSaga({ payload }) {
  // Fetch timezones
  yield call(fetchLocaleMetaTask);

  const searchBuilder = new SubmissionSearch(true)
    .includes(['details', 'values'])
    .index('values[Status],values[Calendar Slug]')
    .eq('values[Calendar Slug]', payload.slug)
    .eq('values[Status]', 'Active');

  const search = searchBuilder.build();
  const { submissions, error } = yield call(searchSubmissions, {
    search,
    datastore: true,
    form: 'calendar-configurations',
  });

  if (error) {
    // TODO handle error
  } else {
    // The request to DS will only return one result because the index is Unique
    const submission = submissions ? submissions[0] : null;

    if (submission) {
      // Parse source data
      let sources = parseJson(submission.values['Event Types'], true);
      sources =
        sources &&
        sources.filter(source => source.valid).reduce((acc, sourceConfig) => {
          const key = generateKey();
          return acc.set(
            key,
            fromJS({
              name: sourceConfig.name ? sourceConfig.name : '--Blank--',
              color: sourceConfig.color ? sourceConfig.color : null,
              // TODO: if prop exists what do we do?  question open to Matt H
              defaultFilter: sourceConfig.defaultFilter,
              source: sourceConfig.source,
              relationships: sourceConfig.relationships,
              coreMapping: sourceConfig.coreMapping
                ? sourceConfig.coreMapping
                : {},
              detailMapping: sourceConfig.detailMapping
                ? OrderedMap(sourceConfig.detailMapping)
                : {},
              filterMapping: sourceConfig.filterMapping
                ? sourceConfig.filterMapping.map(filter => ({
                    ...filter,
                    id: generateKey(),
                    values: filter.values,
                  }))
                : [],
            }),
          );
        }, Map());

      // Parse Related Data
      let relatedDataMapping;
      if (submission.values['Related Data']) {
        relatedDataMapping = fromJS(
          parseJson(submission.values['Related Data']),
        );
      }

      // Parse Calendar Config data
      const calendarConfig = parseJson(submission.values['Calendar Config']);
      yield put(
        actions.fetchCalendarEvents({
          key: payload.key,
          sources,
          timezone: payload.timezone,
          relatedDataMapping,
        }),
      );
      yield put(
        actions.fetchCalendarConfigSuccess({
          key: payload.key,
          sources,
          calendarConfig,
          relatedDataMapping,
        }),
      );
    } else {
      // TODO: Throw error that config was not found.
    }
  }
}

/*
  Save this code for potential error handling in the fetchCalendarEventsSaga

  // Separate successful from errors responses.
  const responseErrors = Map(response).filter(resource => !!resource.error);
  const responseSuccess = Map(response).filter(resource => !resource.error);

  if (responseErrors.size > 0) {
    // TODO: Handle Error
  }
*/

/**
 * This saga is called when the calendar is initialized and when the user
 * navigates between months, days, years.  We fetch the current month events
 * with a week cushion on either end of the month. If there are related data
 * resources they are also fetched.
 *
 * @param {*} param0
 */
export function* fetchCalendarEventsSaga({ payload }) {
  // TODO: Investigate why we clear events.  Comment here if need or delete.
  if (!payload.refetch) {
    yield put(
      actions.fetchCalendarEventsSuccess({ key: payload.key, events: [] }),
    );
  }

  // Build related data resources
  // TODO: Discuss if we should refactor to leverage prefetch parameter.
  // payload.relatedDataMapping will be undefined after first call of the saga.
  let relatedResources = {};
  if (payload.relatedDataMapping) {
    relatedResources = payload.relatedDataMapping.reduce((acc, source, key) => {
      return getResources(acc, source, key);
    }, {});
  }

  // Build a map of bridge resources to get all sources' events.
  const resources = payload.sources.reduce((acc, source, key) => {
    const sourceMapping = source.get('source');
    return getResources(
      acc,
      sourceMapping,
      key,
      payload.date,
      payload.calendarView,
    );
  }, {});

  // Make Bridge calls. The response is a JS Object of requested responses.
  // Each request responses has a unique key.
  const response = yield all({ ...relatedResources, ...resources });

  // Build Related Data from response.
  let relatedData = {};
  if (payload.relatedDataMapping) {
    Object.keys(relatedResources).forEach(resourceKey => {
      relatedData = {
        ...relatedData,
        [resourceKey]: response[resourceKey].records,
      };
      // Remove related data from response to prevent down stream errors
      delete response[resourceKey];
    });
    // Keep related data in state for subsequent event fetches
    yield put(
      actions.setRelaterData({
        key: payload.key,
        relatedData: fromJS(relatedData),
      }),
    );
  }
  // Currently related data is only fetched on the first run of the calendar, but
  // the related data is need on every event fetch.
  relatedData = yield select(state =>
    state.calendar.getIn([payload.key, 'relatedData']),
  );

  // Combine all events from each source and reformat to the needs of the calendar.
  let events = Object.keys(response ? response : {}).reduce((acc, key) => {
    const coreMapping = payload.sources
      .get(key)
      .get('coreMapping')
      .toJS();

    // These are event details shown in modals.  They also contain detail formatting.
    const detailMapping = OrderedMap(
      payload.sources.get(key).get('detailMapping'),
    );

    // Get the relationships for the source
    const relationships = payload.sources.get(key).get('relationships');

    let localEvents = response[key].records.map(event => {
      // If there is related data merge it with events.
      if (
        relatedData &&
        relatedData.size > 0 &&
        relationships &&
        relationships.size > 0
      ) {
        // The detailMapping identifies if related data is multi value.
        event = mergeRelatedData(
          event,
          relatedData,
          relationships,
          detailMapping,
        );
      }

      const details = detailMapping.map(detail => {
        let value;
        if (typeof detail === 'object') {
          let eventValue;
          if (detail.type === 'multiValue') {
            eventValue = parseJson(event[detail.attributeName]);
          } else if (detail.type === 'compound') {
            const delimiter = detail.delimiter ? detail.delimiter : null;
            eventValue = detail.attributeName
              .map(attr => event[attr])
              .join(delimiter);
          } else {
            eventValue = event[detail.attributeName];
          }
          value = {
            ...detail,
            value: eventValue ? eventValue : '_BLANK_',
          };
        } else {
          value = event[detail] ? event[detail] : '_BLANK_';
        }

        return value;
      });

      // TODO: convert the return object to an immutable Map.
      // The object is passed to EventModal for users to customize their modals.
      // It's inconstant to have details as a Map and the event(return object) as an object
      event = {
        // default that all events display when calendar renders.
        filter: false,
        key,
        ...Object.keys(coreMapping).reduce((acc, property) => {
          acc[property] = getFormatProperty(
            property,
            event,
            coreMapping,
            details,
            payload.timezone,
          );
          return acc;
        }, {}),
        details,
      };

      if (event['recurring'] && event['recurring'] !== 'not recurring') {
        event = convertRecurring(event, coreMapping);
      }

      return event;
    });

    acc = acc.concat(localEvents);
    return acc;
  }, []);

  let filterActions = {};
  if (payload.filterActions) {
    let filters = updateFilterOptions({
      filters: payload.filters,
      events,
    });
    filterActions['sources'] = payload.filterActions;
    filterActions['filters'] = filters;

    events = updateEvents(filters, events);
  } else {
    filterActions = buildFilterActions({
      sources: payload.sources,
      events,
    });
  }

  // Update the events colors
  events = setEventsColor(
    events,
    filterActions.sources,
    null,
    filterActions.filters,
  );

  yield put(
    actions.setFilterActions({
      key: payload.key,
      filterActions: filterActions.sources,
      filters: filterActions.filters,
    }),
  );

  // TODO: figure out how to handle errors
  yield put(actions.fetchCalendarEventsSuccess({ key: payload.key, events }));
}

/**
 * This saga is called via a poller to update calendar event data and uses
 * currently stored redux info instead of expecting updated payload values,
 * except for calendar key and timezone
 */
export function* refetchCalendarEventsSaga({ payload }) {
  const eventModalOpen = yield select(state =>
    state.calendar.getIn([payload.key, 'eventModalOpen']),
  );

  const dateModalOpen = yield select(state =>
    state.calendar.getIn([payload.key, 'dateModalOpen']),
  );

  const calendarView = yield select(state =>
    state.calendar.getIn([payload.key, 'mainCalendarView']),
  );

  // Do not run if either modal is open
  if (!eventModalOpen && !dateModalOpen) {
    // Grab existing data from state
    const cal = yield select(state => state.calendar.get(payload.key));

    // Timezone must be passed in
    const timezone = payload.timezone;

    // Call existing fetchCalendarEvents saga
    yield put(
      actions.fetchCalendarEvents({
        refetch: true,
        key: payload.key,
        date: cal.get('selectedDate'),
        sources: cal.get('sources'),
        filters: cal.get('filters'),
        filterActions: cal.get('filterActions'),
        calendarView,
        timezone,
      }),
    );
  }
}

// Fetch Locales Metadata Task
export function* fetchLocaleMetaTask() {
  const { timezones } = yield all({
    // locales: call(fetchLocales),
    timezones: call(fetchTimezones),
  });
  yield put(
    actions.fetchLocaleMetaSuccess({
      // locales: locales.data.locales,
      timezones: timezones.data.timezones,
    }),
  );
}

// TODO: Move to react-kinetic-lib
// const fetchLocales = () => axios.get(`${bundle.apiLocation()}/meta/locales`);
const fetchTimezones = () =>
  axios.get(`${bundle.apiLocation()}/meta/timezones`);

export function* watchCalendar() {
  yield takeEvery(types.FETCH_CALENDAR_CONFIGURATION, fetchCalendarConfigSaga);
  yield takeEvery(types.FETCH_CALENDAR_EVENTS, fetchCalendarEventsSaga);
  yield takeEvery(types.REFETCH_CALENDAR_EVENTS, refetchCalendarEventsSaga);
}