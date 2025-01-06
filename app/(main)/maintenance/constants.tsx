import { DrawerView } from "@/app/(main)/maintenance/types";

export const DRAWER_VIEW_TITLES: Record<DrawerView, string> = {
  detail: "Detalles del Equipo",
  "component-selection": "Seleccionar Componente",
  "component-changeout-list": "Lista de Componentes",
  "component-changeout-form": "Nuevo Cambio de Componente",
  "component-changeout-edit": "Editar Cambio de Componente",
  "backlog-list": "Lista de Backlogs",
  "backlog-form": "Nuevo Backlog",
  "backlog-edit": "Editar Backlog",
  "just-do-it-list": "Lista de Just Do It",
  "just-do-it-form": "Nueva Tarea Just Do It",
  "just-do-it-edit": "Editar Just Do It",
};
export const componentsTaxonomy = {
  blower_parrilla: ["izquierdo", "derecho"],
  cilindro_direccion: ["izquierdo", "derecho"],
  cilindro_levante: ["izquierdo", "derecho"],
  modulo_potencia: ["unico"],
  motor_traccion: ["izquierdo", "derecho"],
  suspension_delantera: ["izquierdo", "derecho"],
  suspension_trasera: ["izquierdo", "derecho"],
};

export const subComponentsTaxonomy = {
  blower_parrilla: ["blower"],
  cilindro_direccion: ["cilindro_direccion"],
  cilindro_levante: ["cilindro_levante"],
  modulo_potencia: ["motor", "alternador_principal", "subframe", "radiador"],
  motor_traccion: [
    "motor_traccion",
    "motor_electrico",
    "freno_servicio_trasera",
    "freno_estacionamiento",
  ],
  suspension_delantera: [
    "suspension_delantera",
    "masa",
    "freno_servicio_delantero",
  ],
  suspension_trasera: ["suspension_trasera"],
};

type SubsystemPositions = string[];

interface SubsystemMap {
  [key: string]: SubsystemPositions;
}

interface SystemConfig {
  subsystems: SubsystemMap;
}

interface BacklogTaxonomy {
  [key: string]: SystemConfig;
}

export const backlogTaxonomy: BacklogTaxonomy = {
  sistemas_electricos: {
    subsystems: {
      potencia: ["modulo_potencia", "alternador", "cables"],
      control: ["plc", "sensores", "pantallas"],
      iluminacion: ["faros", "luces_cabina"],
    },
  },
  sistemas_mecanicos: {
    subsystems: {
      motor: ["block", "culata", "carter"],
      transmision: ["convertidor", "diferencial"],
      suspension: ["delantera", "trasera"],
    },
  },
  sistemas_hidraulicos: {
    subsystems: {
      direccion: ["bomba", "cilindros", "mangueras"],
      levante: ["bomba", "cilindros", "mangueras"],
    },
  },
};

// Add display name mappings
export const systemNameMap: Record<string, string> = {
  sistemas_electricos: "Sistemas Eléctricos",
  sistemas_mecanicos: "Sistemas Mecánicos",
  sistemas_hidraulicos: "Sistemas Hidráulicos",
  // Add more as needed
};

export const componentNameMap: Record<string, string> = {
  blower_parrilla: "Blower",
  cilindro_direccion: "Cilindro de Dirección",
  suspension_trasera: "Suspensión Trasera",
  suspension_delantera: "Suspensión Delantera",
  motor_traccion: "Motor de Tracción",
  cilindro_levante: "Cilindro de Levante",
  modulo_potencia: "Módulo de Potencia",
  // Add more mappings as needed
};

export const positionNameMap: Record<string, string> = {
  izquierdo: "Izquierdo",
  derecho: "Derecho",
  // Add more mappings as needed
};

export const EQUIPMENT_MODELS = {
  MODEL_930E4: "930E    -4",
  MODEL_960E: "960E",
} as const;
