import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {

  public apiUrl="https://pms.hitech.pk/DAL/";
  constructor(private http: HttpClient, private handler: HttpHandler) { }

  getOrgPlaces(userid: any, token: any, org_id: any) {
    const reqheader = new HttpHeaders({ 'x-access-token': token, 'Content-Type': 'application/json' });
    const data = { process: "PLACE_LIST", plattype: 1, user_id: userid, org_id: org_id };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  addOrgPlaces(userid: any, token: any, org_id: any, loc_name, loc_desc, lat, lng) {
    const reqheader = new HttpHeaders({ 'x-access-token': token, 'Content-Type': 'application/json' });
    const data = {
      process: "ADD_PLACE",
      plattype: 1,
      user_id: userid,
      org_id: org_id,
      place_name: loc_name,
      place_desc: loc_desc,
      place_lat: lat,
      place_lng: lng
    };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }

  updateOrgPlaces(userid: any, token: any, org_id: any, loc_name, loc_desc, lat, lng,loc_id) {
    const reqheader = new HttpHeaders({ 'x-access-token': token, 'Content-Type': 'application/json' });
    const data = {
      process: "UPDATE_PLACE",
      plattype: 1,
      user_id: userid,
      org_id: org_id,
      place_name: loc_name,
      place_desc: loc_desc,
      place_lat: lat,
      place_lng: lng,
      place_id:loc_id
    };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }

  deleteOrgPlaces(userid: any, token: any, loc_id) {
    const reqheader = new HttpHeaders({ 'x-access-token': token, 'Content-Type': 'application/json' });
    const data = {
      process: "DELETE_PLACE",
      plattype: 1,
      user_id: userid,
      place_id:loc_id
    };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }

  getOrgDept(userid: any, token: any, org_id: any) {
    const reqheader = new HttpHeaders({ 'x-access-token': token, 'Content-Type': 'application/json' });
    const data = { process: "DEPT_LIST", plattype: 1, user_id: userid, org_id: org_id};
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  changePass(userid: any, token: any, org_id: any,old,newp,re,number) {
    const reqheader = new HttpHeaders({ 'x-access-token': token, 'Content-Type': 'application/json' });
    const data = { process: "CHANGE_PASSWORD", plattype: 1, user_id: userid, org_id: org_id,user_msisdn:number,old_password:old,new_password:newp};
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  addOrgDept(userid: any, token: any, org_id: any, name, desc) {
    const reqheader = new HttpHeaders({ 'x-access-token': token, 'Content-Type': 'application/json' });
    const data = {
      process: "ADD_DEPT",
      plattype: 1,
      user_id: userid,
      org_id: org_id,
      dept_name: name,
      dept_desc: desc
    };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }

  updateOrgDept(userid: any, token: any, org_id: any, name, desc, deptid) {
    const reqheader = new HttpHeaders({ 'x-access-token': token, 'Content-Type': 'application/json' });
    const data = {
      process: "UPDATE_DEPT",
      plattype: 1,
      user_id: userid,
      org_id: org_id,
      dept_name: name,
      dept_desc: desc,
      dept_id:deptid
    };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }

  deleteOrgDept(userid: any, token: any, deptid) {
    const reqheader = new HttpHeaders({ 'x-access-token': token, 'Content-Type': 'application/json' });
    const data = {
      process: "DELETE_DEPT",
      plattype: 1,
      user_id: userid,
      dept_id:deptid
    };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }



}
