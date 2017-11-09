import * as React from 'react';
import {Paper} from 'material-ui';
import {LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts';

interface ICollectorState {
  isOnline: boolean;
  data: any[];
  labels: string[];
}

interface ICollectorProps {
  labels: string[];
  data: any[];
}

export class DataCollector extends React.Component<ICollectorProps, ICollectorState> {
  private styles;
  private colorMap: {[sensorLabel:string]: string};
  constructor(props) {
    super(props)
    this.state = {
      isOnline: true,
      data: [],
      labels: []
    };

    this.styles = {};
    this.colorMap = {};
  }

  componentWillReceiveProps(newProps: ICollectorProps) {
    this.setState({
      isOnline: this.state.isOnline,
      data: newProps.data,
      labels: newProps.labels
    });
  }

  renderLine(data) {
    if (!this.colorMap[data]) {
      this.colorMap[data] = this.getRandomHexColor();
    }

    return (
      <Line type='monotone' dataKey={data} stroke={this.colorMap[data]}/>
    );
  }

  private getRandomHexColor() {
    let text = '#';
    const possible = 'abcdef0123456789';
  
    for (let i = 0; i < 6; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  render() {

    return (
      <Paper zDepth={2}>
        <h3>Data Collector</h3>
        <LineChart width={900} height={600} data={this.state.data}>
          {this.state.labels.map(this.renderLine, this)}
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </Paper>
    );
  }
}