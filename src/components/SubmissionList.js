import React from 'react';
import { deleteSubmission } from '@kineticdata/react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useCrumbs, useForm, useSubmissionsList } from '../hooks';

export const SubmissionList = ({ setCrumbs }) => {
  const { kappSlug, formSlug } = useParams();

  // fetch the list of submissions
  const [submissions, paging, refetchList] = useSubmissionsList(
    kappSlug,
    formSlug,
  );

  // Fetch the form.
  const form = useForm(kappSlug, formSlug);
  useCrumbs({ setCrumbs, form, kappSlug, formSlug });

  const handleDelete = id => () => {
    deleteSubmission({ id }).then(() => refetchList());
  };

  return (
    <>
      <div className="header-title-container">
        <h1>{form && `${form.name}: `}Submissions</h1>
        <Link to={`/kapps/${kappSlug}/forms/${formSlug}`}>
          <button className="btn">Submit New</button>
        </Link>
      </div>
      <table className="table" cellPadding={0} cellSpacing={0}>
        <thead>
          <tr>
            <th>Label | Handle</th>
            <th>Submitted By</th>
            <th>Core State</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {!submissions && (
            <tr>
              <td colSpan="4">{paging.loading ? 'Loading...' : 'Error!'}</td>
            </tr>
          )}
          {submissions &&
            submissions.map(submission => (
              <tr key={submission.id}>
                <td>
                  <Link
                    to={`/kapps/${kappSlug}/forms/${formSlug}/submissions/${
                      submission.id
                    }${submission.coreState === 'Draft' ? '/edit' : ''}`}
                  >
                    {submission.label || submission.id}
                  </Link>
                  <br />
                  <small>{submission.handle}</small>
                </td>
                <td>{submission.submittedBy}</td>
                <td>{submission.coreState}</td>
                <td className="actions-cell">
                  <Link
                    to={`/kapps/${kappSlug}/forms/${formSlug}/submissions/${
                      submission.id
                    }${submission.coreState === 'Draft' ? '/edit' : ''}`}
                  >
                    <button className="btn">
                      {submission.coreState === 'Draft' ? 'Edit' : 'Review'}
                    </button>
                  </Link>
                  <button className="btn" onClick={handleDelete(submission.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          {submissions && submissions.length === 0 && (
            <tr>
              <td colSpan="4">There are no Submissions to display</td>
            </tr>
          )}
        </tbody>
      </table>
      {submissions && (
        <div className="pagination-buttons">
          <button
            className="pagination-button"
            disabled={paging.loading || !paging.previousPage}
            onClick={paging.previousPage}
          >
            Previous Page
          </button>
          <span className="pagination-text">
            {!paging.loading
              ? `${paging.startIndex} - ${paging.endIndex}`
              : '...'}
          </span>
          <button
            className="pagination-button"
            disabled={paging.loading || !paging.nextPage}
            onClick={paging.nextPage}
          >
            Next Page
          </button>
        </div>
      )}
    </>
  );
};
