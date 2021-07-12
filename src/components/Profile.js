import React, { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ProfileForm } from '@kineticdata/react';

// spec for change password field
const ChangePasswordField = props =>
  props.visible && (
    <div className="row">
      <div className="col-12">
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={() => props.onChange({ target: { checked: !props.value } })}
        >
          {props.value ? 'Cancel Change Password' : 'Change Password'}
        </button>
      </div>
    </div>
  );

export const Profile = ({ profile, ...props }) => {
  const history = useHistory();

  // clear navigation breadcrumbs on load
  useEffect(() => props.setCrumbs([]), [props.setCrumbs]);

  // Form Saves
  const handleCompleted = useCallback(() => {
    history.push(`/`);
  });

  const handleUpdated = useCallback(() => {
    history.push(`/`);
  });

  return (
    <div className="profile-page">
      <h1>Edit Profile</h1>
      <div className="profile-form">
        <ProfileForm
          profile={profile}
          fieldSet={[
            'email',
            'displayName',
            'preferredLocale',
            'timezone',
            'password',
            'passwordConfirmation',
            'changePassword',
          ]}
          alterFields={{
            changePassword: {
              component: ChangePasswordField,
            },
            // Typeahead not implemented
            // preferredLocale: {
            //   component: SelectTypeaheadField,
            // },
            // timezone: {
            //   component: SelectTypeaheadField,
            // },
          }}
          onCompleted={handleCompleted}
          onUpdated={handleUpdated}
        />
      </div>
    </div>
  );
};
