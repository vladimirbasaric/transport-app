import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Driver } from '../port-app-models/Driver';
import { Truck } from '../port-app-models/Truck';
import { Trailer } from '../port-app-models/Trailer';
import { City } from '../port-app-models/City';
import { Client } from '../port-app-models/Client';
import { Tour } from '../port-app-models/Tour';
import { Load } from '../port-app-models/Load';
import { ClientTourCarier } from '../port-app-models/ClientTourCarier';
import { ClientTour } from '../port-app-models/ClientTour';
import { ClientTourUpdate } from '../port-app-models/ClientTourUpdate';

@Injectable()
export class DataService {

    httpOptions = {
        headers: new HttpHeaders({'Content-Type':'application/json'})
    }

    getAllDriversUrl: string = 'https://port-app.com/api/all_drivers';
    getCompanyDriversUrl: string = 'https://port-app.com/api/company_drivers';
    getAllTrucksUrl: string = 'https://port-app.com/api/all_trucks';
    getAllTrailersUrl: string = 'https://port-app.com/api/all_trailers';
    getCompanyTrailersUrl: string = 'https://port-app.com/api/company_trailers';
    getAllStatesUrl: string = 'https://port-app.com/api/all_states';
    getAllCitiesUrl: string = 'https://port-app.com/api/all_cities';
    getAllClientsUrl: string = 'https://port-app.com/api/all_clients';
    getAllToursUrl: string = 'https://port-app.com/api/all_tours';
    getAllLoadsUrl: string = 'https://port-app.com/api/all_loads';
    getLoadsPerTourUrl: string = 'https://port-app.com/api/loads';
    getTourTrailerUrl: string = 'https://port-app.com/api/tour/trailer'

    getCitiesPerStateUrl: string = 'https://port-app.com/api/cities';
    getReadyTrucksUrl: string = 'https://port-app.com/api/ready_trucks';

    postDriverUrl: string = 'https://port-app.com/api/driver';
    postTruckUrl: string = 'https://port-app.com/api/truck';
    postTrailerUrl: string = 'https://port-app.com/api/trailer'
    postCityUrl: string = 'https://port-app.com/api/city';
    postClientUrl: string = 'https://port-app.com/api/client';
    postTourUrl: string = 'https://port-app.com/api/tour';
    postLoadUrl: string = 'https://port-app.com/api/load';

    postClientTour: string = 'https://port-app.com/api/tour/client';
    postClientTourCarierUrl: string = 'https://port-app.com/api/tour/custom/carrier';

    constructor(private http: HttpClient) {}

    //------------------------- DRIVERS -------------------------------

    getDrivers(): Observable<any[]> {
        return this.http.get<any[]>(this.getAllDriversUrl);
    }

    getCompanyDrivers(): Observable<any[]> {
        return this.http.get<any[]>(this.getCompanyDriversUrl);
    }

    saveDriver(driver: Driver): Observable<Driver> {
        return this.http.post<Driver>(this.postDriverUrl, driver, this.httpOptions);
    }

    updateDriver(driver: Driver): Observable<Driver> {
        const url = `${this.postDriverUrl}/${driver.id}`;

        return this.http.put<Driver>(url, driver, this.httpOptions);
    }

    deleteDriver(id: any): Observable<number> {
        const url = `${this.postDriverUrl}/${id}`;
        return this.http.delete<number>(url, this.httpOptions);
    }

    //--------------------------- TRUCKS ---------------------------------

    getTrucks(): Observable<any[]> {
        return this.http.get<any[]>(this.getAllTrucksUrl);
    }

    getReadyTrucks(): Observable<any[]> {
        return this.http.get<any[]>(this.getReadyTrucksUrl);
    }

    saveTruck(truck: Truck): Observable<Truck> {
        return this.http.post<Truck>(this.postTruckUrl, truck, this.httpOptions);
    }

    updateTruck(truck: Truck): Observable<Truck> {
        const url = `${this.postTruckUrl}/${truck.id}`;
        return this.http.put<Truck>(url, truck, this.httpOptions);
    }

