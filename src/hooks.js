// fetch and set form
import { useCallback, useEffect, useState } from 'react';
import {
  fetchForm,
  fetchForms,
  fetchKapp,
  fetchKapps,
  fetchProfile,
  fetchSpace,
  fetchBridgedResource,
  searchSubmissions,
} from '@kineticdata/react';

export const useForm = (kappSlug, formSlug) => {
  const [form, setForm] = useState(null);

  useEffect(() => {
    const fetchFormRequest = async () => {
      const response = await fetchForm({ kappSlug, formSlug, include: 'kapp' });
      setForm(response.form);
    };

    fetchFormRequest().catch(console.error);
  }, [kappSlug, formSlug, setForm]);

  return form;
};

export const useKapp = kappSlug => {
  const [kapp, setKapp] = useState(null);
  useEffect(() => {
    const fetchKappRequest = async () => {
      const response = await fetchKapp({ kappSlug });
      setKapp(response.kapp);
    };
    fetchKappRequest().catch(console.error);
  }, [kappSlug]);

  return kapp;
};

export const useSpace = () => {
  const [space, setSpace] = useState(null);
  useEffect(() => {
    const fetchSpaceRequest = async () => {
      const response = await fetchSpace();
      setSpace(response.space);
    };
    fetchSpaceRequest().catch(console.error);
  }, []);

  return space;
};

export const useProfile = loggedIn => {
  const [profile, setProfile] = useState();
  useEffect(() => {
    const fetchProfileRequest = async () => {
      const response = await fetchProfile({ include: 'authorization' });
      setProfile(response.profile);
    };
    fetchProfileRequest().catch(console.error);
  }, [loggedIn]);

  return profile;
};

export const useBridgedResource = (
  kappSlug,
  formSlug,
  bridgedResourceName,
  values,
) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchFormRequest = async () => {
      const response = await fetchBridgedResource({
        kappSlug,
        formSlug,
        bridgedResourceName,
        values,
      });
      setData(response.records || response.record);
    };

    fetchFormRequest().catch(console.error);
  }, [kappSlug, formSlug, bridgedResourceName, values, setData]);

  return data;
};

export const useFormsList = (kappSlug, pageSize = 25) => {
  const [forms, setForms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paging, pageToken, updateNextPageToken] = usePaging();

  useEffect(() => {
    setLoading(true);
    const fetchFormsRequest = async () => {
      const response = await fetchForms({
        kappSlug,
        pageToken,
        include: 'details',
        limit: pageSize,
      });
      setForms(response.forms);
      updateNextPageToken(response.nextPageToken);
    };

    fetchFormsRequest()
      .catch(console.error)
      .then(() => setLoading(false));
  }, [kappSlug, pageToken, pageSize, updateNextPageToken]);

  return [
    forms,
    {
      loading,
      ...paging,
      startIndex:
        paging.pageNumber * pageSize + (forms && forms.length > 0 ? 1 : 0),
      endIndex:
        paging.pageNumber * pageSize +
        (forms && forms.length > 0 ? forms.length : 0),
    },
  ];
};

export const useKappsList = (pageSize = 25) => {
  const [kapps, setKapps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paging, pageToken, updateNextPageToken] = usePaging();

  useEffect(() => {
    setLoading(true);
    const fetchKappsRequest = async () => {
      const response = await fetchKapps({
        pageToken,
        include: 'details',
        limit: pageSize,
      });
      setKapps(response.kapps);
      updateNextPageToken(response.nextPageToken);
    };

    fetchKappsRequest()
      .catch(console.error)
      .then(() => setLoading(false));
  }, [pageToken, pageSize, updateNextPageToken]);

  return [
    kapps,
    {
      loading,
      ...paging,
      startIndex:
        paging.pageNumber * pageSize + (kapps && kapps.length > 0 ? 1 : 0),
      endIndex:
        paging.pageNumber * pageSize +
        (kapps && kapps.length > 0 ? kapps.length : 0),
    },
  ];
};

