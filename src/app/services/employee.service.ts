import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

public apiUrl="https://pms.hitech.pk/DAL/";
  constructor(private http: HttpClient, private handler: HttpHandler) { }

  getallemp(userid:any,token:any,org_id:any){
    const reqheader = new HttpHeaders({'x-access-token': token,'Content-Type': 'application/json' });
    const data = { process: "USER_LIST", plattype:1,user_id : userid,org_id:org_id };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  addEmp(userid:any,token:any,org_id:any,user_msisdn,user_fname,user_lname,user_designation,user_password,confirm_password){
    const reqheader = new HttpHeaders({'x-access-token': token,'Content-Type': 'application/json' });
    const data = { process: "ADD_USER", plattype:1,user_id : userid,org_id:org_id,
    user_msisdn:user_msisdn,user_fname:user_fname,dept_id:user_lname,
    role_id:user_designation,user_password:user_password,confirm_password:confirm_password
   };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  
  updateEmpStatus(userid:any,token:any,mem_id:any,status){
    const reqheader = new HttpHeaders({'x-access-token': token,'Content-Type': 'application/json' });
    const data = { 
    process: "CHANGE_MEM_STATUS", 
    plattype:1,
    user_id : userid,
    mem_id:mem_id,
    user_status:status
   };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }

  deleteEmp(userid:any,token:any,mem_id:any){
    const reqheader = new HttpHeaders({'x-access-token': token,'Content-Type': 'application/json' });
    const data = { process: "DELETE_USER", plattype:1,user_id : userid,mem_id:mem_id
   };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
  updateEmp(userid:any,token:any,org_id:any,user_msisdn,user_fname,user_lname,
    user_designation,user_password,confirm_password,member_id,member_sub_id){
    const reqheader = new HttpHeaders({'x-access-token': token,'Content-Type': 'application/json' });
    const data = { process: "UPDATE_USER", plattype:1,user_id : userid,org_id:org_id,
    user_msisdn:user_msisdn,user_fname:user_fname,dept_id:user_lname,
    role_id:user_designation,user_password:user_password,confirm_password:confirm_password,
    mem_id:member_id,member_sub_id:member_sub_id
   };
    return this.http.post(this.apiUrl, data, { headers: reqheader });
  }
}
