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
import { DateTimePickerComponent } from '@syncfusion/ej2-angular-calendars';
import { DatePipe } from '@angular/common';

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
export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}
const ELEMENT_DATA: PeriodicElement[] = [];
@Component({
  selector: 'kt-childbirth',
  templateUrl: './childbirth.component.html',
  styleUrls: ['./childbirth.component.scss'],
  animations: [rowsAnimation],
})
export class ChildbirthComponent implements OnInit {


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

  public dept = [];
  public depttemp = [];
  public selectedDept: FormControl = new FormControl();
  public deptFilterCtrl: FormControl = new FormControl();
  public filteredDept = [];


  public attend = [];
  public attendtemp = [];
  public selectedattend: FormControl = new FormControl();
  public attendFilterCtrl: FormControl = new FormControl();
  public filteredattend = [];


  public place = [];
  public placetemp = [];
  public selectedplace: FormControl = new FormControl();
  public placeFilterCtrl: FormControl = new FormControl();
  public filteredPlace = [];

  public selectedradius: FormControl = new FormControl();
  public agenda_title: FormControl = new FormControl();

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
  router: Router;
  today: any;
  minDates: any;
  minDateRepeat: any = {};
  constructor(public datepipe: DatePipe, userService: UserServiceService, public dialog: ModalService, private fb: FormBuilder, router: Router,
    placeMethod: PlaceService, EmployeeService: EmployeeService, public snackBar: MatSnackBar, public ShiftService: ShiftService) {
    this.EmployeeService = EmployeeService;
    this.shiftService = ShiftService;
    this.userid = JSON.parse(localStorage.getItem('user_id'));
    this.token = JSON.parse(localStorage.getItem('token'));
    this.org = parseInt(JSON.parse(localStorage.getItem('org_id')));
    this.userMethod = userService;
    this.placeMethod = placeMethod;
    this.getPlace();
    this.getEmployee();
    this.getShifts();
    this.getDept();
    this.router = router;
    this.selectedradius.setValue(50);
    this.today = new Date();
    this.minDates = new Date();
    this.minDateRepeat = {
      year: parseInt(this.datepipe.transform(this.today, 'yyyy')), month: parseInt(this.datepipe.transform(this.today, 'MM')),
      day: parseInt(this.datepipe.transform(this.today, 'dd'))
    }

    console.log(this.selectedplace);
    //setTimeout(()=>{ this.getShifts(); },3000);


  }

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
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
  dataSource3 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  shift_name = "";
  shift_desc = "";
  stepper: MatStepper;
  to_time = { hour: 8, minute: 0 }
  from_time = { hour: 2, minute: 0 }
  editing = false;
  readyTogo = [];
  finalStartdate = '';
  finalEnddate = '';
  finalStartTime = '';
  finalEndTime = '';
  finalplace = '';
  finalRadius = '';
  visit_type=1;
  ngOnInit() {
    //this.dataSource.paginator = this.paginator;
    this.firstFormGroup = this.fb.group({
      firstCtrl: ['', Validators.required],
      // fromtime: ['', Validators.required],
      // totime: ['', Validators.required],
      days: [''],
      desc: ['']
    });
    this.secondFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required],
      // time: ['', Validators.required],
      // totime: ['', Validators.required],
      days: [''],
      desc: ['']
    });


    this.deptFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterDepts();
      });
    this.attendFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterAttend();
      });

    this.dataSource3 = new MatTableDataSource(this.attendtemp);
    this.dataSource3.paginator = this.paginator3;


  }

  selection(type) {
    this.visit_type = type;
  }
  addAgenda() {
    console.log(this.selectedattend.value);
    console.log(this.agenda_title.value);
    var i = 0;
    this.attend[this.attend.findIndex(x => x.user_id == this.selectedattend.value)].agenda = this.agenda_title.value

    console.log(this.attend);
    this.dataSource3.disconnect();
    this.dataSource3 = new MatTableDataSource(this.attend.filter(function (row) { if (row.agenda) return row }));
    this.dataSource3.paginator = this.paginator3;
    console.log(this.attend);
  }
  onChangeStart(args) {



    this.minDates = new Date(args.value.getFullYear(), args.value.getMonth(), args.value.getDate(), args.value.getHours(), args.value.getMinutes() + 30);

    //     this.minDate =  this.datepipe.transform(args.value, 'yyyy/MM/dd');
    this.minDateRepeat = {
      year: parseInt(this.datepipe.transform(args.value, 'yyyy')), month: parseInt(this.datepipe.transform(args.value, 'MM')),
      day: parseInt(this.datepipe.transform(args.value, 'dd'))
    }
    this.finalStartdate = this.datepipe.transform(args.value, 'yyyy') + '-' + this.datepipe.transform(args.value, 'MM') + '-' + this.datepipe.transform(args.value, 'dd');
    this.finalStartTime = this.datepipe.transform(args.value, 'hh') + ':' + this.datepipe.transform(args.value, 'mm') + ':00';

    ////console.log(this.minDateRepeat)
  }
  onChangeEnd(args) {

    this.minDateRepeat = {
      year: parseInt(this.datepipe.transform(args.value, 'yyyy')), month: parseInt(this.datepipe.transform(args.value, 'MM')),
      day: parseInt(this.datepipe.transform(args.value, 'dd'))
    }
    this.finalEnddate = this.datepipe.transform(args.value, 'yyyy') + '-' + this.datepipe.transform(args.value, 'MM') + '-' + this.datepipe.transform(args.value, 'dd');
    this.finalEndTime = this.datepipe.transform(args.value, 'hh') + ':' + this.datepipe.transform(args.value, 'mm') + ':00';
    console.log(this.minDateRepeat)


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
  filterPlaces() {
    let search = this.deptFilterCtrl.value;
    // filter the banks


    var find = this.depttemp.filter(dept => dept.place_name.toLowerCase().indexOf(search) > -1)
    if (find) {
      this.place = find;
    } else {
      this.place = this.placetemp;
    }

  }
  filterAttend() {
    let search = this.attendFilterCtrl.value;
    // filter the banks


    var find = this.attendtemp.filter(attend => attend.user_name.toLowerCase().indexOf(search) > -1)
    if (find) {
      this.attend = find;
    } else {
      this.attend = this.attendtemp;
    }

  }
  addToList(row, index) {
    this.readyTogo.push({ 'user_id': row.user_id, 'mem_id': row.mem_id, 'user_name': row.user_name, 'user_phone': row.user_phone });
    this.employees[this.employees.findIndex(x => x.user_id == row.user_id)].applied = 1;

    this.dataSource.disconnect();
    this.dataSource = new MatTableDataSource(this.employees);
    this.dataSource.paginator = this.paginator2;

    console.log(this.readyTogo);
    this.attend = this.readyTogo;
    this.attendtemp = this.readyTogo;

  }
  remToList(row, index) {
    this.readyTogo = this.readyTogo.filter(function (obj) {
      return obj.mem_id !== row.mem_id;
    });
    this.employees[this.employees.findIndex(x => x.user_id == row.user_id)].applied = 0;

    this.dataSource.disconnect();
    this.dataSource = new MatTableDataSource(this.employees);
    this.dataSource.paginator = this.paginator2;

    console.log(this.readyTogo);
    this.attend = this.readyTogo;
    this.attendtemp = this.readyTogo;
  }
  remAgenda(row, index) {
    delete this.attend[this.attend.findIndex(x => x.user_id == row.user_id)].agenda

    this.dataSource3.disconnect();
    this.dataSource3 = new MatTableDataSource(this.attendtemp.filter(function (row) { if (row.agenda) return row }));
    this.dataSource3.paginator = this.paginator3;

    console.log(this.readyTogo);
    this.readyTogo = this.attend;
  }
  filterByDept(dept_id) {
    if (dept_id) {
      this.employees = this.tempEmployee.filter(function (row) {
        if (row.dept_id == dept_id)
          return row;
      });

      this.dataSource.disconnect();
      this.dataSource = new MatTableDataSource(this.employees);
      this.dataSource.paginator = this.paginator2;
    } else {
      this.dataSource.disconnect();
      this.dataSource = new MatTableDataSource(this.tempEmployee);
      this.dataSource.paginator = this.paginator2;
    }

  }
  getDept() {
    this.placeMethod.getOrgDept(this.userid, this.token, this.org).subscribe((data: any) => {
      if (data.data.length > 0)
        this.dept = data.data;
      this.dept.unshift({ 'dept_id': 0, 'dept_name': 'All Departments' })
      this.depttemp = data.data;
      this.selectedDept.setValue(this.depttemp[0].dept_id)
    });
  }

  getShifts() {
    this.shiftService.listVisit(this.userid, this.token, this.org).subscribe((data: any) => {
      console.log(data);
      if (data.rescode) {
        this.shifts = data.data;
        this.dataSource_table = new MatTableDataSource(data.data);
        this.dataSource_table.paginator = this.paginator1;
        this.dataSource_table.filterPredicate =
          (data: UserData, filtersJson: string) => {
            const matchFilter = [];
            const filters = JSON.parse(filtersJson);

            filters.forEach(filter => {
              const val = data[filter.id] === null ? '' : data[filter.id];
              matchFilter.push(val.toLowerCase().includes(filter.value.toLowerCase()));
            });
            return matchFilter.every(Boolean);
          };
      }
    });
  }
  editShift(shiftID) {
    this.shiftService.detailShift(this.userid, this.token, this.org, shiftID).subscribe((data: any) => {
      console.log(data);
      if (data.rescode) {
        this.editing = true;
        this.shiftID = shiftID;
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

        this.switch();
        if (data.data[0].member_list) {
          var i = 0;
          this.readyTogo = data.data[0].member_list;
          this.employees.forEach(element => {
            var found = data.data[0].member_list.filter(function (row) {

              if (row.user_id == element.user_id)
                return row;
            });
            if (found.length) {
              this.employees[i].applied = 1;
            } else {
              this.employees[i].applied = 0;
            }

            i++;
          });

          setTimeout(() => {

            this.dataSource.disconnect();
            this.dataSource = new MatTableDataSource(this.employees);
            this.dataSource.paginator = this.paginator2;

            console.log(this.employees);
          }, 3000);

        }






      }
    });
  }
  opendetail(content) {
    this.dialogRef = this.dialog.open(content, {
      width: "800px",
      height: "450px",
      title: "Detail",
      // option1 
      animation: { to: "aside" },
      position: { rowEnd: "22" }
    });
  }
  deleteShifts(id) {
    console.log(id);
    this.shiftService.deleteShift(this.userid, this.token, this.org, id).subscribe((data: any) => {
      if (data.rescode) {
        this.getShifts();
        this.openSnackBarSuccess("Shift deleted!");
      } else {
        this.openSnackBarSuccess("Shift delete failed!");
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
    this.readyTogo = [];
    this.getEmployee();

  }
  submitShift() {

    this.shiftService.addVisit(this.userid, this.token, this.org,
      this.shift_name, this.shift_desc, this.finalStartdate + ' ' + this.finalStartTime, this.finalEnddate + ' ' + this.finalEndTime,
      this.visit_type, this.selectedplace.value, this.selectedradius.value, this.attend).subscribe((data: any) => {
        this.openSnackBarSuccess("Visit Added!");
        this.Wizard = false;
        this.getShifts();
      });


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

      this.place = data.data;
      this.tempPlace = data.data;
      this.selectedplace.setValue(this.tempPlace[0].place_id)

    });
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
    if (!this.editing)
      this.resetwizard();
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
