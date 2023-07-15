import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'kt-org',
  templateUrl: './org.component.html',
  styleUrls: ['./org.component.scss'],
})
export class OrgComponent implements OnInit {
orgs=[];
  constructor() { }

  ngOnInit() {
    this.orgs=JSON.parse(localStorage.getItem('orgs'));
    var i=0;
    for(let org of this.orgs){
      if(org.org_id==parseInt(JSON.parse(localStorage.getItem('org_id'))))
      this.orgs[i].select=1;
      else
      this.orgs[i].select=0;

      i++;
    }
  }

  switch(id,name){
    localStorage.setItem('org_id',JSON.stringify(id));
    localStorage.setItem('org_name',JSON.stringify(name));
    window.location.reload();
  }

}
