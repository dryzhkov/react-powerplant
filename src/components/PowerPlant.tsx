import * as React from 'react';
import {ISensor, IBrokerMessage} from '../common/interfaces';
import {SensorList} from './SensorList';
import {Broker} from './Broker';
import {DataCollector} from './Collector';

interface IPowerPlantState {
  messages: IBrokerMessage[];
  sensors: ISensor[];
  collector: {
    chartData: any[];
    sensorLabels: string[];
  }
}

export class PowerPlant extends React.Component<{}, IPowerPlantState> {
  private readonly MESSAGE_PROCCESSING_INTERVAL = 5000; // 5 sec
  private brokerInterval: number;

  constructor(props) {
    super(props);
    this.state = {
      sensors: [],
      messages: [],
      collector: {
        chartData: [],
        sensorLabels: []
      }
    };

    this.startMessageProcessing();
  }

  private startMessageProcessing() {
    this.brokerInterval = setInterval(() => {
      this.processMessages();
    }, this.MESSAGE_PROCCESSING_INTERVAL);
  }

  private processMessages() {
    let hashMap = {};
    let sensorLabels: string[] = [];
    for (let i = 0; i < this.state.messages.length; i++) {
      let curMessage = this.state.messages[i];
      if (!hashMap[curMessage.sensorLabel]) {
        hashMap[curMessage.sensorLabel] = curMessage.value;
        sensorLabels.push(curMessage.sensorLabel);
      }
    }

    if (Object.getOwnPropertyNames(hashMap).length) {
      hashMap['time'] = new Date().toLocaleTimeString();
      let chartData = this.state.collector.chartData.slice();
      chartData.push(hashMap);
  
      this.setState({
        messages: [],
        sensors: this.state.sensors,
        collector: {
          chartData: chartData,
          sensorLabels: sensorLabels
        }
      });
    }
  }

  private onMessage(from: string, value: number) {
    let msgs = this.state.messages.slice();
    msgs.push({
      id: new Date().getTime(),
      sensorLabel: from,
      value: value
    });
    this.setState({
      messages: msgs,
      sensors: this.state.sensors,
      collector: this.state.collector,
    });
  }

  private onSensorListChange(newSensors: ISensor[]) {
    this.setState({
      messages: this.state.messages,
      sensors: newSensors,
      collector: this.state.collector,
    });
  }

  private brokerOnlineChange(isOnline: boolean) {
    if (!isOnline) {
      clearInterval(this.brokerInterval);
    } else {
      this.startMessageProcessing();
    }
  }

  render() {
    return (
      <div style={{width: '100%', display:'flex', marginTop: '2em'}}>
        <SensorList notifyBroker={this.onMessage.bind(this)} onChange={this.onSensorListChange.bind(this)}/>
        <Broker messages={this.state.messages} processInterval={this.MESSAGE_PROCCESSING_INTERVAL} onOnlineChange={this.brokerOnlineChange.bind(this)} />
        <DataCollector data={this.state.collector.chartData} labels={this.state.collector.sensorLabels}/>
      </div>
    );
  }
}