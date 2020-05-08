import { Load } from './Load';

export interface ClientTour {
    price: number,
    weight: number,
    ldm: number,
    driver_name: string,
    truck_registration: string, 
    trailer_registration: string,
    loads: Load[],
    
}