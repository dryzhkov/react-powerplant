import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {MuiThemeProvider} from 'material-ui/styles';
import {App} from './components/App';

export class ThemedApp extends React.Component<{}, {}> {
  render() {
    return (
      <MuiThemeProvider>
        <App />
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(
  <ThemedApp />, 
  document.getElementById('root')
);
