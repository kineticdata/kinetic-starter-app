import React, { useEffect, useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';

import { useForm } from '../hooks';
import { Link, useParams } from 'react-router-dom';
import { CALENDAR_KAPP_SLUG } from '../constants';

export const CalendarSettings = () => {
  const kappSlug = CALENDAR_KAPP_SLUG;
  const { formSlug } = useParams();
  // Fetch the form.
  const form = useForm(kappSlug, formSlug);
  // Setup Default Code
  const [code, setCode] = useState([]);

  // The form Description is what I have a bunch of JSON in. I want to be able to parse the JSON into a text editor and then 
  // let the builder configure it. When they hit save, we should be updating the form's description which is where we are 
  // keeping the JSON configuration.


  const placeholder =
  {
    "name": "Calendar Name",
    "description": "Calendar Description",
    "defaultView": "Month",
    "eventForm": {},
    "newDateForm": {},
    "relatedData ": {},
    "sources": [{
        "name": "Source Name",
        "slug": "Source Slug",
        "coreMapping": {
            "title": ["Change Location"],
            "start": "Scheduled Start Date",
            "end": "Scheduled End Date"
        },
        "filterMapping": [{
            "name": "Impact",
            "value": "Impact",
            "values": {}
        }, {
            "name": "Change Location",
            "value": "Change Location",
            "values": {}
        }],
        "source": {
            "kappSlug": "calendar",
            "formSlug": "test-calendar-1",
            "bridgedResourceName": "By Start and End Date",
            "parameters": {
                "Start Date": {
                    "fieldName": "Start Date"
                },
                "End Date": {
                    "fieldName": "End Date"
                }
            }
        },
        "valid": true,
        "detailMapping": {
            "Id": "Id",
            "Impact": "Impact",
            "Change Location": "Change Location",
            "Start Date": "Scheduled Start Date",
            "End Date": "Scheduled End Date"
        }
    }]
}

  return (
    <div className="row">
      <div className="col-8">
        <CodeEditor
          value={code}
          language="json"
          placeholder={placeholder}
          onChange={evn => setCode(evn.target.value)}
          padding={15}
          style={{
            fontSize: 12,
            backgroundColor: '#f5f5f5',
            fontFamily:
              'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          }}
        />
        <button>Save</button>
      </div>
      <div className="col-4">
        <h2>Help</h2>
        <p>I'll put a bunch of help text here</p>
        </div>
    </div>
  );
};
