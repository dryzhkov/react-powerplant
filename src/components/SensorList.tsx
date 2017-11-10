import * as React from 'react';
import {ISensor, ISensorProps} from '../common/interfaces';
import {RaisedButton, Chip, Paper, Avatar} from 'material-ui';

interface ISensorListState {
  sensors: ISensor[];
}

class SensorList extends React.Component<ISensorProps, ISensorListState> {
  private styles;
  private sensorIdCounter: number;
  private readonly SENSOR_INTERVAL = 2000;
  private readonly MIN_VAL = 10;
  private readonly MAX_VAL = 100;

  constructor(props) {
    super(props);
    this.state = { 
      sensors: []
    };

    this.styles = {
      sensor: {
        margin: 4,
      },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: 12
      },
      addButton: {
        margin: 12,
        float:'right'
      },
      paperWrapper: {
        overflow: 'hidden',
        width: '20%',
        marginRight: '5%',
        minWidth: '220px'
      }
    };

    this.sensorIdCounter = 0;
  }

  addSensor = () => {
    let existingSensors = this.state.sensors.slice();
    ++this.sensorIdCounter;
    
    let newSensor = {
      id: this.sensorIdCounter,
      label: 'Sensor ' + this.sensorIdCounter,
      interval: null
    };

    newSensor.interval = setInterval(()=>{
      this.sendData(newSensor.label);
    }, this.SENSOR_INTERVAL);
  
    existingSensors.push(newSensor);
    this.setState({sensors: existingSensors});
    
    // notify
    this.props.onChange(existingSensors);
  }

  sendData = (label: string) => {
    let sensorVal = this.calcValue();
    this.props.notifyBroker(label, sensorVal);
  }

  private calcValue(): number {
    let randVal = Math.floor(Math.random() * (this.MAX_VAL - this.MIN_VAL)) + this.MIN_VAL;
    return randVal;
  }

  removeSensor = (id) => {
    let existingSensors = this.state.sensors;
    const indexToDelete = existingSensors.map((sensor) => sensor.id).indexOf(id);
    let sensorToDelete = existingSensors[indexToDelete];
    clearInterval(sensorToDelete.interval);
    existingSensors.splice(indexToDelete, 1);
    this.setState({sensors: existingSensors});

    // notify
    this.props.onChange(existingSensors);
  };

  renderSensor(data) {
    return (
      <Chip
        key={data.id}
        onRequestDelete={() => this.removeSensor(data.id)}
        style={this.styles.sensor}
      >
        <Avatar src="images/sensor.jpg" />
        {data.label}
      </Chip>
    );
  }

  render() {
    return (
      <Paper
        zDepth={2}
        style={this.styles.paperWrapper}>
        <RaisedButton
          label="Add"
          primary={true}
          style={this.styles.addButton}
          onClick={this.addSensor} />
        <h3>Sensors</h3>
        <div style={this.styles.wrapper}>
          {this.state.sensors.map(this.renderSensor, this)}
        </div>
      </Paper>
    );
  }
}

export { SensorList };