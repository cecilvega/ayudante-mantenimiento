import { Timestamp } from "firebase/firestore";

export interface EquipmentRecord {
  id: string;
  equipmentModel: string;
  equipmentSerial: string;
  equipmentName: string;
}

export interface ComponentChangeoutTask {
  equipmentName: string;
  componentName: string;
  positionName: string;
  id: string;
  ot: number;
  description: string;
  assignees: string[];
  startDate: Timestamp;
  endDate: Timestamp;
  removedComponents: Record<
    string,
    {
      serialNumber: string;
      images?: string[];
    }
  >;
}
export interface BacklogTask {
  equipmentName: string;
  id: string;
  ot: number;
  title: string;
  description: string;
  systemName: string;
  subsystemName: string;
  positionName: string;
  assignees: string[];
  startDate: Timestamp;
  endDate: Timestamp;
}

export interface JustDoItTask {
  id: string;
  ot: number;
  equipmentName: string;
  system: string;
  position: string;
  title: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
}
