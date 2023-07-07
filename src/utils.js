import isarray from 'isarray';
import { all, fork } from 'redux-saga/effects';
import moment from 'moment';
import md5 from 'md5';
import { COLORS } from './constants';

export const zip = (array1, array2) =>
  array1.reduce(
    (reduction, key, i) => ({ ...reduction, [key]: array2[i] }),
    {},
  );

// Parameterize this for 'kapp' in addition to category.
export const namespace = (category, action) =>
  `@kd/common/${category}/${action}`;
export const namespaceBuilder = prefix => action => `@kd/${prefix}/${action}`;
export const noPayload = type => () => ({ type });
export const withPayload = (type, ...names) => (...data) =>
  names.length === 0
    ? { type, payload: data[0] }
    : { type, payload: zip(names, data) };

export function combineSagas(allSagas) {
  return function* combinedSagas() {
    yield all(allSagas.map(s => fork(s)));
  };
}

export const callBack = ({ payload, response, error, completed = true }) => {
  if (!payload) return;
  if (response && typeof payload.success === 'function') {
    payload.success(response);
  }
  if (error && typeof payload.failure === 'function') {
    payload.failure(error);
  }
  if (completed && typeof payload.complete === 'function') {
    payload.complete();
  }
};

// Used with @reach/router Link's getProps to add active class to current links
export const addActiveLinkClass = defaultClass => ({ isCurrent }) => ({
  className: `${defaultClass} ${isCurrent ? 'active' : ''}`,
});

/**
 * Given a model and an attribute name returns the value of that attribute.
 * Should return undefined if attributes are missing or there is no attribute
 * value for the given attrName. It supports both attribute structures (arrays
 * that are returned directly from the API and objects that are returned by the
 * helpers in @kineticdata/react).
 *
 * @param model: { attributes }
 * @param attrName
 * @param defaultValue
 */
export const getAttributeValue = (
  { attributes, attributesMap },
  attrName,
  defaultValue,
) =>
  (attributesMap
    ? attributesMap[attrName] && attributesMap[attrName][0]
    : isarray(attributes)
      ? attributes.filter(a => a.name === attrName).map(a => a.values[0])[0]
      : attributes && attributes[attrName] && attributes[attrName][0]) ||
  defaultValue;

export const getProfileAttributeValue = (
  { profileAttributes, profileAttributesMap },
  ...args
) =>
  getAttributeValue(
    { attributes: profileAttributes, attributesMap: profileAttributesMap },
    ...args,
  );

export const getAttributeValues = (
  { attributes, attributesMap },
  attrName,
  defaultValue = [],
) => {
  const valuesArray = attributesMap
    ? attributesMap[attrName]
    : isarray(attributes)
      ? attributes.filter(a => a.name === attrName).map(a => a.values)[0]
      : attributes && attributes[attrName];
  return !valuesArray || valuesArray.length === 0 ? defaultValue : valuesArray;
};

export const getProfileAttributeValues = (
  { profileAttributes, profileAttributesMap },
  ...args
) =>
  getAttributeValues(
    { attributes: profileAttributes, attributesMap: profileAttributesMap },
    ...args,
  );

export const hasAttributeValue = (
  { attributes, attributesMap },
  attrName,
  value,
  ignoreCase,
  matchAll,
) => {
  const valuesArray = attributesMap
    ? attributesMap[attrName]
    : isarray(attributes)
      ? attributes.filter(a => a.name === attrName).map(a => a.values)[0]
      : attributes && attributes[attrName];
  if (!valuesArray || valuesArray.length === 0) {
    return false;
  }
  const hasValue = (a, v) =>
    !!ignoreCase
      ? a.map(i => i.toLowerCase()).includes(v.toLowerCase())
      : a.includes(v);
  if (typeof value === 'function') {
    return value(valuesArray);
  } else if (isarray(value)) {
    return !!matchAll
      ? value.every(v => hasValue(valuesArray, v))
      : value.some(v => hasValue(valuesArray, v));
  } else {
    return hasValue(valuesArray, value);
  }
};

export const hasProfileAttributeValue = (
  { profileAttributes, profileAttributesMap },
  ...args
) =>
  hasAttributeValue(
    { attributes: profileAttributes, attributesMap: profileAttributesMap },
    ...args,
  );

export const hasAttributeDefinition = (attributeDefinitions, attrName) => {
  return isarray(attributeDefinitions)
    ? !!attributeDefinitions.find(a => a.name === attrName)
    : !!(attributeDefinitions && attributeDefinitions[attrName]);
};

export const hasProfileAttributeDefinition = (
  { userProfileAttributeDefinitions },
  attrName,
) => {
  return isarray(userProfileAttributeDefinitions)
    ? !!userProfileAttributeDefinitions.find(def => def.name === attrName)
    : false;
};

export const isMemberOf = (profile, name) => {
  const matchingMembership = profile.memberships.find(
    membership => membership.team.name === name,
  );
  return matchingMembership !== undefined;
};

export const isMemberOfDescendant = (profile, name) => {
  const matchingMembership = profile.memberships.find(membership =>
    membership.team.name.startsWith(`${name}::`),
  );
  return matchingMembership !== undefined;
};

export const getTeams = profile => {
  const matchingMemberships = profile.memberships.filter(
    membership =>
      membership.team.name !== 'Role' &&
      !membership.team.name.startsWith('Role::'),
  );
  return matchingMemberships
    ? matchingMemberships.map(membership => membership.team)
    : [];
};

