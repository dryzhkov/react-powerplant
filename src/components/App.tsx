import * as React from 'react';
import {AppBar} from 'material-ui';
import {PowerPlant} from './PowerPlant';

export class App extends React.Component<{}, {}> {
  render() {
    return (
      <div>
        <AppBar
          title="Power Plant Simulator"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          style={{backgroundColor:'#61AAB3'}}
        />
        <PowerPlant />
      </div>
    );
  }
}