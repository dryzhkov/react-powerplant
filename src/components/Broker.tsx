import * as React from 'react';
import {Paper, Chip, Toggle, CircularProgress} from 'material-ui';
import {IBrokerMessage} from '../common/interfaces';

interface IBrokerProps {
  messages: IBrokerMessage[];
  processInterval: number;
  onOnlineChange: (isOnline: boolean) => void;
}

interface IBrokerState {
  messages: IBrokerMessage[];
  timerProgress: number,
  isOnline: boolean
}

export class Broker extends React.Component<IBrokerProps, IBrokerState> {
  private styles;
  private timer: number;
  private timerStep: number;
  private totalSteps: number;
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      timerProgress: 0,
      isOnline: true
    };

    this.styles = {
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: 12
      },
      message: {
        margin: 4
      },
      container: {
        width: '20%',
        marginRight: '5%'
      },
      timer: {
        marginTop: 16
      },
      toggle: {
        marginTop: 16,
        marginRight: 16,
        width: 'auto'
      }
    };

    this.timerStep = 0;
  }

  componentWillReceiveProps(newProps: IBrokerProps) {
    let {messages} = newProps;

    this.setState({ messages, timerProgress: this.state.timerProgress, isOnline: this.state.isOnline });
  }

  private renderMessage(msg: IBrokerMessage) {
    return (
      <Chip
        key={msg.id}
        style={this.styles.message}
      >
        {msg.sensorLabel}: {msg.value}
      </Chip>
    );
  }

  private toggleOnline(event: object, isInputChecked: boolean) {
    if (!isInputChecked) {
      clearTimeout(this.timer);
    } else {
      this.startTimer();
    }
    
    this.props.onOnlineChange(isInputChecked);
    this.setState({ messages: this.state.messages, timerProgress: this.state.timerProgress, isOnline: isInputChecked })
  }

  progress() {
    this.timerStep += (100 / this.totalSteps);

    this.setState({timerProgress: this.timerStep, messages: this.state.messages, isOnline: this.state.isOnline});
    
    if (this.timerStep >= 100) {
      this.timerStep = 0;
    }
  }

  componentDidMount() {
    this.totalSteps = this.props.processInterval / 1000;
    this.startTimer();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  startTimer() {
    this.timerStep = 0;
    this.timer = setInterval(() => {
      this.progress();
    }, 1000);
  }

  render() {
    return (
      <Paper zDepth={2} style={this.styles.container}>
        <div style={{display:'flex', justifyContent: 'space-between'}}>
          <h3>Message Broker</h3>
          <CircularProgress
            mode="determinate"
            value={this.state.timerProgress}
            size={30}
            thickness={3.5}
            style={this.styles.timer}
          />
          <Toggle
            label="Online"
            labelPosition="right"
            defaultToggled={true}
            style={this.styles.toggle}
            onToggle={this.toggleOnline.bind(this)}
          />
        </div>
        <div style={this.styles.wrapper}>
          {this.state.messages.map(this.renderMessage, this)}
        </div>
      </Paper>
    );
  }
}