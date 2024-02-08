import React, { Component } from 'react';
import classNames from 'classnames';
import { Editor, Viewer } from '@toast-ui/react-editor';

export class Markdown extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  handleChange = () => {
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(this.ref.current.getInstance().getMarkdown());
    }
    this.props.updateMarkdown(this.ref.current.getInstance().getMarkdown());
  };

  render() {
    const {
      initialValue,
      onChange,
      disabled,
      className,
      ...editorProps
    } = this.props;
    return (
      <div
        className={classNames(className, {
          'markdown-editor': !disabled,
          'markdown-viewer': !!disabled,
        })}
      >
        {!disabled ? (
          <Editor
            height="auto"
            initialEditType="wysiwyg"
            {...editorProps}
            ref={this.ref}
            initialValue={initialValue}
            onChange={this.handleChange}
          />
        ) : (
          <Viewer
            height="auto"
            linkAttribute={{
              target: '_blank',
              contenteditable: 'false',
              rel: 'noopener noreferrer',
            }}
            initialValue={initialValue}
          />
        )}
      </div>
    );
  }
}