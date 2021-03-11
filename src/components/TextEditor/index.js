import React, { useState, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import toolbarData from './editor.config';
import { DefaultCard } from '@app/components/Cards';
import useStyles from './style';
import './style.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const TextEditor = ({ disable, docId, resources, onChange }) => {
  const classes = useStyles();
  const [editorState, setEditorState] = useState();

  useEffect(() => {
    if (resources && resources.data?.body) {
      const contentState = convertFromRaw(resources.data.body);
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    } else {
      setEditorState(EditorState.createEmpty());
    }

    if (!resources) {
      setEditorState(EditorState.createEmpty());
    }
  }, [resources, docId]);

  const handleEditorStateChange = (value) => {
    setEditorState(value);
    const currentContent = convertToRaw(value.getCurrentContent());
    onChange(currentContent);
  };
  console.log('disabled:', disable);
  return (
    <React.Fragment>
      {disable ? (
        editorState && (
          <Editor
            readOnly={disable}
            editorState={editorState}
            toolbarClassName={classes.hiddentoolbarArea}
          />
        )
      ) : (
        <DefaultCard style={classes.root}>
          <Editor
            readOnly={disable}
            toolbar={toolbarData}
            editorState={editorState}
            toolbarClassName={classes.toolbarArea}
            wrapperClassName={classes.wrapperArea}
            editorClassName={classes.editorArea}
            onEditorStateChange={handleEditorStateChange}
          />
        </DefaultCard>
      )}
    </React.Fragment>
  );
};

export default TextEditor;
