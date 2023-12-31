import { useRef, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';
import { docco, dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import {
  useEditorContext,
  Editor,
  type Theme
} from '../Editor';
import Layout from '../Layout';
import { useTheme } from '../Theme';
import colors from '../const/colors';

const MainScreen = () => {
  const editor = useRef();
  const db = useRef<SQLite.SQLiteDatabase>();
  const { setEditorRef } = useEditorContext();
  const { darkMode } = useTheme();

  useEffect(() => {
    setEditorRef(editor);
  }, [editor.current]);

  useEffect(() => {
    db.current = SQLite.openDatabase('notes.db');
    db.current.transaction(tx => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS notes(id INTEGER PRIMARY KEY
                     AUTOINCREMENT, name VARCHAR(255), content TEXT, draft
                     TEXT, directory INTEGER`);
      tx.executeSql(`CREATE TABLE IF NOT EXISTS directories(id INTEGER PRIMARY
                     KEY AUTOINCREMENT, name VARCHAR(255), parent INTEGER
                     DEFAULT NULL`);
    });
  }, [db]);

  const style = {
    backgroundColor: darkMode ? colors.dark.main : colors.light.main
  };

  const theme: Theme = {
    ...colors[darkMode ? 'dark' : 'light'].content,
    code: {
      type: 'hljs',
      style: darkMode ? dracula : docco
    }
  };

  return (
    <Layout>
      <Editor
        ref={editor}
        style={style}
        theme={theme}
        initValue={NOTE} />
    </Layout>
  );
};

export default MainScreen;

const NOTE = `# HEADER 1

\`\`\`javascript
function hello(name) {
   return \`hello $\{name}\`;
}
\`\`\`

## Header 2

This is some text

`;
