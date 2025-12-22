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

export interface vehicleType = 
| 'COMPACT' // 경·소형
| 'MID_SIZE' // 준중·중형
| 'LARGE' // 대형
| 'SPORTS_CAR' // 스포츠카
| 'SUV';

export interface VehicleTypeCountDTO {
  vehicleType: VehicleType;
  count: number;
}

export interface VehicleTypeRevenueDTO {
  vehicleType: VehicleType;
  revenue: number;
}   