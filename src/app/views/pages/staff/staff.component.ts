import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSnackBar, MatSnackBarConfig, MatSort, MatTableDataSource } from '@angular/material';
import { UserServiceService } from '../../../services/user-service.service'
import { EmployeeService } from '../../../services/employee.service'
import { PlaceService } from '../../../services/place.service'
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ModalService } from "../../../services/modal.service";
import { trigger, sequence, state, animate, transition, style } from '@angular/animations';
import { MatSelect } from '@angular/material';
import { FormControl } from '@angular/forms';

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
  selector: 'kt-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
  animations: [rowsAnimation],
  encapsulation: ViewEncapsulation.None
})

export class StaffComponent implements OnInit {


  lat = 0;
  lng = 0;
  map_lat = 33.3333;
  map_lng = 73.3333;
  agent_name = ''
  @ViewChild('location', { static: true }) public location: any;
  displayedColumns: string[] = ['user_name', 'user_phone', 'user_status', 'action'];
  dataSource: MatTableDataSource<UserData>;
  placeMethod: PlaceService;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  public token = '';
  public userid = 0;
  userSerMethod: any;
  org: number;
  emp_fname = "";
  emp_lname = "";
  emp_uname = "";
  emp_des = "";
  emp_pass = "";
  emp_cpass = "";
  EmployeeService: any;
  error_field: string;
  field_error: boolean;
  dialogRef: any;
  isEdit = false;
  employees = [];
  member_name: any;
  member_loc: any;
  member_loc_dtm: any;
  member_id: any;
  member_sub_id: any;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  /** list of banks */
  public dept = [];
  public depttemp = [];

  /** control for the selected bank */
  public selectedDept: FormControl = new FormControl();

  /** control for the MatSelect filter keyword */
  public deptFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredDept = [];

