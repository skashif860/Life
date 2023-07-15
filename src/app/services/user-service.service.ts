import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpHandler } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  public apiUrl="https://pms.hitech.pk/DAL/";
  constructor(private http: HttpClient, private handler: HttpHandler) { }
   // Login
   login(uname: string, pass: string) {
    const reqheader = new HttpHeaders({'Content-Type': 'application/json' });
    const data = { process: 'USER_LOGIN', user_msisdn : uname, user_password: pass,plattype:1 };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  // forgot
  forget(uname: string) {
    const reqheader = new HttpHeaders({'Content-Type': 'application/json' });
    const data = { process: 'FORGOT_PASSWORD', msisdn_email : uname, };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  // forgot
  reset(uname: string,code,pass,con_pass) {
    const reqheader = new HttpHeaders({'Content-Type': 'application/json' });
    const data = { process: 'RESET_PASSWORD', msisdn_email : uname,verification_code:code,new_password:pass,confirm_password:con_pass};
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  
   getMyVillagers(userid,token) {
    const reqheader = new HttpHeaders({'Content-Type': 'application/json','x-access-token':token });
    const data = { process: 'LIST_VILLAGER',userid:userid,plattype:1 };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getMyFamily(userid,token) {
    const reqheader = new HttpHeaders({'Content-Type': 'application/json','x-access-token':token });
    const data = { process: 'LIST_FAMILY',userid:userid,plattype:1 };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getFocals(userid,token) {
    const reqheader = new HttpHeaders({'Content-Type': 'application/json','x-access-token':token });
    const data = { process: 'LIST_FOCAL',userid:userid,plattype:1 };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getTravel(userid,token) {
    const reqheader = new HttpHeaders({'Content-Type': 'application/json','x-access-token':token });
    const data = { process: 'LIST_TRAVEL_REPORT',userid:userid,plattype:1 };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getCBReport(userid,token) {
    const reqheader = new HttpHeaders({'Content-Type': 'application/json','x-access-token':token });
    const data = { process: 'LIST_CB_REPORT',userid:userid,plattype:1 };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getDeathReport(userid,token) {
    const reqheader = new HttpHeaders({'Content-Type': 'application/json','x-access-token':token });
    const data = { process: 'LIST_DEATH_REPORT',userid:userid,plattype:1 };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getSuspectReport(userid,token) {
    const reqheader = new HttpHeaders({'Content-Type': 'application/json','x-access-token':token });
    const data = { process: 'LIST_SUSPECT_REPORT',userid:userid,plattype:1 };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getSuspectStatus(userid,token) {
    const reqheader = new HttpHeaders({'Content-Type': 'application/json','x-access-token':token });
    const data = { process: 'SUSPECT_STATUS_LIST',userid:userid,plattype:1 };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getASReport(userid,token) {
    const reqheader = new HttpHeaders({'Content-Type': 'application/json','x-access-token':token });
    const data = { process: 'LIST_ASSIST_REPORT',userid:userid,plattype:1 };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  
  getUC(userid,token,area_id) {
    const reqheader = new HttpHeaders({'Content-Type': 'application/json','x-access-token':token });
    const data = { process: 'UC_LIST',userid:userid,plattype:1,area_id:area_id };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  addFocal(userid,token,formData:any) {
    const reqheader = new HttpHeaders({'Content-Type': 'application/json','x-access-token':token });
    const data = { process: 'ADD_FOCAL',userid:userid,plattype:1,msisdn_email:formData.cnic.value,user_designation:5,district_id:formData.district.value,
    taluka_id:formData.taluka.value,uc_id:formData.uc.value,user_full_name:formData.name.value,user_p_msisdn:formData.msisdn.value,user_password:formData.password.value };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  updateFocal(userid,token,formData:any,focal_id) {
    const reqheader = new HttpHeaders({'Content-Type': 'application/json','x-access-token':token });
    const data = { process: 'UPDATE_FOCAL',focal_id:focal_id,userid:userid,plattype:1,msisdn_email:formData.cnic.value,user_designation:5,district_id:formData.district.value,
    taluka_id:formData.taluka.value,uc_id:formData.uc.value,user_full_name:formData.name.value,user_p_msisdn:formData.msisdn.value,user_password:formData.password.value };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  deleteFocal(userid,token,focal_id) {
    const reqheader = new HttpHeaders({'Content-Type': 'application/json','x-access-token':token });
    const data = { process: 'DELETE_FOCAL',focal_id:focal_id,userid:userid,plattype:1 };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getDashboard(userid,token){
    const reqheader = new HttpHeaders({'Content-Type': 'application/json','x-access-token':token });
    const data = { process: 'DASHBOARD_STATS',userid:userid,plattype:1 };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getStats(userid,token,level,area){
    const reqheader = new HttpHeaders({'Content-Type': 'application/json','x-access-token':token });
    const data = { process: 'STATS_REPORT',userid:userid,plattype:1,level:level,area:area };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  updateSuspect(userid,token,sus_id,status){
    const reqheader = new HttpHeaders({'Content-Type': 'application/json','x-access-token':token });
    const data = { process: 'UPDATE_SUSPECT',userid:userid,plattype:1,sus_id:sus_id,sus_status:status };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  updateAPPUser(userid,token,sus_id,status){
    const reqheader = new HttpHeaders({'Content-Type': 'application/json','x-access-token':token });
    const data = { process: 'UPDATE_APP_USER_STATUS',userid:userid,plattype:1,sus_id:sus_id,sus_status:status };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  gethouseHeads(userid,token,reciver_id){
    const reqheader = new HttpHeaders({'Content-Type': 'application/json','x-access-token':token });
    const data = { process: 'LIST_HOUSEHOLD',userid:userid,plattype:1,reciever_id:reciver_id };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getReport(userid:any,token:any){
    const reqheader = new HttpHeaders({'x-access-token': token,'Content-Type': 'application/json' });
    const data = { process: "get_report", plattype:1,userid : userid };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getCountry(userid:any,token:any){
    const reqheader = new HttpHeaders({'x-access-token': token,'Content-Type': 'application/json' });
    const data = { process: "ALL_COUNTRIES", plattype:1,userid : userid };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getProvince(userid:any,token:any){
    const reqheader = new HttpHeaders({'x-access-token': token,'Content-Type': 'application/json' });
    const data = { process: "province_list", plattype:1,userid : userid };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getDistrict(userid:any,token:any,area_id){
    const reqheader = new HttpHeaders({'x-access-token': token,'Content-Type': 'application/json' });
    const data = { process: "district_list", plattype:1,userid : userid, area_id:parseInt(area_id) };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getTaluka(userid:any,token:any,area_id){
    const reqheader = new HttpHeaders({'x-access-token': token,'Content-Type': 'application/json' });
    const data = { process: "taluka_list", plattype:1,userid : userid, area_id:parseInt(area_id) };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getuc(userid:any,token:any,area_id){
    const reqheader = new HttpHeaders({'x-access-token': token,'Content-Type': 'application/json' });
    const data = { process: "uc_list", plattype:1,userid : userid, area_id:parseInt(area_id) };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getvillage(userid:any,token:any,area_id){
    const reqheader = new HttpHeaders({'x-access-token': token,'Content-Type': 'application/json' });
    const data = { process: "village_list", plattype:1,userid : userid, area_id:area_id };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getward(userid:any,token:any,area_id){
    const reqheader = new HttpHeaders({'x-access-token': token,'Content-Type': 'application/json' });
    const data = { process: "ward_list", plattype:1,userid : userid, area_id:area_id };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getallemp(userid:any,token:any){
    const reqheader = new HttpHeaders({'x-access-token': token,'Content-Type': 'application/json' });
    const data = { process: "EMPLOYEE_LIST", plattype:1,userid : userid };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  doaction(userid:any,token:any,id:any,typpe:any){
    const reqheader = new HttpHeaders({'x-access-token': token,'Content-Type': 'application/json' });
    const data = { process: "UPDATE_EMP", plattype:1,userid : userid ,emp_id:id,status:typpe};
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  getallOrg(userid:any,token:any){
    const reqheader = new HttpHeaders({'x-access-token': token,'Content-Type': 'application/json' });
    const data = { process: "ORG_LOOKUP", plattype:1,userid : userid };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  
}
