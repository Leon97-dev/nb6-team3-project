export interface DashboardDTO {
  summary: DashboardSummaryDTO;
  contractsByVehicleType: VehicleTypeCountDTO[];
  revenueByVehicleType: VehicleTypeRevenueDTO[];
}

export interface DashboardSummaryDTO {
  revenue: {
    currentMonth: number;
    lastMonth: number;
    growthRate: number; // 성장률 퍼센트
  };
  contracts: {
    inProgress: number;
    completed: number;
  };
  vehicles: {
    total: number;
    active: number;
    inactive: number;
  }
}

export type vehicleType =
  | 'COMPACT'
  | 'MID_SIZE'
  | 'LARGE'
  | 'SPORTS_CAR'
  | 'SUV';

export interface VehicleTypeCountDTO {
  vehicleType: vehicleType;
  count: number;
}

export interface VehicleTypeRevenueDTO {
  vehicleType: vehicleType;
  revenue: number;
}   