export const useSubmissionsList = (
  kappSlug,
  formSlug,
  search,
  pageSize = 25,
) => {
  const [submissions, setSubmissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paging, pageToken, updateNextPageToken] = usePaging();
  // Use a variable to store a timestamp that can be updated to force the below
  // useEffect to fire
  const [refetch, setRefetch] = useState(new Date().getTime());

  useEffect(() => {
    // The include property is required in the search object
    const { include = ['details'], ...searchParams } = search || {};

    setLoading(true);
    const fetchSubmissionsRequest = async () => {
      const response = await searchSubmissions({
        kapp: kappSlug,
        form: formSlug,
        search: { ...searchParams, include },
        pageToken,
        limit: pageSize,
      });
      setSubmissions(response.submissions);
      updateNextPageToken(response.nextPageToken);
    };

    fetchSubmissionsRequest()
      .catch(console.error)
      .then(() => setLoading(false));
  }, [
    kappSlug,
    formSlug,
    search,
    pageToken,
    pageSize,
    updateNextPageToken,
    refetch,
  ]);

  const refetchList = useCallback(() => {
    setRefetch(new Date().getTime());
  }, []);

  return [
    submissions,
    {
      loading,
      ...paging,
      startIndex:
        paging.pageNumber * pageSize +
        (submissions && submissions.length > 0 ? 1 : 0),
      endIndex:
        paging.pageNumber * pageSize +
        (submissions && submissions.length > 0 ? submissions.length : 0),
    },
    refetchList,
  ];
};

const usePaging = () => {
  const [paging, setPaging] = useState({
    pageToken: null,
    nextPageToken: null,
    previousPageTokens: [],
  });

  const updateNextPageToken = useCallback(nextPageToken => {
    setPaging(state => ({ ...state, nextPageToken }));
  }, []);

  const nextPage = useCallback(() => {
    setPaging(state => ({
      pageToken: state.nextPageToken,
      nextPageToken: null,
      previousPageTokens: [...state.previousPageTokens, state.pageToken],
    }));
  }, []);

  const previousPage = useCallback(() => {
    setPaging(state => ({
      pageToken: state.previousPageTokens[state.previousPageTokens.length - 1],
      nextPageToken: null,
      previousPageTokens: state.previousPageTokens.slice(0, -1),
    }));
  }, []);

  return [
    {
      pageNumber: paging.previousPageTokens.length,
      nextPage: !!paging.nextPageToken ? nextPage : undefined,
      previousPage:
        paging.previousPageTokens.length > 0 ? previousPage : undefined,
    },
    paging.pageToken,
    updateNextPageToken,
  ];
};

export const useCrumbs = ({
  kappSlug,
  kapp,
  formSlug,
  form,
  id,
  isNew,
  setCrumbs,
}) => {
  useEffect(() => {
    const result =
      // The crumbs provide a kapp slug, form slug, and submission id, indicating
      // we're viewing a specific submission.
      kappSlug && formSlug && (id || isNew)
        ? [
            {
              path: '/kapps',
              name: 'Kapps',
            },
            {
              path: `/kapps/${kappSlug}/forms`,
              name: `${kapp ? kapp.name : form ? form.kapp.name : 'Forms'}`,
            },
            {
              path: `/kapps/${kappSlug}/forms/${formSlug}/submissions`,
              name: `${form ? form.name : 'Form'}`,
            },
          ]
        : // Provided a kapp slug and a form slug, meaning we're looking at a list
        // of submissions.
        kappSlug && formSlug
        ? [
            {
              path: '/kapps',
              name: 'Kapps',
            },
            {
              path: `/kapps/${kappSlug}/forms`,
              name: `${kapp ? kapp.name : form ? form.kapp.name : 'Forms'}`,
            },
          ]
        : // Provided just a kappSlug, which means we're viewing a kapp.
        kappSlug
        ? [
            {
              path: '/kapps',
              name: 'Kapps',
            },
          ]
        : [];

    setCrumbs(result);
  }, [kappSlug, kapp, formSlug, form, id, isNew, setCrumbs]);
};
