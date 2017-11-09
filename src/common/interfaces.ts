export interface ISensor {
  id: number;
  label: string;
  interval: number;
}

export interface ISensorProps {
  notifyBroker: (from: string, value: number) => void;
  onChange: (newSensors: ISensor[]) => void;
}

export interface IBrokerMessage {
  id: number;
  value: number;
  sensorLabel: string;
}