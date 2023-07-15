import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {

  public apiUrl="https://pms.hitech.pk/DAL/";
  constructor(private http: HttpClient, private handler: HttpHandler) { }

  addShift(userid: any, token: any, org_id: any, shift_name, shift_desc, shift_start, shift_end) {
    const reqheader = new HttpHeaders({ 'x-access-token': token, 'Content-Type': 'application/json' });
    const data = {
      process: "ADD_SHIFT", plattype: 1, user_id: userid, org_id: org_id, shift_name: shift_name, shift_desc: shift_desc
      , shift_start: shift_start, shift_end: shift_end
    };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  editShift(userid: any, token: any, org_id: any, shift_name, shift_desc, shift_start, shift_end, shift_id: number) {
    const reqheader = new HttpHeaders({ 'x-access-token': token, 'Content-Type': 'application/json' });
    const data = {
      process: "UPDATE_SHIFT", plattype: 1, user_id: userid, org_id: org_id, shift_name: shift_name, shift_desc: shift_desc
      , shift_start: shift_start, shift_end: shift_end, shift_id: shift_id
    };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  applyShift(userid: any, token: any, org_id: any, shift_id, shift_applied_to, shift_days) {
    const reqheader = new HttpHeaders({ 'x-access-token': token, 'Content-Type': 'application/json' });
    const data = {
      process: "APPLY_SHIFT", plattype: 1, user_id: userid, org_id: org_id, shift_id: shift_id, shift_applied_to: shift_applied_to
      , shift_days: shift_days
    };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }

  listShift(userid: any, token: any, org_id: any) {
    const reqheader = new HttpHeaders({ 'x-access-token': token, 'Content-Type': 'application/json' });
    const data = { process: "LIST_SHIFTS", plattype: 1, user_id: userid, org_id: org_id };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  detailShift(userid: any, token: any, org_id: any, shift_id: any) {
    const reqheader = new HttpHeaders({ 'x-access-token': token, 'Content-Type': 'application/json' });
    const data = { process: "VIEW_SHIFT", plattype: 1, user_id: userid, org_id: org_id, shift_id: shift_id };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  deleteShift(userid: any, token: any, org_id: any, shift_id: any) {
    const reqheader = new HttpHeaders({ 'x-access-token': token, 'Content-Type': 'application/json' });
    const data = { process: "DELETE_SHIFT", plattype: 1, user_id: userid, org_id: org_id, shift_id: shift_id };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }


  addVisit(userid: any, token: any, org_id: any, visit_name, visit_desc, visit_start, visit_end, visit_type, loc_id, loc_radius, member_ids) {
    const reqheader = new HttpHeaders({ 'x-access-token': token, 'Content-Type': 'application/json' });
    const data = {
      process: "ADD_VISIT",
      plattype: 1, user_id: userid, org_id: org_id,
      visit_title: visit_name,
      visit_desc: visit_desc,
      fromdate_time: visit_start,
      todate_time: visit_end,
      loc_id:loc_id,
      loc_radius:loc_radius,
      member_ids:member_ids,
      visit_type:visit_type
    };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }

  listVisit(userid: any, token: any, org_id: any) {
    const reqheader = new HttpHeaders({ 'x-access-token': token, 'Content-Type': 'application/json' });
    const data = { process: "VIEW_ALL_ORGANIZATION_VISIT", plattype: 1, user_id: userid, org_id: org_id };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }

}
