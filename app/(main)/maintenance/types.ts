// Drawer view types
export type DrawerView =
  | "detail"
  | "component-selection"
  | "component-changeout-list"
  | "component-changeout-form"
  | "component-changeout-edit"
  | "backlog-list"
  | "backlog-form"
  | "backlog-edit"
  | "just-do-it-list"
  | "just-do-it-form"
  | "just-do-it-edit";

//
// export interface EquipmentContextType {
//   selectedEquipment: EquipmentRecord | null;
//   setSelectedEquipment: (equipment: EquipmentRecord | null) => void;
//   equipmentList: EquipmentRecord[];
//   setEquipmentList: (equipment: EquipmentRecord[]) => void;
//   isDrawerOpen: boolean;
//   setIsDrawerOpen: (isOpen: boolean) => void;
// }
//
// export interface ComponentContextType {
//   selectedComponent: ComponentTask | null;
//   setSelectedComponent: (component: ComponentTask | null) => void;
//   componentList: ComponentTask[];
//   setComponentList: (components: ComponentTask[]) => void;
//   isComponentDrawerOpen: boolean;
//   setIsComponentDrawerOpen: (isOpen: boolean) => void;
// }
//
// export interface BacklogContextType {
//   selectedTask: BacklogTask | null;
//   setSelectedTask: (task: BacklogTask | null) => void;
//   backlogTasks: BacklogTask[];
//   setBacklogTasks: (tasks: BacklogTask[]) => void;
//   isBacklogDrawerOpen: boolean;
//   setIsBacklogDrawerOpen: (isOpen: boolean) => void;
// }
//
// export interface JustDoItContextType {
//   selectedTask: JustDoItTask | null;
//   setSelectedTask: (task: JustDoItTask | null) => void;
//   justDoItTasks: JustDoItTask[];
//   setJustDoItTasks: (tasks: JustDoItTask[]) => void;
//   isJustDoItDrawerOpen: boolean;
//   setIsJustDoItDrawerOpen: (isOpen: boolean) => void;
// }
