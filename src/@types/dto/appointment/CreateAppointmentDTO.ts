export interface ServiceItem {
  name: string
  price: number
  commissionPercent?: number 
}

export interface CreateAppointmentDTO {
  barberId: string
  clientName: string
  services: ServiceItem[]
  date: string
  totalPrice: number
}