import { Load } from './Load';

export interface Tour {
    price: number,
    weight: number,
    ldm: number,
    driver_id: number,
    truck_id: number, 
    trailer_id: number,
    loads: Load[],
    
}