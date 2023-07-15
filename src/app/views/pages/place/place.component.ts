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
  selector: 'kt-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.scss'],
  animations: [rowsAnimation],
  encapsulation: ViewEncapsulation.None
})
export class PlaceComponent implements OnInit {
  lat = 33.3333;
  lng = 73.3333;
  agent_name = ''
  @ViewChild('location', { static: true }) public location: any;
  displayedColumns: string[] = ['loc_name', 'loc_desc', 'added_on', 'action'];
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
  position = "33.3333,73.3333";
  radius = 500;
  circle_color = "#F87885"
  place_name = "";
  place_desc = "";
  field_error = false;
  error_field = "";
  dialogRef: any;
  loc_id: any;
  isEdit = false;
  mov_lat = 33.3333;
  mov_lng = 73.3333;
  mov_name = '';
  mov_desc = '';
  mov_radius = 0;
  constructor(placeMethod: PlaceService, public dialog: ModalService, public snackBar: MatSnackBar) {
    this.placeMethod = placeMethod;
    this.userid = JSON.parse(localStorage.getItem('user_id'));
    this.token = JSON.parse(localStorage.getItem('token'));
    this.org = parseInt(JSON.parse(localStorage.getItem('org_id')));



  }
  ngOnInit() {
    this.getPlace();
  }
  onChooseLoaction(event) {
    console.log(event.coords.lat.toFixed(5));
    this.lat = parseFloat(event.coords.lat.toFixed(5));
    this.lng = parseFloat(event.coords.lng.toFixed(5));
    this.position = this.lat + "," + this.lng;
  }
  moveMap(row) {
    this.mov_lat = row.place_lat;
    this.mov_lng = row.place_lng;
    this.mov_name = row.place_name;
    this.mov_desc = row.place_desc;
    this.mov_radius = parseInt(row.loc_radius);
  }
  radiusChange(event) {
    this.radius = Math.round(event);
  }
  getPlace() {
    this.placeMethod.getOrgPlaces(this.userid, this.token, this.org).subscribe((data: any) => {
      this.places = data.data;
      //this.dataSource.disconnect();
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
  openDialog(row, isEdit = false) {
    this.place_name = "";
    this.place_desc = "";
    this.lat = 33.3333;
    this.lng = 73.3333;
    this.radius = 0;
    this.position = "";
    this.field_error = false;
    if (isEdit) {
      this.isEdit = true;
      this.place_name = row.place_name;
      this.place_desc = row.place_desc;
      this.radius = 0;
      this.position = row.place_lat + "," + row.place_lng;
      this.lat = parseFloat(row.place_lat);
      this.lng = parseFloat(row.place_lng);
      this.loc_id = row.place_id;
    }
    this.dialogRef = this.dialog.open(this.location, {
      width: "1000px",
      height: "500px",
      title: (isEdit) ? "Edit" : "Add",
      // option1 
      animation: { to: "aside" },
      position: { rowEnd: "22" }
    });
  }

  savePlace() {
    this.field_error = false;
    if (this.place_name == "") {
      this.error_field = "Name";
      this.field_error = true;
    } else if (this.position == "") {
      this.error_field = "Position";
      this.field_error = true;
    } else {
      if (!this.isEdit) {
        this.placeMethod.addOrgPlaces(this.userid, this.token, this.org, this.place_name, this.place_desc, this.lat, this.lng).subscribe((response: any) => {
          if (response.rescode) {
            this.openSnackBarSuccess("Place added!");
            this.getPlace();
            this.place_name = "";
            this.place_desc = "";
            this.lat = 33.3333;
            this.lng = 73.3333;
            this.radius = 0;
            this.position = "";
            this.dialogRef.close();
          }

          else
            this.openSnackBarError("Place Cannot be Added!");
        });
      } else {
        this.placeMethod.updateOrgPlaces(this.userid, this.token, this.org, this.place_name, this.place_desc, this.lat, this.lng, this.loc_id).subscribe((response: any) => {
          if (response.rescode) {
            this.openSnackBarSuccess("Place Updated!");
            this.getPlace();
            this.place_name = "";
            this.place_desc = "";
            this.lat = 33.3333;
            this.lng = 73.3333;
            this.radius = 0;
            this.position = "";
            this.dialogRef.close();
          }

          else
            this.openSnackBarError("Place Cannot be Updated!");
        });
      }


    }
  }

  deletePlace(id) {
    this.placeMethod.deleteOrgPlaces(this.userid, this.token, id).subscribe((response: any) => {
      if (response.rescode) {
        this.openSnackBarSuccess("Place Deleted!");
        this.getPlace();
        this.mov_name = "";
        this.mov_desc = "";
        this.mov_lat = 33.3333;
        this.mov_lng = 73.3333;
        this.mov_radius = 0;
      }

      else
        this.openSnackBarError("Place Cannot be Deleted!");
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
      id: 'loc_name',
      value: filterValue
    });

    this.dataSource.filter = JSON.stringify(tableFilters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
