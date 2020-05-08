export interface TourOverview {
    tour_id: number,
    driver_full_name: string,
    truck_registration: string,
    trailer_registration: string,
    flag1: string, 
    last_pickup_city: string,
    last_pickup_date: string,
    zip1: string,
    flag2: string, 
    last_delivery_date: string,
    last_delivery_city: string,
    zip2: string,
    ldm: string,
    weight: number,
    price: number,
    companyTourOverview: boolean;
}