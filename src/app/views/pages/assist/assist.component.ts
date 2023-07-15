import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { UserServiceService } from '../../../services/user-service.service'
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ModalService } from "./../../../services/modal.service";
import { trigger, sequence, state, animate, transition, style } from '@angular/animations';

export const rowsAnimation =
  trigger('rowsAnimation', [
    transition('void => *', [
      style({ height: '*', opacity: '0', transform: 'translateX(-550px)', 'box-shadow': 'none' }),
      sequence([
        animate(".35s ease", style({ height: '*', opacity: '.2', transform: 'translateX(0)', 'box-shadow': 'none' })),
        animate(".35s ease", style({ height: '*', opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]);
export interface UserData {

}
@Component({
  selector: 'kt-assist',
  templateUrl: './assist.component.html',
  styleUrls: ['./assist.component.scss'],
  animations: [rowsAnimation],
})
export class AssistComponent implements OnInit {
  lat = 0;
  lng = 0;
  agent_name = ''
  @ViewChild('location', { static: true }) public location: any;
  displayedColumns: string[] = ['person_cnic', 'person_name', 'person_contact', 'type', 'fam_count', 'prov_id_name', 'rt_date', 'profile_user_fname', 'location'];
  dataSource: MatTableDataSource<UserData>;
  public Today = [];
  public All = [];
  userSerMethod: any;
  Today_temp: any;
  All_temp: any;
  userMethod: UserServiceService;
  catt = 2;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  public token = '';
  public userid = 0;

  constructor(userService: UserServiceService, public dialog: ModalService) {
    this.userid = JSON.parse(localStorage.getItem('user_id'));
    this.token = JSON.parse(localStorage.getItem('token'));
    this.userMethod = userService;
    

  }

  ngOnInit() {
  
  }


}
