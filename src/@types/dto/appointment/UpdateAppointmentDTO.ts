export interface UpdateAppointmentDTO {
  clientName: string;
  totalPrice: number;
  date: Date;
  services: {
    name: string;
    price: number;
    commissionPercent?: number;
  }[];
}
