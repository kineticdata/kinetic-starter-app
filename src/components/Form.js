import React, { useCallback } from 'react';
import { CoreForm } from '@kineticdata/react';
import { useHistory, useParams } from 'react-router-dom';
import { useCrumbs, useForm } from '../hooks';

export const Form = ({ setCrumbs, edit }) => {
  const history = useHistory();
  const { kappSlug, formSlug, id } = useParams();

  // Fetch the form.
  const form = useForm(kappSlug, formSlug);

  // set navigation breadcrumbs using fetched form info
  useCrumbs({ setCrumbs, form, kappSlug, formSlug, id, isNew: !id });

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
  const handleSave = useCallback(() => {
    history.push(`/kapps/${kappSlug}/forms/${formSlug}/submissions`);
  }, [kappSlug, formSlug]);

  return (
    <div>
      <h1>{form && form.name}</h1>
      {id ? (
        <CoreForm
          submission={id}
          onCompleted={handleSave}
          onUpdated={handleSave}
          review={!edit}
        />
      ) : (
        <CoreForm kapp={kappSlug} form={formSlug} onCreated={handleCreated} />
      )}
    </div>
  );
};
