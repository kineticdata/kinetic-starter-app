import React, { useCallback, useEffect } from 'react';
import { CoreForm } from '@kineticdata/react';
import { useHistory, useLocation, useParams } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const Form = props => {
  const history = useHistory();
  const query = useQuery();
  const { kappSlug, formSlug, id } = useParams();

  useEffect(() => {
    let crumbs = [
      {
        path: '/kapps',
        name: 'Kapps',
      },
      {
        path: `/kapps/${kappSlug}/forms`,
        name: 'Forms',
      },
    ];

    if (query.get('mode') === 'review')
      crumbs.push({
        path: `/kapps/${kappSlug}/forms/${formSlug}/submissions`,
        name: 'Submissions',
      });

    props.setCrumbs(crumbs);
  }, [props.setCrumbs]);

  const handleCreated = useCallback(
    ({ submission }) => {
      const { coreState, currentPage, displayedPage, id } = submission;
      if (
        coreState === 'Draft' ||
        (currentPage &&
          (!displayedPage || displayedPage.type === 'confirmation'))
      ) {
        // Multipage forms
        history.push(`/kapps/${kappSlug}/forms/${formSlug}/submissions/${id}`);
      } else {
        history.push(`/kapps/${kappSlug}/forms/${formSlug}/submissions`);
      }
    },
    [kappSlug, formSlug],
  );

  const handleCompleted = useCallback(() => {
    history.push(`/kapps/${kappSlug}/forms/${formSlug}/submissions`);
  }, [kappSlug, formSlug, id]);

  const handleUpdate = useCallback(() => {
    // Form saves
    history.push(`/kapps/${kappSlug}/forms/${formSlug}/submissions`);
  }, [kappSlug, formSlug]);

  return (
    <div>
      {id ? (
        <CoreForm
          submission={id}
          onCompleted={handleCompleted}
          onUpdated={handleUpdate}
          review={query.get('mode') === 'review'}
        />
      ) : (
        <CoreForm kapp={kappSlug} form={formSlug} onCreated={handleCreated} />
      )}
    </div>
  );
};
