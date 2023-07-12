import React, { useEffect, useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';

import { useForm } from '../hooks';
import { Link, useParams } from 'react-router-dom';
import { CALENDAR_KAPP_SLUG } from '../constants';
import exampleConfig from './calendar/exampleConfig.json'

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


  const placeholder = JSON.stringify(exampleConfig, null, 2);
  
  return (
    <div className="row">
      <div className="col-8">
        <CodeEditor
          value={placeholder}
          language="json"
          placeholder={placeholder}
          onChange={evn => setCode(evn.target.value)}
          padding={15}
          data-color-mode="dark"
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