    deleteTruck(id: any): Observable<number> {
        const url = `${this.postTruckUrl}/${id}`;
        return this.http.delete<number>(url, this.httpOptions);
    }

    saveClientTourCarrier(clientTourCarier: ClientTourCarier): Observable<any> {
        return this.http.post<ClientTourCarier>(this.postClientTourCarierUrl, clientTourCarier, this.httpOptions);
    } 

    //------------------------- TRAILERS ---------------------------------

    getTrailers(): Observable<any[]> {
        return this.http.get<any[]>(this.getAllTrailersUrl);
    }

    getCompanyTrailers(): Observable<any[]> {
        return this.http.get<any[]>(this.getCompanyTrailersUrl);
    }

    saveTrailer(trailer: Trailer): Observable<Trailer> {
        return this.http.post<Trailer>(this.postTrailerUrl, trailer, this.httpOptions);
    }

    updateTrailer(trailer: Trailer): Observable<Trailer> {
        const url = `${this.postTrailerUrl}/${trailer.id}`;
        return this.http.put<Trailer>(url, trailer, this.httpOptions);
    }

    deleteTrailer(id: any): Observable<number> {
        const url = `${this.postTrailerUrl}/${id}`;
        return this.http.delete<number>(url, this.httpOptions);
    }

    

    //-------------------------- STATES --------------------------------

    getStates(): Observable<any[]> {
        return this.http.get<any[]>(this.getAllStatesUrl);
    }

    //-------------------------- CITIES --------------------------------

    getCities(): Observable<any[]> {
        return this.http.get<any[]>(this.getAllCitiesUrl);
    }

    getCitiesPerState(state_id: any): Observable<any[]> {
        const url = `${this.getCitiesPerStateUrl}/${state_id}`;
        return this.http.get<any[]>(url);
    }

    saveCity(city: City, state_id: any): Observable<City> {
        const url = `${this.postCityUrl + '/state'}/${state_id}`;
        return this.http.post<City>(url, city, this.httpOptions);
    }

    updateCity(city: City): Observable<Trailer> {
        const url = `${this.postCityUrl}/${city.id}`;
        return this.http.put<Trailer>(url, city, this.httpOptions);
    }

    deleteCity(id: any): Observable<number> {
        const url = `${this.postCityUrl}/${id}`;
        return this.http.delete<number>(url, this.httpOptions);
    }

    //--------------------------- CLIENTS -------------------------------

    getClients(): Observable<any[]> {
        return this.http.get<any[]>(this.getAllClientsUrl);
    }

    saveClient(client: Client, state_id: any): Observable<Client> {
        const url = `${this.postClientUrl + '/state'}/${state_id}`;
        return this.http.post<Client>(url, client, this.httpOptions);
    }

    updateClient(client: Client, state_id: any): Observable<Client> {
        const url = `${this.postClientUrl}/${client.id + '/state'}/${state_id}`;
        return this.http.put<Client>(url, client, this.httpOptions);
    }

    deleteClient(id: any): Observable<number> {
        const url = `${this.postClientUrl}/${id}`;
        return this.http.delete<number>(url, this.httpOptions);
    }

    //-------------------------- TOURS ------------------------------------

    getTours(): Observable<any[]> {
        return this.http.get<any[]>(this.getAllToursUrl);
    }

    saveTour(tour: Tour): Observable<Tour> {
        //console.log(tour);
        return this.http.post<Tour>(this.postTourUrl, tour, this.httpOptions);
    }

    tourInvoice(tour_id: any):Observable<any> {
        const url = `${this.postTourUrl}/invoice/${tour_id}`;
        return this.http.put<any>(url, this.httpOptions);
    }

    closeTour(tour_id:any):Observable<any> {
        const url = `${this.postTourUrl}/close/${tour_id}`;
        return this.http.put<any>(url, this.httpOptions);
    }

    deleteTour(tour_id:any):Observable<any> {
        const url = `${this.postTourUrl}/${tour_id}`;
        return this.http.delete<number>(url, this.httpOptions);
        //return this.http.get<any[]>(this.getAllToursUrl);
    }