  public is_admin: FormControl = new FormControl();

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;
  constructor(placeMethod: PlaceService, EmployeeService: EmployeeService, public dialog: ModalService, public snackBar: MatSnackBar) {
    this.EmployeeService = EmployeeService;
    this.placeMethod = placeMethod;
    this.userid = JSON.parse(localStorage.getItem('user_id'));
    this.token = JSON.parse(localStorage.getItem('token'));
    this.org = parseInt(JSON.parse(localStorage.getItem('org_id')));

    // this.dropdownSettings = {
    //   singleSelection: true,
    //   idField: 'dept_id',
    //   textField: 'department_name',
    //   selectAllText: 'Select All',
    //   unSelectAllText: 'UnSelect All',
    //   itemsShowLimit: 5,
    //   allowSearchFilter: true
    // };

  }
  ngOnInit() {
    this.getEmployees();
    this.getDept();
    this.deptFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterDepts();
      });
  }

  filterDepts() {
    let search = this.deptFilterCtrl.value;
    // filter the banks


    var find = this.depttemp.filter(dept => dept.dept_name.toLowerCase().indexOf(search) > -1)
    if (find) {
      this.dept = find;
    } else {
      this.dept = this.depttemp;
    }

  }
  mem_status_update(event, row) {
    console.log(event.checked);
    var status = (event.checked) ? 1 : 2;
    this.EmployeeService.updateEmpStatus(this.userid, this.token, row.mem_id, status).subscribe((response: any) => {
      if (status == 1)
        this.openSnackBarSuccess("User Status Activated!");
      else
        this.openSnackBarSuccess("User Status Disabled!");
    });

  }

  mem_delete(row) {
    this.EmployeeService.deleteEmp(this.userid, this.token, row.mem_id).subscribe((response: any) => {
      this.openSnackBarSuccess("User Deleted!");
      this.map_lat = 33.3333;
      this.map_lng = 73.3333;
      this.getEmployees();
    });

  }
  onChooseLoaction(row) {
    this.lat = parseFloat(row.mem_lat);
    this.lng = parseFloat(row.mem_lng);
    this.member_name = row.mem_name;
    this.member_loc = row.mem_loc_text;
    this.member_loc_dtm = row.mem_loc_dtm;
    this.map_lat = this.lat;
    this.map_lng = this.lng;
  }

  getDept() {
    this.placeMethod.getOrgDept(this.userid, this.token, this.org).subscribe((data: any) => {
      if (data.data.length > 0)
        this.dept = data.data;
      this.depttemp = data.data;
      this.selectedDept.setValue(this.depttemp[0].dept_id)
    });
  }

  getEmployees() {
    this.EmployeeService.getallemp(this.userid, this.token, this.org).subscribe((response: any) => {
      console.log(response);
      if (response.rescode) {
        this.employees = response.data;
        this.dataSource = new MatTableDataSource(this.employees);
        this.dataSource.paginator = this.paginator;
        this.dataSource.filterPredicate =
          (data: UserData, filtersJson: string) => {
            const matchFilter = [];
            const filters = JSON.parse(filtersJson);

            filters.forEach(filter => {
              const val = data[filter.user_id] === null ? '' : data[filter.user_id];
              matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));
            });
            return matchFilter.every(Boolean);
          };
      }
    });
  }
  openDialog(row, isEdit = false) {
    this.emp_uname = "";
    this.emp_des = "";
    this.emp_fname = "";
    this.emp_lname = "";
    this.member_id = 0;
    this.member_sub_id = 0;
    this.field_error = false;
    if (isEdit) {
      this.isEdit = true;
      this.emp_uname = row.user_phone;
      this.emp_fname = row.user_name;
      this.member_id = row.mem_id;
      this.member_sub_id = row.user_id;
      var dept=this.depttemp.filter(function (dep) {
        if (dep.dept_id == row.dept_id)
          return dep;
      });
    this.selectedDept.setValue(dept[0].dept_id);
      if (row.user_role_id)
        this.is_admin.setValue(true);
      else
        this.is_admin.setValue(false);
    }
    this.dialogRef = this.dialog.open(this.location, {
      width: "500px",
      height: "500px",
      title: (isEdit) ? "Edit" : "Add",
      // option1 
      animation: { to: "aside" },
      position: { rowEnd: "22" }
    });
  }
  add() {
    var admin = 0;
    if (this.is_admin.value)
      admin = 1;
    if (this.emp_fname == "") {
      this.error_field = "Full Name";
      this.field_error = true;
    } else if (this.emp_uname == "") {
      this.error_field = "User Name";
      this.field_error = true;
    }
    else if (!(/^(\+92)-{0}\d{3}-{0,1}\d{7}$|^\d{4}-\d{7}$/.test(this.emp_uname))) {
      this.error_field = "Invalid MSISDN OR ";
      this.field_error = true;
    }
    else if (!this.isEdit && this.emp_pass == "") {
      this.error_field = "Password";
      this.field_error = true;
    } else if (!this.isEdit && this.emp_cpass == "" && this.emp_pass != "") {
      this.error_field = "Confirm Password";
      this.field_error = true;
    } else if (!this.isEdit && this.emp_cpass != this.emp_pass) {
      this.error_field = "Password not Matched";
      this.field_error = true;
    } else {
      if (!this.isEdit) {

        this.EmployeeService.addEmp(this.userid, this.token, this.org, this.emp_uname,
          this.emp_fname, this.selectedDept.value, admin, this.emp_pass, this.emp_cpass).subscribe((response: any) => {
            if (response.rescode) {
              this.openSnackBarSuccess("User added!");
              this.getEmployees();
              this.emp_fname = "";
              this.emp_lname = "";
              this.emp_des = "";
              this.emp_pass = "";
              this.emp_cpass = "";
              this.selectedDept.setValue(this.dept[0].dept_id);
              this.dialogRef.close();
              this.is_admin.setValue(false);
            }

            else
              this.openSnackBarError(response.message);
          });
      } else {
        this.EmployeeService.updateEmp(this.userid, this.token, this.org, this.emp_uname,
          this.emp_fname,this.selectedDept.value, admin,  this.emp_pass, this.emp_cpass, this.member_id, this.member_sub_id).subscribe((response: any) => {
            if (response.rescode) {
              this.openSnackBarSuccess("User updated!");
              this.getEmployees();
              this.emp_uname = "";
              this.emp_des = "";
              this.emp_fname = "";
              this.emp_lname = "";
              this.member_id = 0;
              this.member_sub_id = 0;
              this.isEdit = false;
              this.selectedDept.setValue(this.dept[0].dept_id);
              this.dialogRef.close();
              this.is_admin.setValue(false);
            }

            else
              this.openSnackBarError(response.message);
          });
      }
    }


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
      id: 'mem_username',
      value: filterValue
    });



    this.dataSource.filter = JSON.stringify(tableFilters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



}
