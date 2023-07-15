import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatStepper, MatBadgeModule, MatSelect, MatSnackBarConfig, MatSnackBar } from '@angular/material';
import { ShiftService } from '../../../services/shift.service';
import { UserServiceService } from '../../../services/user-service.service';
import { ModalService } from "../../../services/modal.service";
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { trigger, sequence, state, animate, transition, style } from '@angular/animations';
import { Router } from '@angular/router';
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { SelectionModel } from '@angular/cdk/collections';
import { PlaceService } from '../../../services/place.service'
import { EmployeeService } from '../../../services/employee.service'

import { ThemePalette } from '@angular/material/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import * as $ from 'jquery';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}
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
  id: string;
  name: string;
  progress: string;
  color: string;
}
export interface PeriodicElement {
  name: string;
  place: number;
}
const ELEMENT_DATA: PeriodicElement[] = [];


@Component({
  selector: 'kt-travel',
  templateUrl: './travel.component.html',
  styleUrls: ['./travel.component.scss'],
  animations: [rowsAnimation],
})

export class TravelComponent implements OnInit {

  data = {
    name: '',
    cnic: '',
    msisdn: '',
    district: '',
    taluka: '',
    uc: '',
    focal_id: 0

  }
  Wizard = false;
  time: NgbTimeStruct = { hour: 13, minute: 30, second: 0 };
  hourStep = 1;
  minuteStep = 15;
  secondStep = 30;
  addForm: FormGroup;

  public error = false;
  public token = '';
  public userid = 0;
  public userMethod: any;
  placeMethod: any;
  EmployeeService: any;
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  displayedColumns_table: string[] = ['shift_name', 'shift_desc', 'shift_start', 'shift_end', 'shift_sdt', 'action'];
  dataSource_table: MatTableDataSource<UserData>;
  // @ViewChild(MatPaginator, { static: true }) paginator1: MatPaginator;
  // @ViewChild(MatPaginator, { static: true }) paginator2: MatPaginator;
  // @ViewChild(MatPaginator, { static: true }) paginator3: MatPaginator;
  @ViewChild('paginator1', { static: true }) paginator1: MatPaginator;
  @ViewChild('paginator2', { static: true }) paginator2: MatPaginator;
  @ViewChild('paginator3', { static: true }) paginator3: MatPaginator;
  places = [];
  org: number;
  tempPlace: any;
  employees: any;
  tempEmployee: any;
  applyPeople = [];
  showPeople = [];
  showPeople_edit = [];
  shiftService: ShiftService;
  shifts = [];
  task: Task = {
    name: 'All',
    completed: false,
    color: 'warn',
    subtasks: [
      { name: 'Mon', completed: false, color: 'primary' },
      { name: 'Tue', completed: false, color: 'primary' },
      { name: 'Wed', completed: false, color: 'primary' },
      { name: 'Thu', completed: false, color: 'primary' },
      { name: 'Fri', completed: false, color: 'primary' },
      { name: 'Sat', completed: false, color: 'primary' },
      { name: 'Sun', completed: false, color: 'primary' }
    ]
  };