    canDeleteDriver(driver_id):Observable<any> {
        const url = `${this.postTourUrl}/driver/delete/${driver_id}`;
        return this.http.get<any[]>(url);
    }

    canDeleteTrilaer(trailer_id):Observable<any> {
        const url = `${this.postTourUrl}/trailer/delete/${trailer_id}`;
        return this.http.get<any[]>(url);
    }

    canDeleteTruck(truck_id):Observable<any> {
        const url = `${this.postTourUrl}/truck/delete/${truck_id}`;
        return this.http.get<any[]>(url);
    }

    saveClientTour(clientTour: ClientTour):Observable<ClientTour> {
        return this.http.post<ClientTour>(this.postClientTour, clientTour, this.httpOptions);
    }

    getTourTrailer(tour_id):Observable<Trailer> {
        const url = `${this.getTourTrailerUrl}/${tour_id}`;
        return this.http.get<Trailer>(url, this.httpOptions);
    }

    updateCompanyTourDriver(tour_id, driver_id):Observable<any> {
        const url = `${this.postTourUrl}/${tour_id}/driver/${driver_id}`;
        return this.http.put<any>(url, this.httpOptions);
    }

    updateClientTourData(clientTourUpdate: ClientTourUpdate):Observable<any> {
        const url = `${this.postTourUrl}/client/${clientTourUpdate.tour_id}`;
        return this.http.put<ClientTourUpdate>(url, clientTourUpdate, this.httpOptions);
    }

    //-------------------------- LOADS ------------------------------------
    getLoads(): Observable<any[]> {
        return this.http.get<any[]>(this.getAllLoadsUrl);
    }

    getHistoryLoads(date: string): Observable<any[]> {
        const url = `${this.getAllLoadsUrl}/history/${date}`;
        return this.http.get<any[]>(url);
    }

    getLoadsPerTour(tourId: any) {
        const url = `${this.getLoadsPerTourUrl}/${tourId}`;
        return this.http.get<any[]>(url);
    }

    saveLoad(load: Load, tour_id: any): Observable<Load> {
        const url = `${this.postLoadUrl}/${tour_id}`;
        return this.http.post<Load>(url, load, this.httpOptions);
    }

    removeLoad(load: Load, tour_id: any): Observable<Load> {
        const url = `${this.postLoadUrl}/${tour_id}`;
        return this.http.put<Load>(url, load,this.httpOptions);
    }

    updateLoad(load: any): Observable<any> {
        const url = `${this.postLoadUrl + '/update'}/${load.id}`;
        return this.http.put<any>(url, load, this.httpOptions);
    }

    saveInvoice(load: any): Observable<any> {
        const url = `${this.postLoadUrl + '/invoice'}/${load.id}`;
        return this.http.put<any>(url, load, this.httpOptions);
    }

    canDeleteClient(client_id: any): Observable<any> {
        const url = `${this.postLoadUrl}/client/delete/${client_id}`;
        return this.http.get<any[]>(url);
    }
    //-------------------------- RELATIONS ---------------------------------

    attachDriverToTruck(driver_id: any, truck_id: any):Observable<number> {
        const url = `${this.postTruckUrl + '/driver/attach'}/${driver_id}/${truck_id}`;
        return this.http.post<any>(url,this.httpOptions);
    }

    removeDriverFromTruck(truck_id: any):Observable<number> {
        const url = `${this.postTruckUrl + '/driver/remove'}/${truck_id}`;
        return this.http.post<any>(url,this.httpOptions);
    }

    attachTrailerToTruck(trailer_id: any, truck_id: any):Observable<number> {
        const url = `${this.postTruckUrl + '/trailer/attach'}/${trailer_id}/${truck_id}`;
        return this.http.post<any>(url,this.httpOptions);
    }

    removeTrailerFromTruck(truck_id: any):Observable<number> {
        const url = `${this.postTruckUrl + '/trailer/remove'}/${truck_id}`;
        return this.http.post<any>(url,this.httpOptions);
    }

}

    

