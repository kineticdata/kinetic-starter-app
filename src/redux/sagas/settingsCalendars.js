import { call, put, takeEvery } from 'redux-saga/effects';
import {
  updateSubmission,
  fetchSubmission,
  deleteSubmission,
  createSubmission,
  fetchForms,
  fetchBridgeModelAttributes,
  fetchKapps,
} from '@kineticdata/react';
import { callBack } from '../../utils';
import {
  actions,
  types,
  CALENDAR_FORM_SLUG,
} from '../modules/settingsCalendars';
import { Seq, Map } from 'immutable';

export function* fetchCalendarSaga({ payload }) {
  const { submission, error } = yield call(fetchSubmission, {
    id: payload,
    include: 'details,values,form,form.kapp',
    datastore: true,
  });

  if (error) {
    yield put(actions.fetchCalendarFailure(error));
  } else {
    yield put(actions.fetchCalendarSuccess(submission));
  }
}

export function* cloneCalendarSaga({ payload }) {
  const { submission, error: fetchError } = yield call(fetchSubmission, {
    id: payload.id,
    include: 'details,values,form,form.kapp,form.fields.details',
    datastore: true,
  });

  if (fetchError) {
    callBack({ payload, error: fetchError });
  } else {
    // Some values on the original submission should be reset.
    const overrideFields = Map({
      'Calendar Name': `Copy of ${submission.values['Calendar Name']}`,
      Status: 'Inactive',
    });

    // Copy the values from the original submission with the transformations
    // described above.
    const values = Seq(submission.values)
      .map((value, fieldName) => overrideFields.get(fieldName) || value)
      .toJS();

    // Make the call to create the clone.
    const { submission: response, error } = yield call(createSubmission, {
      datastore: true,
      formSlug: submission.form.slug,
      values,
      completed: false,
    });

    callBack({ payload, response, error });
  }
}

export function* deleteCalendarSaga({ payload }) {
  const { error } = yield call(deleteSubmission, {
    id: payload.id,
    datastore: true,
  });

  callBack({ payload, response: !error, error });
}

export function* saveCalendarSaga({ payload }) {
  const { submission, error } = yield payload.id
    ? call(updateSubmission, {
        kappSlug: payload.kappSlug,
        id: payload.id,
        values: payload.values,
        include: 'values,form,form.kapp',
      })
    : call(createSubmission, {
        kappSlug: payload.kappSlug,
        formSlug: CALENDAR_FORM_SLUG,
        completed: true,
        values: payload.values,
        include: 'values,form,form.kapp',
      });

  if (!error) {
    yield put(actions.fetchCalendarSuccess(submission));
  }

  callBack({ payload, response: submission, error });
}

export function* fetchFormsSaga(action) {
  if (action.payload.kappSlug) {
    const { forms, error } = yield call(fetchForms, {
      include: 'bridgedResources, fields',
      kappSlug: action.payload.kappSlug,
    });

    if (error) {
      yield put(actions.fetchFormsFailure(error));
    } else {
      yield put(actions.fetchFormsSuccess(forms));
    }
  }
}

export function* fetchKappsSaga(action) {
  const { kapps, error } = yield call(fetchKapps);

  if (error) {
    yield put(actions.fetchKappsFailure(error));
  } else {
    yield put(actions.fetchKappsSuccess(kapps));
  }
}

export function* fetchAttributesSaga({ payload }) {
  if (payload) {
    const { bridgeModelAttributes, error } = yield call(
      fetchBridgeModelAttributes,
      {
        modelName: payload,
      },
    );

    if (error) {
      yield put(actions.fetchAttributesFailure(error));
    } else {
      yield put(actions.fetchAttributesSuccess(bridgeModelAttributes));
    }
  }
}

export function* watchSettingsCalendars() {
  yield takeEvery(types.FETCH_CALENDAR_REQUEST, fetchCalendarSaga);
  yield takeEvery(types.CLONE_CALENDAR_REQUEST, cloneCalendarSaga);
  yield takeEvery(types.DELETE_CALENDAR_REQUEST, deleteCalendarSaga);
  yield takeEvery(types.SAVE_CALENDAR_REQUEST, saveCalendarSaga);
  yield takeEvery(types.FETCH_FORMS_REQUEST, fetchFormsSaga);
  yield takeEvery(types.FETCH_KAPPS_REQUEST, fetchKappsSaga);
  yield takeEvery(types.FETCH_ATTRIBUTES_REQUEST, fetchAttributesSaga);
}
