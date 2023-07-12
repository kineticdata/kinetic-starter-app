import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { CoreForm } from '@kineticdata/react';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { CALENDAR_KAPP_SLUG } from '../constants';
import querystring from 'query-string';

const valuesFromQueryParams = queryParams => {
  const params = querystring.parse(queryParams);
  return Object.entries(params).reduce((values, [key, value]) => {
    if (key.startsWith('values[')) {
      const vk = key.match(/values\[(.*?)\]/)[1];
      return { ...values, [vk]: value };
    }
    return values;
  }, {});
};

export const Form = ({ edit, profile }) => {
  const history = useHistory();
  const { search } = useLocation();
  const { formSlug, id } = useParams();
  const kappSlug = CALENDAR_KAPP_SLUG;

  const handleCreated = useCallback(
    ({ submission }) => {
      const { coreState, currentPage, displayedPage, id } = submission;
      if (
        coreState === 'Draft' ||
        (currentPage &&
          (!displayedPage || displayedPage.type === 'confirmation'))
      ) {
        // For Multipage forms
        history.push(`/kapps/${kappSlug}/forms/${formSlug}/submissions/${id}`);
      } else {
        history.push(`/kapps/${kappSlug}/forms/${formSlug}/submissions`);
      }
    },
    [kappSlug, formSlug, history],
  );

  // Form Saves
  const handleSave = useCallback(
    ({ history }) => {
      history.push(`/kapps/${kappSlug}/forms/${formSlug}/submissions`);
    },
    [kappSlug, formSlug],
  );

  return (
    <div>
      {profile.spaceAdmin && <Link to={`/calendar/${formSlug}/settings`}>Settings</Link>}
      {id ? (
        <CoreForm
          submission={id}
          onCompleted={handleSave}
          onUpdated={handleSave}
          review={!edit}
        />
      ) : (
        <CoreForm
          kapp={kappSlug}
          form={formSlug}
          onCreated={handleCreated}
          values={valuesFromQueryParams(search)}
        />
      )}
    </div>
  );
};