  allComplete: boolean = false;
  shiftID: number;
  dialogRef: any;
  constructor(userService: UserServiceService, public dialog: ModalService, private fb: FormBuilder, router: Router,
    placeMethod: PlaceService, EmployeeService: EmployeeService, public snackBar: MatSnackBar, public ShiftService: ShiftService) {
    this.EmployeeService = EmployeeService;
    this.shiftService = ShiftService;
    this.userid = JSON.parse(localStorage.getItem('user_id'));
    this.token = JSON.parse(localStorage.getItem('token'));
    this.org = 1;
    this.userMethod = userService;
    this.placeMethod = placeMethod;

    this.getPlace();
    this.getEmployee();
    if (localStorage.getItem('shift_id')) {
      this.shiftID = parseInt(JSON.parse(localStorage.getItem('shift_id')));
      this.editShift();
    }

    else
      router.navigate(['/shift']);


    //setTimeout(()=>{ this.getShifts(); },3000);



  }

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  isEditable = true;
  isOptional = true;
  TimeInvalid = false;
  fromtimeHour = 0;
  fromtimeMin = 0;
  totimeHour = 0;
  totimeMin = 0;
  mon = 0;
  tue = 0;
  wed = 0;
  thu = 0;
  fri = 0;
  sat = 0;
  sun = 0;
  FinalEmployees = [];
  FinalEmplyeesPlaces = 0;
  displayedColumns: string[] = ['name', 'place', 'action'];
  detailColumns: string[] = ['name_detail', 'place_detail'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource2 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  shift_name = "";
  shift_desc = "";
  stepper: MatStepper;
  to_time = { hour: 8, minute: 0 }
  from_time = { hour: 2, minute: 0 }
  editing = false;
  ngOnInit() {
    //this.dataSource.paginator = this.paginator;
    this.firstFormGroup = this.fb.group({
      firstCtrl: ['', Validators.required],
      fromtime: ['', Validators.required],
      totime: ['', Validators.required],
      days: [''],
      desc: ['']
    });
    this.secondFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required],
      time: ['', Validators.required],
      totime: ['', Validators.required],
      days: [''],
      desc: ['']
    });
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'loc_id',
      textField: 'loc_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };

  }
  editShift() {
    this.shiftService.detailShift(this.userid, this.token, this.org, this.shiftID).subscribe((data: any) => {
      console.log(data);
      if (data.rescode) {
        this.editing = true;
        this.shift_name = data.data[0].shift_name;
        this.shift_desc = data.data[0].shift_desc;
        this.from_time = { hour: parseInt(data.data[0].shift_start_time.substring(0, 2)), minute: parseInt(data.data[0].shift_start_time.substring(3, 5)) };
        this.to_time = { hour: parseInt(data.data[0].shift_end_time.substring(0, 2)), minute: parseInt(data.data[0].shift_end_time.substring(3, 5)) };
        this.fromtimeHour = parseInt(data.data[0].shift_start_time.substring(0, 2));
        this.fromtimeMin = parseInt(data.data[0].shift_start_time.substring(3, 5))
        this.task.subtasks[this.task.subtasks.findIndex((obj => obj.name == 'Mon'))].completed = (data.data[0].shift_mon) ? true : false
        this.task.subtasks[this.task.subtasks.findIndex((obj => obj.name == 'Tue'))].completed = (data.data[0].shift_tue) ? true : false
        this.task.subtasks[this.task.subtasks.findIndex((obj => obj.name == 'Wed'))].completed = (data.data[0].shift_wed) ? true : false
        this.task.subtasks[this.task.subtasks.findIndex((obj => obj.name == 'Thu'))].completed = (data.data[0].shift_thu) ? true : false
        this.task.subtasks[this.task.subtasks.findIndex((obj => obj.name == 'Fri'))].completed = (data.data[0].shift_fri) ? true : false
        this.task.subtasks[this.task.subtasks.findIndex((obj => obj.name == 'Sat'))].completed = (data.data[0].shift_sat) ? true : false
        this.task.subtasks[this.task.subtasks.findIndex((obj => obj.name == 'Sun'))].completed = (data.data[0].shift_sun) ? true : false

        this.mon = data.data[0].shift_mon;
        this.tue = data.data[0].shift_tue;
        this.wed = data.data[0].shift_wed;
        this.thu = data.data[0].shift_thu;
        this.fri = data.data[0].shift_fri;
        this.sat = data.data[0].shift_sat;
        this.sun = data.data[0].shift_sun;

        this.shiftID = parseInt(data.data[0].shift_id);
        if (data.data[0].member_list)
          this.showPeople = data.data[0].member_list;
        this.dataSource2.disconnect();
        this.dataSource2 = new MatTableDataSource(data.data[0].member_list);
        this.dataSource2.paginator = this.paginator3;
        this.FinalEmployees = this.showPeople;


      }
    });
  }




  resetwizard() {
    this.shift_desc = "";
    this.shift_name = "";
    this.fromtimeHour = 0;
    this.fromtimeMin = 0;
    this.totimeHour = 0;
    this.totimeMin = 0;
    this.mon = 0;
    this.tue = 0;
    this.wed = 0;
    this.thu = 0;
    this.fri = 0;
    this.sat = 0;
    this.sun = 0;
    this.applyPeople = [];
    this.showPeople = [];
    this.employees = [];
    this.FinalEmployees = [];
    this.FinalEmplyeesPlaces = 0;
    //this.dataSource.disconnect();
    this.getEmployee();
    //this.dataSource2.disconnect();
    this.dataSource2 = new MatTableDataSource(this.showPeople);

  }


  submitEditShift() {
    if (this.TimeInvalid) {
      this.openSnackBarError("Time is Invalid");
    }
    else if (this.FinalEmployees.length > 0 && !this.mon && !this.tue && !this.wed && !this.thu && !this.fri && !this.sat && !this.mon)
      this.openSnackBarError("Day must be selected!");
    else {
      console.log(this.shiftID);
      this.shiftService.editShift(this.userid, this.token, this.org, this.shift_name, this.shift_desc, this.fromtimeHour + ":" + this.fromtimeMin, this.totimeHour + ":" + this.totimeMin, this.shiftID).subscribe((data: any) => {
        if (data.rescode) {
          var shiftDays = {
            'Mon': this.mon,
            'Tue': this.tue,
            'Wed': this.wed,
            'Thu': this.thu,
            'Fri': this.fri,
            'Sat': this.sat,
            'Sun': this.sun,
          }
          if (this.FinalEmployees.length > 0) {
            this.shiftService.applyShift(this.userid, this.token, this.org, this.shiftID, this.FinalEmployees, shiftDays).subscribe((data: any) => {
              this.Wizard = false;

              if (data.rescode) {
                this.Wizard = false;

                this.openSnackBarSuccess("Shift updated and applied");
              } else {
                this.Wizard = false;

                this.openSnackBarSuccess("Shift updated and Shift applied error:" + data.message);
              }
            });
          } else {
            if (data.rescode) {
              this.Wizard = false;

              this.openSnackBarSuccess("Shift updated");
            } else {
              this.Wizard = false;

              this.openSnackBarSuccess("Shift updated  error:" + data.message);
            }
          }



        }
      });
    }
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  getEmployee() {
    this.EmployeeService.getallemp(this.userid, this.token, this.org).subscribe((data: any) => {

      this.employees = data.data;
      this.tempEmployee = data.data;
      this.dataSource = new MatTableDataSource(this.tempEmployee);
      this.dataSource.paginator = this.paginator2;

    });
  }
  onKey(value) {
    this.search(value.target.value);
  }
  search(value: string) {
    let filter = value.toLowerCase();
    var arr = this.tempPlace.filter((row) => {
      if (row.loc_name.toLowerCase().startsWith(filter))
        return row;
    });
    if (arr) {
      this.places = arr;
    } else {
      this.places = this.tempPlace;

    }
    console.log(this.places);

    //  console.log(this.places.filter(option => option.toLowerCase().startsWith(filter)));
    // return this.places.filter(option => option.toLowerCase().startsWith(filter));
  }

  getPlace() {
    this.placeMethod.getOrgPlaces(this.userid, this.token, this.org).subscribe((data: any) => {
      if (data.data.length > 0) {
        data.data.forEach(element => {
          //this.placeMethod.push({'id':});
        });
      }
      this.places = data.data;
      this.tempPlace = data.data;
      this.dropdownList = this.tempPlace;

    });
  }
  deleteToList(employee, index) {
    index = this.showPeople.findIndex(x => x.mem_id == employee.mem_id);
    this.showPeople.splice(index, 1);
    console.log(this.showPeople);
    // this.dataSource2.disconnect();
    this.dataSource2 = new MatTableDataSource(this.showPeople);
    // this.FinalEmployees.splice(this.FinalEmployees.findIndex(x => x.mem_id == employee.mem_id), 1);

  }
  addToList(employee, event, index) {
    console.log(employee, event, index);


    console.log(this.showPeople.findIndex(x => x.mem_id == employee.mem_id));
    if ((this.showPeople.findIndex(x => x.mem_id == employee.mem_id)) == -1)
      this.showPeople.push({ "mem_id": employee.mem_id, "mem_name": employee.mem_name, "loc_id": 0, "loc_name": "" });



    this.dataSource2.disconnect();
    this.dataSource2 = new MatTableDataSource(this.showPeople);
    if ((this.FinalEmployees.findIndex(x => x.mem_id == employee.mem_id)) == 0)
      this.FinalEmployees[this.FinalEmployees.findIndex(x => x.mem_id == employee.mem_id)] = this.showPeople;
    else
      this.FinalEmployees = this.showPeople;

    this.FinalEmplyeesPlaces = this.FinalEmployees.filter(function (row) {
      if (parseInt(row['loc_id']) > 0)
        return row;
    }).length;


    console.log(this.FinalEmployees);
  }



  applyFilter(filterValue: string) {
    const tableFilters = [];
    tableFilters.push({
      id: 'shift_name',
      value: filterValue
    });
    this.dataSource_table.filter = JSON.stringify(tableFilters);
    if (this.dataSource_table.paginator) {
      this.dataSource_table.paginator.firstPage();
    }
  }
  fromChange(time: any) {
    if (time) {
      this.fromtimeHour = time.hour;
      this.fromtimeMin = time.minute;
    }

  }
  toChange(time: any) {
    this.TimeInvalid = false;
    if (time) {
      if (time.hour < this.fromtimeHour) {
        this.TimeInvalid = true;
        console.log('111');
      }
      else if (time.minute < this.fromtimeMin && time.hour == this.fromtimeHour) {
        this.TimeInvalid = true;
        console.log('1112', time.minute, this.fromtimeMin);
      }
      else if (time.hour == this.fromtimeHour && time.minute == this.fromtimeMin) {
        this.TimeInvalid = true;
        console.log('1113');
      }
      this.totimeHour = time.hour;
      this.totimeMin = time.minute;
    }
  }
  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  goForward(stepper: MatStepper) {
    stepper.next();
  }



  updateAllComplete(subtasks: any) {
    console.log(subtasks)
    //this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
    if (subtasks.name == 'Mon')
      this.mon = (subtasks.name == 'Mon' && this.mon == 1) ? 0 : 1;
    else if (subtasks.name == 'Tue')
      this.tue = (subtasks.name == 'Tue' && this.tue == 1) ? 0 : 1;
    else if (subtasks.name == 'Wed')
      this.wed = (subtasks.name == 'Wed' && this.wed == 1) ? 0 : 1;
    else if (subtasks.name == 'Thu')
      this.thu = (subtasks.name == 'Thu' && this.thu == 1) ? 0 : 1;
    else if (subtasks.name == 'Fri')
      this.fri = (subtasks.name == 'Fri' && this.fri == 1) ? 0 : 1;
    else if (subtasks.name == 'Sat')
      this.sat = (subtasks.name == 'Sat' && this.sat == 1) ? 0 : 1;
    else if (subtasks.name == 'Sun')
      this.sun = (subtasks.name == 'Sun' && this.sun == 1) ? 0 : 1;

    if (this.mon && this.tue && this.wed && this.thu && this.fri && this.sat && this.sun)
      this.allComplete = true;
    else
      this.allComplete = false

  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => t.completed = completed);
  }
  switch() {
    this.Wizard = true;
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
}
