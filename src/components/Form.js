import React, { useCallback, useEffect, useState } from 'react';
import { CoreForm, fetchForm } from '@kineticdata/react';
import {
  // useHistory,
  // useLocation,
  useParams,
} from 'react-router-dom';

// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

export const Form = props => {
  // const history = useHistory();
  // const query = useQuery();
  const { kappSlug, formSlug, id } = useParams();

  // fetch and set form
  const [form, setForm] = useState();
  useEffect(() => {
    async function fetchFormRequest() {
      let response = await fetchForm({
        kappSlug,
        formSlug,
        include: 'kapp',
      });
      setForm(response.form);
    }
    fetchFormRequest();
  }, []);

  // set navigation breadcrumbs using fetched form info
  useEffect(() => {
    props.setCrumbs([
      {
        path: '/kapps',
        name: 'Kapps',
      },
      {
        path: `/kapps/${kappSlug}/forms`,
        name: `${form ? form.kapp.name : 'Forms'}`,
      },
      {
        path: `/kapps/${kappSlug}/forms/${formSlug}/submissions`,
        name: `${form ? form.name : 'Form'}`,
      },
    ]);
  }, [form, props.setCrumbs]);

  const handleCreated = useCallback(
    ({ submission, history }) => {
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
    [kappSlug, formSlug],
  );

  // Form Saves
  const handleCompleted = useCallback(
    ({ history }) => {
      history.push(`/kapps/${kappSlug}/forms/${formSlug}/submissions`);
    },
    [kappSlug, formSlug],
  );

  const handleUpdate = useCallback(
    ({ history }) => {
      history.push(`/kapps/${kappSlug}/forms/${formSlug}/submissions`);
    },
    [kappSlug, formSlug],
  );

  return (
    <div>
      <h1>{form && form.name}</h1>
      {id ? (
        <CoreForm
          submission={id}
          onCompleted={handleCompleted}
          onUpdated={handleUpdate}
          review={true}
          // review={query.get('mode') === 'review'} <--- not implemented
        />
      ) : (
        <CoreForm kapp={kappSlug} form={formSlug} onCreated={handleCreated} />
      )}
    </div>
  );
};
