import React, { useCallback, useEffect } from 'react';
// import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ProfileForm } from '@kineticdata/react';

export const Profile = ({ profile }) => {
  //   const history = useHistory();

  useEffect(() => {
    let crumbs = [];
  }, []);

  const handleCompleted = useCallback(() => {
    // history.push(`/`);
  });

  const handleUpdate = useCallback(() => {
    // Form saves
    // history.push(`/`);
  });

  return (
    <div>
      <ProfileForm
        profile={profile}
        onCompleted={handleCompleted}
        onUpdated={handleUpdate}
      />
    </div>
  );
};
