import React, { Fragment, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { searchSubmissions, SubmissionSearch } from "@kineticdata/react";
import { WallySpinner } from "./Loading";

export const SubmissionList = () => {
  const [submissions, setSubmissions] = useState(null);
  const { kappSlug, formSlug } = useParams();

  useEffect(() => {
    async function fetchSubmissionsWrapper() {
      const { submissions } = await searchSubmissions({
        kapp: kappSlug,
        search: new SubmissionSearch().build(),
        form: formSlug,
        public: true,
        include: 'form',
      });
      setSubmissions(submissions);
    }
    fetchSubmissionsWrapper();
  }, []);
  
  return submissions ? (
    <Fragment>
      <h1>Submissions</h1>
      <ul>
        {submissions.map(submission => (
          <li key={submission.id}>
            <Link to={`/kapps/${kappSlug}/forms/${formSlug}/submissions/${submission.id}${
              submission.coreState !== "Draft" ? "?mode=review" : ""
            }`}>
              #{submission.handle} - {submission.form.name}
            </Link>
          </li>
        ))}
      </ul>
    </Fragment>
  ) : (
    <WallySpinner />
  );
};
