import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ModalService } from '../../../services/modal.service';
import { PlaceService } from '../../../services/place.service';

@Component({
  selector: 'kt-change',
  templateUrl: './change.component.html',
  styleUrls: ['./change.component.scss']
})
export class ChangeComponent implements OnInit {

  pass = '';
  repass = '';
  oldpass = '';
  placeMethod: PlaceService;
  userid: any;
  token: any;
  org: number;
  error = false;
  error1 = false;
  error2 = false;
  success = false;

  constructor(placeMethod: PlaceService, public dialog: ModalService, public snackBar: MatSnackBar) {
    this.placeMethod = placeMethod;
    this.userid = JSON.parse(localStorage.getItem('user_id'));
    this.token = JSON.parse(localStorage.getItem('token'));
    this.org = parseInt(JSON.parse(localStorage.getItem('org_id')));
  }

  ngOnInit() {
  }

  changepass() {
    if (this.pass == '' || this.repass == '' || this.oldpass == '') {
      this.error = true;
      this.error1 = false;
    }

    else if (this.pass != this.repass) {
      this.error = false;
      this.error1 = true;
    }
    else {
      this.error1 = false;
      this.error = false;
      this.success = false;
      this.error2 = false;
      console.log(this.pass, this.repass, this.repass);
      this.placeMethod.changePass(this.userid, this.token, this.org,this.oldpass,this.pass,this.repass,JSON.parse(localStorage.getItem('user_phone'))).subscribe((data: any) => {
        if (data.rescode) {
          this.success = true;
        } else {
          this.error2 = true;
        }
      });
    }
  }

}
