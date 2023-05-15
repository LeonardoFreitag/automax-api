export interface OrderItemPhasesModel {
  id?: string;
  orderItemId?: string;
  employeeId: string;
  phaseDate: Date;
  phaseId: string;
  notes: string;
}
