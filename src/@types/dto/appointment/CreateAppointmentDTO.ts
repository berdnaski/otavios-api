export interface CreateAppointmentDTO {
    barberId: string;
    clientName: string;
    service: string;
    price: number;
    date: Date;
}