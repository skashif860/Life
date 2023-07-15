import { NavigationEnd, Router, ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { Component, ViewEncapsulation, ElementRef, ViewChild, OnInit } from "@angular/core";
import { UserServiceService } from "../../../../app/services/user-service.service";
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";
import 'rxjs/add/operator/map';
am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dataviz);
@Component({
	selector: 'kt-my-page',
	templateUrl: './my-page.component.html',
	styleUrls: ['./my-page.component.scss']
})

export class MyPageComponent implements OnInit {
  public userId: any;
  public userType: any;
  public token: any;
  public allLoc: any;
  public district_id = 0;
  public taluka_id = 0;
  public uc_id = 0;
  public country_id = 0;
  public village_id = '';
  public ward_id = '';
  public province_id = 3;
  public district: any;
  public country: any;
  public province: any;
  public ward: any;
  public taluka: any;
  public uc: any;
  public village: any;
  public allData: any;
  
  @ViewChild('jelly',{ static: false })
  public jelly: ElementRef;
  public chart: any;

  constructor(
    private LoginService: UserServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
	this.userId = JSON.parse(localStorage.getItem('user_id'));
    this.token = JSON.parse(localStorage.getItem('token'));
  }
  closeResult: string;

  ngOnInit() {
    this.getMainChart();
    

   







    /////////////////////////














    






  }

  indorc(id) {
    // this.LoginService.doaction(this.userId, this.token, id, 1).subscribe((data: any) => {
    //   this.getAllEmployee();
    // });
  }
  reject(id) {
    // this.LoginService.doaction(this.userId, this.token, id, 2).subscribe((data: any) => {
    //   this.getAllEmployee();
    // });
  }
  getMainChart() {
    this.LoginService.getReport(this.userId, this.token).subscribe((data: any) => {
      this.startjelly(data.data[7]);
     
      var ele : NodeListOf<Element> = document.querySelectorAll('[aria-labelledby^="id-"]');
      for(let elee of ele as any){
        elee.setAttribute("style", "display:none");
      }
    });
  }

  startjelly(data) {
   // am4core.useTheme(am4themes_dark);
    const chart2 = am4core.create(this.jelly.nativeElement, am4plugins_forceDirected.ForceDirectedTree);
    var networkSeries = chart2.series.push(new am4plugins_forceDirected.ForceDirectedSeries());
    chart2.data = [
      {
        name: "LIFE",
        children: data
      }
    ];

    networkSeries.dataFields.value = "value";
    networkSeries.dataFields.name = "name";
    networkSeries.dataFields.children = "children";
    networkSeries.nodes.template.tooltipText = "{name}";
    networkSeries.nodes.template.fillOpacity = 1;

    networkSeries.nodes.template.label.text = "{name}"
    networkSeries.fontSize = 10;

    networkSeries.links.template.strokeWidth = 1;

    var hoverState = networkSeries.links.template.states.create("hover");
    hoverState.properties.strokeWidth = 1;
    hoverState.properties.strokeOpacity = 1;

    networkSeries.nodes.template.events.on("over", function (event) {
      event.target.dataItem.childLinks.each(function (link) {
        link.isHover = true;
      })
      if (event.target.dataItem.parentLink) {
        event.target.dataItem.parentLink.isHover = true;
      }

    })

    networkSeries.nodes.template.events.on("out", function (event) {
      event.target.dataItem.childLinks.each(function (link) {
        link.isHover = false;
      })
      if (event.target.dataItem.parentLink) {
        event.target.dataItem.parentLink.isHover = false;
      }
    })
  }


  








}