export const getRoles = profile => {
  const matchingMemberships = profile.memberships.filter(membership =>
    membership.team.name.startsWith('Role::'),
  );
  return matchingMemberships
    ? matchingMemberships.map(membership => membership.team)
    : [];
};

const getSpaceConfig = (space, name, val) => {
  if (!space) {
    throw new Error(
      'getConfig did not receive space, it must be included on ' +
        'the kapp or manually passed.',
    );
  }
  if (!space.attributes) {
    throw new Error('getConfig failed, space must include attributes.');
  }
  // If the space has a value for the desired attribute return it otherwise
  // return the default value.
  return getAttributeValue(space, name, val);
};

const getKappConfig = (kapp, space, name, val) => {
  if (!kapp) {
    throw new Error(
      'getConfig did not receive kapp, it must be included on ' +
        'the form or manually passed.',
    );
  } else if (!kapp.attributes) {
    throw new Error('getConfig failed, kapp must include attributes');
  }
  // If the kapp has a value for the desired attribute return it otherwise
  // check the space.
  return (
    getAttributeValue(kapp, name) ||
    getSpaceConfig(space || kapp.space, name, val)
  );
};

const getFormConfig = (form, kapp, space, name, val) => {
  if (!form) {
    throw new Error(
      'getConfig did not receive form, it must be included on ' +
        'the submission or manually passed.',
    );
  } else if (!form.attributes) {
    throw new Error('getConfig failed, form must include attributes');
  }
  // If the form has a value for the desired attribute return it otherwise
  // the default value.
  return (
    getAttributeValue(form, name) ||
    getKappConfig(kapp || form.kapp, space, name, val)
  );
};

const getSubmissionConfig = (submission, form, kapp, space, name, def) => {
  if (!submission.values) {
    throw new Error(
      'Cannot perform getConfig when submission does not include values.',
    );
  }
  return (
    submission.values[name] ||
    getFormConfig(form || submission.form, kapp, space, name, def)
  );
};

/**
 * Given a model (via the submission / form / kapp / space options) will look
 * the given configuration value (values on a submission and attribute values on
 * the others). If not found on the present model it will propagate upwards
 * until it is found otherwise it will return an option default or undefined.
 *
 * @param name
 * @param defaultValue
 * @param submission
 * @param form
 * @param kapp
 * @param space
 */
export const getConfig = ({
  name,
  defaultValue,
  submission,
  form,
  kapp,
  space,
}) => {
  if (submission) {
    return getSubmissionConfig(
      submission,
      form,
      kapp,
      space,
      name,
      defaultValue,
    );
  } else if (form) {
    return getFormConfig(form, kapp, space, name, defaultValue);
  } else if (kapp) {
    return getKappConfig(kapp, space, name, defaultValue);
  } else if (space) {
    return getSpaceConfig(space, name, defaultValue);
  } else {
    throw new Error(
      'getConfig must be called with at least one of: ' +
        'submission, form, kapp, space.',
    );
  }
};

export const calculateDateRange = (now, range) => {
  if (!range) {
    throw new Error('Cannot calculate date range for blank value');
  } else if (typeof range === 'string') {
    const number = parseInt(range.replace('days', ''));
    return {
      start: now
        .clone()
        .startOf('day')
        .subtract(number, 'days')
        .toISOString(),
      end: now.toISOString(),
    };
  } else if (typeof range === 'object') {
    if (!range.start) {
      throw new Error('Cannot calculate date range with blank start value');
    }
    return {
      start: moment(range.start).toISOString(),
      end: (range.end ? moment(range.end).add(1, 'day') : now).toISOString(),
    };
  } else {
    throw new Error(`Invalid range specified ${range}`);
  }
};

export const getColorValue = string => {
  const colors = [
    COLORS.blue,
    COLORS.blueSky,
    COLORS.blueLake,
    COLORS.blueSlate,
    COLORS.green,
    COLORS.greenGrass,
    COLORS.greenTeal,
    COLORS.orange,
    COLORS.orangeKinops,
    COLORS.purple,
    COLORS.redPurple,
    COLORS.red,
    COLORS.redRose,
    COLORS.sunflower,
    COLORS.yellow,
  ];
  return string ? colors[parseInt(md5(string), 16) % colors.length] : colors[5];
};

export const getColor = (object, defaultValue) =>
  getAttributeValue(
    object,
    'Color',
    defaultValue || object.slug ? getColorValue(object.slug) : COLORS.default,
  );

export const getIcon = (object, defaultValue) => {
  const iconAttribute = getAttributeValue(
    object,
    'Icon',
    defaultValue || 'square-o',
  );
  return iconAttribute.indexOf('fa-') === 0
    ? iconAttribute.slice('fa-'.length)
    : iconAttribute;
};

export const buildTeamHierarchy = name => {
  const segments = name.split('::');
  let parent = null;
  let ancestors = [];
  segments.forEach(segment => {
    const item = {
      localName: segment,
      name: parent ? `${parent.name}::${segment}` : segment,
      slug: md5(parent ? `${parent.name}::${segment}` : segment),
      parent,
      ancestors,
    };
    parent = item;
    ancestors = [...ancestors, item];
  });
  return parent;
};

export const isKappVisible = kapp =>
  kapp &&
  !hasAttributeValue(kapp, 'Hidden', ['True', 'Yes'], true) &&
  (!kapp.authorization || !!kapp.authorization['Display']);

export const isKappManageable = kapp =>
  kapp &&
  !hasAttributeValue(kapp, 'Hidden', ['True', 'Yes'], true) &&
  kapp.authorization &&
  !!kapp.authorization['Modification'];