import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { UserServiceService } from '../../../services/user-service.service'
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
  selector: 'kt-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.scss'],
  animations: [rowsAnimation],
})
export class FamilyComponent implements OnInit {

  displayedColumns: string[] = ['user_full_name', 'user_name', 'user_p_msisdn', 'user_status', 'user_district_name', 'action'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  userid=0;
  token=0;
  service:any;
  constructor(userService: UserServiceService) {
    this.userid = JSON.parse(localStorage.getItem('user_id'));
    this.token = JSON.parse(localStorage.getItem('token'));
   this.service=userService;
   this.getFamily();

  }

  ngOnInit() {

  }

  getFamily(){
    this.service.getMyFamily(this.userid ,this.token).subscribe((data: any) => {
      console.log(data);
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(data.data);
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
      this.dataSource.sort = this.sort;
    });
  }
  updateStatus(user_id,status) {
    this.service.updateAPPUser(this.userid, this.token,user_id,status).subscribe((data: any) => {
      this.getFamily();
    });
  }
  applyFilter(filterValue: string) {
    const tableFilters = [];
    tableFilters.push({
      id: 'user_name',
      value: filterValue
    });


    this.dataSource.filter = JSON.stringify(tableFilters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
