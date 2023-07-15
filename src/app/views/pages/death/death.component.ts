import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import {
  MatPaginator, MatSort, MatTableDataSource, MatSnackBar, MatSnackBarConfig,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from '@angular/material';
import { UserServiceService } from '../../../services/user-service.service'
import { PlaceService } from '../../../services/place.service'
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ModalService } from "../../../services/modal.service";
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
  selector: 'kt-death',
  templateUrl: './death.component.html',
  styleUrls: ['./death.component.scss'],
  animations: [rowsAnimation],
  encapsulation: ViewEncapsulation.None
})
export class DeathComponent implements OnInit {
  lat = 33.3333;
  lng = 73.3333;
  agent_name = ''
  displayedColumns: string[] = ['department_name', 'department_desc', 'department_sdt', 'action'];
  dataSource: MatTableDataSource<UserData>;
  public Today = [];
  public All = [];
  public sus_status = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  public token = '';
  public userid = 0;
  userSerMethod: any;
  Today_temp: any;
  All_temp: any;
  placeMethod: PlaceService;
  catt = 2;
  org: number;
  places = [];
  dept_name = "";
  dept_desc = "";
  field_error = false;
  error_field = "";
  dialogRef: any;
  dept_id: any;
  isEdit = false;
  constructor(placeMethod: PlaceService, public dialog: ModalService, public snackBar: MatSnackBar) {
    this.placeMethod = placeMethod;
    this.userid = JSON.parse(localStorage.getItem('user_id'));
    this.token = JSON.parse(localStorage.getItem('token'));
    this.org = parseInt(JSON.parse(localStorage.getItem('org_id')));



  }
  ngOnInit() {
    this.getDept();
  }

  getDept() {
    this.placeMethod.getOrgDept(this.userid, this.token, this.org).subscribe((data: any) => {
      if (data.data.length > 0)
        this.places = data.data;
      this.dataSource = new MatTableDataSource(this.places);
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate =
        (data: UserData, filtersJson: string) => {
          const matchFilter = [];
          const filters = JSON.parse(filtersJson);

          filters.forEach(filter => {
            const val = data[filter.id] === null ? '' : data[filter.id];
            matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));
          });
          return matchFilter.every(Boolean);
        };
    });
  }
  fillup(row, isEdit = false) {
    this.dept_name = "";
    this.dept_desc = "";
    this.field_error = false;
    if (isEdit) {
      this.isEdit = true;
      this.dept_name = row.dept_name;
      this.dept_desc = row.dept_desc;
      this.dept_id = row.dept_id;
    }
  }

  saveDept() {
    this.field_error = false;
    if (this.dept_name == "") {
      this.error_field = "Name";
      this.field_error = true;
     } else {
      if (!this.isEdit) {
        this.placeMethod.addOrgDept(this.userid, this.token, this.org, this.dept_name, this.dept_desc).subscribe((response: any) => {
          if (response.rescode) {
            this.openSnackBarSuccess("Department added!");
            this.getDept();
            this.dept_name = "";
            this.dept_desc = "";
          }

          else
            this.openSnackBarError("Department Cannot be Added!");
        });
      } else {
        this.placeMethod.updateOrgDept(this.userid, this.token, this.org, this.dept_name, this.dept_desc, this.dept_id).subscribe((response: any) => {
          if (response.rescode) {
            this.openSnackBarSuccess("Department Updated!");
            this.getDept();
            this.dept_name = "";
            this.dept_desc = "";
          }

          else
            this.openSnackBarError("Department Cannot be Updated!");
        });
      }


    }
  }

  deleteDept(id) {
    this.placeMethod.deleteOrgDept(this.userid, this.token, id).subscribe((response: any) => {
      if (response.rescode) {
        this.openSnackBarSuccess("Department Deleted!");
        this.dataSource.disconnect();
        this.dataSource= new MatTableDataSource([]);
        this.getDept();
      }

      else
        this.openSnackBarError("Department Cannot be Deleted!");
    });
  }
  openSnackBarSuccess(message: string, action = "") {
    let config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'right';
    config.duration = 3000;
    config.panelClass = ['blue-snackbar'];
    this.snackBar.open(message, action, config);
  }
  openSnackBarError(message: string, action = "") {
    let config = new MatSnackBarConfig();
    config.verticalPosition = 'bottom';
    config.horizontalPosition = 'right';
    config.duration = 3000;
    config.panelClass = ['blue-snackbar_error'];
    this.snackBar.open(message, action, config);
  }
  applyFilter(filterValue: string) {
    const tableFilters = [];
    tableFilters.push({
      id: 'department_name',
      value: filterValue
    });

    this.dataSource.filter = JSON.stringify(tableFilters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
