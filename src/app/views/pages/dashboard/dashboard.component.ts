import { filter } from "minimatch";
import { NavigationEnd, Router, ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { Component, ViewEncapsulation, ElementRef, ViewChild } from "@angular/core";
import * as Chartist from "chartist";
import { UserServiceService } from "../../../../app/services/user-service.service";
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { SingleDataSet, Label, Color } from 'ng2-charts';
import { ChartType } from 'chart.js';
// @ts-ignore
import * as am4charts from "@amcharts/amcharts4/charts";
// @ts-ignore
import * as am4core from "@amcharts/amcharts4/core";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import * as am4plugins_forceDirected from "@amcharts/amcharts4/plugins/forceDirected";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import * as $ from 'jquery';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map';
am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_dataviz);
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
  encapsulation: ViewEncapsulation.None
})

export class DashboardComponent {
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
  @ViewChild('chartElement',{ static: false })
  public chartElement: ElementRef;
  @ViewChild('chartElement_marital',{ static: false })
  public chartElement_marital: ElementRef;
  @ViewChild('chartElement_disable',{ static: false })
  public chartElement_disable: ElementRef;
  @ViewChild('chartElement_skill',{ static: false })
  public chartElement_skill: ElementRef;
  @ViewChild('chartElement_verify',{ static: false })
  public chartElement_verify: ElementRef;
  @ViewChild('chartElement_qual',{ static: false })
  public chartElement_qual: ElementRef;
  @ViewChild('jelly',{ static: false })
  public jelly: ElementRef;
  @ViewChild('mainChart',{ static: false })
  public mainChart: ElementRef;
  public chart: any;
  public page = 'usdm881';
  public allEmployee: any;
  public allEmployee_indorced: any;
  public allEmployee_rejected: any;
  public allEmployee_pending: any;
  public chartmain: any;
  public chartGender: any;
  public chartMarital: any;
  public chartDisable: any;
  public chartSkill: any;
  public chartVerify: any;
  public chartQual: any;
  public ativity: [];

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
    this.getAllEmployee();
    this.getMainChart();
    this.getstaticdata();
    

   







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
      this.startMainChart(data.data[0]);
      this.startGender(data.data[1]);
      this.startMarital(data.data[2]);
      this.startSkill(data.data[3]);
      this.startDisable(data.data[4]);
      this.startQual(data.data[6]);
      this.startVerify(data.data[5]);
      this.startjelly(data.data[7]);
      this.ativity = data.data[8];
      var ele : NodeListOf<Element> = document.querySelectorAll('[aria-labelledby^="id-"]');
      console.log(this.ativity);
      for(let elee of ele as any){
        elee.setAttribute("style", "display:none");
      }
    });
  }
  startMainChart(data) {
    this.chartmain = am4core.create(this.mainChart.nativeElement, am4charts.XYChart3D);
    this.chartmain.depth = 20;
    console.log("sssss", data);
    this.chartmain.data = [{
      "year": "ALL EMPLOYEES",
      "income": data[0]
    }, {
      "year": "ENDORSED",
      "income": data[1]
    }, {
      "year": "PENDING",
      "income": data[2]
    }, {
      "year": "DECLINED",
      "income": data[3]
    }, {
      "year": "EMPLOYERS",
      "income": data[4]
    }];

    //create category axis for years
    var categoryAxis_main = this.chartmain.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis_main.dataFields.category = "year";
    categoryAxis_main.renderer.inversed = true;
    categoryAxis_main.renderer.grid.template.location = 0;

    //create value axis for income and expenses
    var valueAxis_main = this.chartmain.xAxes.push(new am4charts.ValueAxis());
    valueAxis_main.renderer.opposite = true;


    //create columns
    var colorslist = [
      am4core.color("#c40000"),
      am4core.color("#5e046e"),
      am4core.color("#015c61"),
      am4core.color("#1d5901"),
      am4core.color("#a0a600"),
      am4core.color("#C9B600"),
      am4core.color("#E3A600"),
      am4core.color("#F7941E"),
      am4core.color("#FC7149")
    ];

    var series_main = this.chartmain.series.push(new am4charts.ColumnSeries3D());
    series_main.dataFields.categoryY = "year";
    series_main.dataFields.valueX = "income";
    series_main.name = "Income";
    series_main.columns.template.fillOpacity = 1;
    series_main.columns.template.strokeOpacity = 0;
    series_main.columns.template.width = am4core.percent(30);
    series_main.tooltipText = " {categoryY}: {valueX.value}";

    series_main.columns.template.events.once("inited", function (event) {
      event.target.fill = colorslist[event.target.dataItem.index];
    });




    //add chart cursor
    this.chartmain.cursor = new am4charts.XYCursor();
    this.chartmain.cursor.behavior = "zoomY";

    //add legend
    //this.chartmain.legend = new am4charts.Legend();
  }
  startGender(data) {
    this.chartGender = am4core.create(this.chartElement.nativeElement, am4charts.RadarChart);
    this.chartGender.data = [{
      "category": "Male",
      "value": (data[1] / data[0]) * 100,
      "full": 100
    }, {
      "category": "Female",
      "value": (data[2] / data[0]) * 100,
      "full": 100
    }, {
      "category": "Other",
      "value": (data[3] / data[0]) * 100,
      "full": 100
    },
    ];
    var colorslist_gender = [
      am4core.color("#015c61"),
      am4core.color("#1d5901"),
      am4core.color("#a0a600")];
    // Make chart not full circle
    this.chartGender.startAngle = -90;
    this.chartGender.endAngle = 180;
    this.chartGender.innerRadius = am4core.percent(20);


    // Set number format
    this.chartGender.numberFormatter.numberFormat = "#.#'%'";

    // Create axes
    var categoryAxis = this.chartGender.yAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererRadial>());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.grid.template.strokeOpacity = 0;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.fontWeight;
    categoryAxis.renderer.labels.template.adapter.add("fill", function (fill, target) {
      return (target.dataItem.index >= 0) ? colorslist_gender[target.dataItem.index] : fill;
    });
    categoryAxis.renderer.minGridDistance = 10;

    var valueAxis = this.chartGender.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.min = 0;
    valueAxis.max = 100;
    valueAxis.strictMinMax = true;

    // Create series
    var series1 = this.chartGender.series.push(new am4charts.RadarColumnSeries());
    series1.dataFields.valueX = "full";
    series1.dataFields.categoryY = "category";
    series1.clustered = true;
    series1.columns.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
    series1.columns.template.fillOpacity = 0.08;
    //series1.columns.template.cornerRadiusTopLeft = 20;
    series1.columns.template.strokeWidth = 0;
    series1.columns.template.radarColumn.cornerRadius = 20;

    var series2 = this.chartGender.series.push(new am4charts.RadarColumnSeries());
    series2.dataFields.valueX = "value";
    series2.dataFields.categoryY = "category";
    series2.clustered = false;
    series2.columns.template.strokeWidth = 0;
    series2.columns.template.tooltipText = "{category}: [bold]{value}[/]";
    series2.columns.template.radarColumn.cornerRadius = 20;

    series2.columns.template.adapter.add("fill", function (fill, target) {
      return colorslist_gender[target.dataItem.index];
    });

    // Add cursor
    this.chartGender.cursor = new am4charts.RadarCursor();
  }
  startMarital(data) {
    this.chartMarital = am4core.create(this.chartElement_marital.nativeElement, am4charts.RadarChart);
    // Add data
    this.chartMarital.data = [{
      "category": "Single",
      "value": (data[1] / data[0]) * 100,
      "full": 100
    }, {
      "category": "Married",
      "value": (data[2] / data[0]) * 100,
      "full": 100
    }, {
      "category": "Divorced",
      "value": (data[3] / data[0]) * 100,
      "full": 100
    }, {
      "category": "Widowed",
      "value": (data[4] / data[0]) * 100,
      "full": 100
    }];
    var chartMarital_color = [
      am4core.color("#015c61"),
      am4core.color("#1d5901"),
      am4core.color("#a0a600")];
    // Make chart not full circle
    this.chartMarital.startAngle = -90;
    this.chartMarital.endAngle = 180;
    this.chartMarital.innerRadius = am4core.percent(20);


    // Set number format
    this.chartMarital.numberFormatter.numberFormat = "#.#'%'";

    // Create axes
    var categoryAxis_marital = this.chartMarital.yAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererRadial>());
    categoryAxis_marital.dataFields.category = "category";
    categoryAxis_marital.renderer.grid.template.location = 0;
    categoryAxis_marital.renderer.grid.template.strokeOpacity = 0;
    categoryAxis_marital.renderer.labels.template.horizontalCenter = "right";
    categoryAxis_marital.renderer.labels.template.fontWeight;
    categoryAxis_marital.renderer.labels.template.adapter.add("fill", function (fill, target) {
      return (target.dataItem.index >= 0) ? chartMarital_color[target.dataItem.index] : fill;
    });
    categoryAxis_marital.renderer.minGridDistance = 10;

    var valueAxis_marital = this.chartMarital.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    valueAxis_marital.renderer.grid.template.strokeOpacity = 0;
    valueAxis_marital.min = 0;
    valueAxis_marital.max = 100;
    valueAxis_marital.strictMinMax = true;

    // Create series
    var series1_marital = this.chartMarital.series.push(new am4charts.RadarColumnSeries());
    series1_marital.dataFields.valueX = "full";
    series1_marital.dataFields.categoryY = "category";
    series1_marital.clustered = true;
    series1_marital.columns.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
    series1_marital.columns.template.fillOpacity = 0.08;
    //series1.columns.template.cornerRadiusTopLeft = 20;
    series1_marital.columns.template.strokeWidth = 0;
    series1_marital.columns.template.radarColumn.cornerRadius = 20;

    var series2_marital = this.chartMarital.series.push(new am4charts.RadarColumnSeries());
    series2_marital.dataFields.valueX = "value";
    series2_marital.dataFields.categoryY = "category";
    series2_marital.clustered = false;
    series2_marital.columns.template.strokeWidth = 0;
    series2_marital.columns.template.tooltipText = "{category}: [bold]{value}[/]";
    series2_marital.columns.template.radarColumn.cornerRadius = 20;

    series2_marital.columns.template.adapter.add("fill", function (fill, target) {
      return chartMarital_color[target.dataItem.index];
    });

    // Add cursor
    this.chartMarital.cursor = new am4charts.RadarCursor();
  }
  startSkill(data) {
    this.chartSkill = am4core.create(this.chartElement_skill.nativeElement, am4charts.RadarChart);
    // Add data
    this.chartSkill.data = [{
      "category": "Skilled",
      "value": (data[1] / data[0]) * 100,
      "full": 100
    }, {
      "category": "Semi Skilled",
      "value": (data[1] / data[0]) * 100,
      "full": 100
    }, {
      "category": "UnSkilled",
      "value": (data[2] / data[0]) * 100,
      "full": 100
    }];
    var chartSkill_color = [
      am4core.color("#015c61"),
      am4core.color("#1d5901"),
      am4core.color("#a0a600")];
    // Make chart not full circle
    this.chartSkill.startAngle = -90;
    this.chartSkill.endAngle = 180;
    this.chartSkill.innerRadius = am4core.percent(20);


    // Set number format
    this.chartSkill.numberFormatter.numberFormat = "#.#'%'";

    // Create axes
    var categoryAxis_skill = this.chartSkill.yAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererRadial>());
    categoryAxis_skill.dataFields.category = "category";
    categoryAxis_skill.renderer.grid.template.location = 0;
    categoryAxis_skill.renderer.grid.template.strokeOpacity = 0;
    categoryAxis_skill.renderer.labels.template.horizontalCenter = "right";
    categoryAxis_skill.renderer.labels.template.fontWeight;
    categoryAxis_skill.renderer.labels.template.adapter.add("fill", function (fill, target) {
      return (target.dataItem.index >= 0) ? chartSkill_color[target.dataItem.index] : fill;
    });
    categoryAxis_skill.renderer.minGridDistance = 10;

    var valueAxis_skill = this.chartSkill.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    valueAxis_skill.renderer.grid.template.strokeOpacity = 0;
    valueAxis_skill.min = 0;
    valueAxis_skill.max = 100;
    valueAxis_skill.strictMinMax = true;

    // Create series
    var series1_skill = this.chartSkill.series.push(new am4charts.RadarColumnSeries());
    series1_skill.dataFields.valueX = "full";
    series1_skill.dataFields.categoryY = "category";
    series1_skill.clustered = true;
    series1_skill.columns.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
    series1_skill.columns.template.fillOpacity = 0.08;
    //series1.columns.template.cornerRadiusTopLeft = 20;
    series1_skill.columns.template.strokeWidth = 0;
    series1_skill.columns.template.radarColumn.cornerRadius = 20;

    var series2_skill = this.chartSkill.series.push(new am4charts.RadarColumnSeries());
    series2_skill.dataFields.valueX = "value";
    series2_skill.dataFields.categoryY = "category";
    series2_skill.clustered = false;
    series2_skill.columns.template.strokeWidth = 0;
    series2_skill.columns.template.tooltipText = "{category}: [bold]{value}[/]";
    series2_skill.columns.template.radarColumn.cornerRadius = 20;

    series2_skill.columns.template.adapter.add("fill", function (fill, target) {
      return chartSkill_color[target.dataItem.index];
    });

    // Add cursor
    this.chartSkill.cursor = new am4charts.RadarCursor();
    ///////////////////////////////////////////////////////////////////

  }
  startDisable(data) {
    this.chartDisable = am4core.create(this.chartElement_disable.nativeElement, am4charts.RadarChart);
    // Add data
    this.chartDisable.data = [{
      "category": "YES",
      "value": (data[1] / data[0]) * 100,
      "full": 100
    }, {
      "category": "NO",
      "value": (data[2] / data[0]) * 100,
      "full": 100
    }];
    var chartDisable_color = [
      am4core.color("#015c61"),
      am4core.color("#1d5901"),
      am4core.color("#a0a600")];
    // Make chart not full circle
    this.chartDisable.startAngle = -90;
    this.chartDisable.endAngle = 180;
    this.chartDisable.innerRadius = am4core.percent(20);


    // Set number format
    this.chartDisable.numberFormatter.numberFormat = "#.#'%'";

    // Create axes
    var categoryAxis_disable = this.chartDisable.yAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererRadial>());
    categoryAxis_disable.dataFields.category = "category";
    categoryAxis_disable.renderer.grid.template.location = 0;
    categoryAxis_disable.renderer.grid.template.strokeOpacity = 0;
    categoryAxis_disable.renderer.labels.template.horizontalCenter = "right";
    categoryAxis_disable.renderer.labels.template.fontWeight;
    categoryAxis_disable.renderer.labels.template.adapter.add("fill", function (fill, target) {
      return (target.dataItem.index >= 0) ? chartDisable_color[target.dataItem.index] : fill;
    });
    categoryAxis_disable.renderer.minGridDistance = 10;

    var valueAxis_disable = this.chartDisable.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    valueAxis_disable.renderer.grid.template.strokeOpacity = 0;
    valueAxis_disable.min = 0;
    valueAxis_disable.max = 100;
    valueAxis_disable.strictMinMax = true;

    // Create series
    var series1_disable = this.chartDisable.series.push(new am4charts.RadarColumnSeries());
    series1_disable.dataFields.valueX = "full";
    series1_disable.dataFields.categoryY = "category";
    series1_disable.clustered = true;
    series1_disable.columns.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
    series1_disable.columns.template.fillOpacity = 0.08;
    //series1.columns.template.cornerRadiusTopLeft = 20;
    series1_disable.columns.template.strokeWidth = 0;
    series1_disable.columns.template.radarColumn.cornerRadius = 20;

    var series2_disable = this.chartDisable.series.push(new am4charts.RadarColumnSeries());
    series2_disable.dataFields.valueX = "value";
    series2_disable.dataFields.categoryY = "category";
    series2_disable.clustered = false;
    series2_disable.columns.template.strokeWidth = 0;
    series2_disable.columns.template.tooltipText = "{category}: [bold]{value}[/]";
    series2_disable.columns.template.radarColumn.cornerRadius = 20;

    series2_disable.columns.template.adapter.add("fill", function (fill, target) {
      return chartDisable_color[target.dataItem.index];
    });

    // Add cursor
    this.chartDisable.cursor = new am4charts.RadarCursor();
  }
  startQual(data) {

    this.chartQual = am4core.create(this.chartElement_qual.nativeElement, am4charts.RadarChart);

    // Add data
    this.chartQual.data = [{
      "category": "Primary",
      "value": (data[1] / data[0]) * 100,
      "full": 100
    }, {
      "category": "Middle",
      "value": (data[2] / data[0]) * 100,
      "full": 100
    }, {
      "category": "Secondary",
      "value": (data[3] / data[0]) * 100,
      "full": 100
    }, {
      "category": "HighSecondary",
      "value": (data[4] / data[0]) * 100,
      "full": 100
    }, {
      "category": "graduation",
      "value": (data[5] / data[0]) * 100,
      "full": 100
    }];

    // Make chart not full circle
    this.chartQual.startAngle = -90;
    this.chartQual.endAngle = 180;
    this.chartQual.innerRadius = am4core.percent(20);
    var colorslist_qual = [
      am4core.color("#c5c793"),
      am4core.color("#10b534"),
      am4core.color("#010173"),
      am4core.color("#73038c"),
      am4core.color("#595c40")];

    // Set number format
    this.chartQual.numberFormatter.numberFormat = "#.#'%'";

    // Create axes
    var categoryAxis_qual = this.chartQual.yAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererRadial>());
    categoryAxis_qual.dataFields.category = "category";
    categoryAxis_qual.renderer.grid.template.location = 0;
    categoryAxis_qual.renderer.grid.template.strokeOpacity = 0;
    categoryAxis_qual.renderer.labels.template.horizontalCenter = "right";
    categoryAxis_qual.renderer.labels.template.fontWeight;
    categoryAxis_qual.renderer.labels.template.adapter.add("fill", function (fill, target) {
      return (target.dataItem.index >= 0) ? colorslist_qual[target.dataItem.index] : fill;
    });
    categoryAxis_qual.renderer.minGridDistance = 10;

    var valueAxis_qual = this.chartQual.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    valueAxis_qual.renderer.grid.template.strokeOpacity = 0;
    valueAxis_qual.min = 0;
    valueAxis_qual.max = 100;
    valueAxis_qual.strictMinMax = true;

    // Create series
    var series1_qual = this.chartQual.series.push(new am4charts.RadarColumnSeries());
    series1_qual.dataFields.valueX = "full";
    series1_qual.dataFields.categoryY = "category";
    series1_qual.clustered = true;
    series1_qual.columns.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
    series1_qual.columns.template.fillOpacity = 0.08;
    //series1.columns.template.cornerRadiusTopLeft = 20;
    series1_qual.columns.template.strokeWidth = 0;
    series1_qual.columns.template.radarColumn.cornerRadius = 20;

    var series2_qual = this.chartQual.series.push(new am4charts.RadarColumnSeries());
    series2_qual.dataFields.valueX = "value";
    series2_qual.dataFields.categoryY = "category";
    series2_qual.clustered = false;
    series2_qual.columns.template.strokeWidth = 0;
    series2_qual.columns.template.tooltipText = "{category}: [bold]{value}[/]";
    series2_qual.columns.template.radarColumn.cornerRadius = 20;

    series2_qual.columns.template.adapter.add("fill", function (fill, target) {
      return colorslist_qual[target.dataItem.index];
    });

    // Add cursor
    this.chartQual.cursor = new am4charts.RadarCursor();
  }
  startVerify(data) {
    this.chartVerify = am4core.create(this.chartElement_verify.nativeElement, am4charts.RadarChart);
    // Add data
    this.chartVerify.data = [{
      "category": "Endorsed",
      "value": (data[1] / data[0]) * 100,
      "full": 100
    }, {
      "category": "Pending",
      "value": (data[2] / data[0]) * 100,
      "full": 100
    }, {
      "category": "Rejected",
      "value": (data[3] / data[0]) * 100,
      "full": 100
    }];
    var chartDisable_color = [
      am4core.color("#015c61"),
      am4core.color("#1d5901"),
      am4core.color("#a0a600")];
    // Make chart not full circle
    this.chartVerify.startAngle = -90;
    this.chartVerify.endAngle = 180;
    this.chartVerify.innerRadius = am4core.percent(20);


    // Set number format
    this.chartVerify.numberFormatter.numberFormat = "#.#'%'";

    // Create axes
    var categoryAxis_verify = this.chartVerify.yAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererRadial>());
    categoryAxis_verify.dataFields.category = "category";
    categoryAxis_verify.renderer.grid.template.location = 0;
    categoryAxis_verify.renderer.grid.template.strokeOpacity = 0;
    categoryAxis_verify.renderer.labels.template.horizontalCenter = "right";
    categoryAxis_verify.renderer.labels.template.fontWeight;
    categoryAxis_verify.renderer.labels.template.adapter.add("fill", function (fill, target) {
      return (target.dataItem.index >= 0) ? chartDisable_color[target.dataItem.index] : fill;
    });
    categoryAxis_verify.renderer.minGridDistance = 10;

    var valueAxis_verify = this.chartVerify.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());
    valueAxis_verify.renderer.grid.template.strokeOpacity = 0;
    valueAxis_verify.min = 0;
    valueAxis_verify.max = 100;
    valueAxis_verify.strictMinMax = true;

    // Create series
    var series1_verify = this.chartVerify.series.push(new am4charts.RadarColumnSeries());
    series1_verify.dataFields.valueX = "full";
    series1_verify.dataFields.categoryY = "category";
    series1_verify.clustered = true;
    series1_verify.columns.template.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
    series1_verify.columns.template.fillOpacity = 0.08;
    //series1.columns.template.cornerRadiusTopLeft = 20;
    series1_verify.columns.template.strokeWidth = 0;
    series1_verify.columns.template.radarColumn.cornerRadius = 20;

    var series2_verify = this.chartVerify.series.push(new am4charts.RadarColumnSeries());
    series2_verify.dataFields.valueX = "value";
    series2_verify.dataFields.categoryY = "category";
    series2_verify.clustered = false;
    series2_verify.columns.template.strokeWidth = 0;
    series2_verify.columns.template.tooltipText = "{category}: [bold]{value}[/]";
    series2_verify.columns.template.radarColumn.cornerRadius = 20;

    series2_verify.columns.template.adapter.add("fill", function (fill, target) {
      return chartDisable_color[target.dataItem.index];
    });

    // Add cursor
    this.chartVerify.cursor = new am4charts.RadarCursor();
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
  getAllEmployee() {
    // this.LoginService.getallemp(this.userId, this.token).subscribe((data: any) => {
    //   console.log(data);
    //   this.allEmployee = data.data;
    //   this.allLoc = data.data;
    //   this.allEmployee_indorced = data.data.filter(function (emp) {
    //     if (emp.status == '1')
    //       return emp;
    //   });
    //   this.allEmployee_rejected = data.data.filter(function (emp) {
    //     if (emp.status == '2')
    //       return emp;
    //   });
    //   this.allEmployee_pending = data.data.filter(function (emp) {
    //     if (emp.status == '4')
    //       return emp;
    //   });
    // });
  }
  public getstaticdata() {
    this.contChanged(3);
    this.LoginService
      .getProvince(this.userId, this.token)
      .subscribe((data: any) => {
        this.province = data.data;
      });
  }
  public contChanged(id) {

    this.LoginService
      .getDistrict(this.userId,  this.token, 3)
      .subscribe((data: any) => {
        this.district = data.data;
        if (data.data.length > 0)
          this.province_id = 1;
      });
  }
  public district_change(id) {


    let filterdata = this.allEmployee.filter(function (row) {
      if (row.district == id)
        return row;
    })
    this.applyfilter(filterdata);
    this.LoginService
      .getTaluka(this.userId, this.token, id)
      .subscribe((data: any) => {
        this.taluka = data.data;
        if (data.data.length > 0)
          this.district_id = 1;
      });
  }
  public taluka_change(id) {
    let filterdata = this.allEmployee.filter(function (row) {
      if (row.taluka == id)
        return row;
    })
    this.applyfilter(filterdata);
    this.LoginService
      .getuc(this.userId, this.token, id)
      .subscribe((data: any) => {
        this.uc = data.data;
        if (data.data.length > 0)
          this.taluka_id = 1;
      });
  }
  public uc_change(id) {
    let filterdata = this.allEmployee.filter(function (row) {
      if (row.uc == id)
        return row;
    })
    this.applyfilter(filterdata);
    this.LoginService
      .getvillage(this.userId, this.token, id)
      .subscribe((data: any) => {
        this.village = data.data;
        if (data.data.length > 0)
          this.uc_id = 1;
      });
  }
  public village_change(id) {
    let filterdata = this.allEmployee.filter(function (row) {
      if (row.village == id)
        return row;
    })
    this.applyfilter(filterdata);
    this.LoginService
      .getward(this.userId, this.token, id)
      .subscribe((data: any) => {
        this.ward = data.data;
        if (data.data.length > 0)
          this.village_id = 's';

      });
  }
  public ward_change(id) {
    let filterdata = this.allEmployee.filter(function (row) {
      if (row.ward == id)
        return row;
    })
    this.applyfilter(filterdata);
  }
  public reset() {
    this.getAllEmployee();
    this.getMainChart();
    this.district_id = 0;
    this.taluka_id = 0;
    this.uc_id = 0;
    this.village_id = "";
    this.ward_id = "";
  }

  public applyfilter(filterdata) {
    let temp = [];
    temp.push(filterdata.length);
    temp.push(filterdata.filter(function (row) {
      if (row.profile_user_gender == 1)
        return row;
    }).length);
    temp.push(filterdata.filter(function (row) {
      if (row.profile_user_gender == 2)
        return row;
    }).length);
    temp.push(filterdata.filter(function (row) {
      if (row.profile_user_gender == 3)
        return row;
    }).length);
    this.startGender(temp);
    //--------------------------------------
    temp = [];
    temp.push(filterdata.length);
    temp.push(filterdata.filter(function (row) {
      if (row.pi_marital_status == 1)
        return row;
    }).length);
    temp.push(filterdata.filter(function (row) {
      if (row.pi_marital_status == 2)
        return row;
    }).length);
    temp.push(filterdata.filter(function (row) {
      if (row.pi_marital_status == 3)
        return row;
    }).length);
    temp.push(filterdata.filter(function (row) {
      if (row.pi_marital_status == 4)
        return row;
    }).length);
    this.startMarital(temp);
    //--------------------------------------
    temp = [];
    temp.push(filterdata.length);
    temp.push(filterdata.filter(function (row) {
      if (row.pi_disable == 0)
        return row;
    }).length);
    temp.push(filterdata.filter(function (row) {
      if (row.pi_disable == 1)
        return row;
    }).length);
    this.startDisable(temp);
    //--------------------------------------
    temp = [];
    temp.push(filterdata.length);
    temp.push(filterdata.filter(function (row) {
      if (row.pi_skill_cat == 1)
        return row;
    }).length);
    temp.push(filterdata.filter(function (row) {
      if (row.pi_skill_cat == 2)
        return row;
    }).length);
    temp.push(filterdata.filter(function (row) {
      if (row.pi_skill_cat == 3)
        return row;
    }).length);
    this.startSkill(temp);
    //--------------------------------------
    temp = [];
    temp.push(filterdata.length);
    temp.push(filterdata.filter(function (row) {
      if (row.status == 1)
        return row;
    }).length);
    temp.push(filterdata.filter(function (row) {
      if (row.status == 4)
        return row;
    }).length);
    temp.push(filterdata.filter(function (row) {
      if (row.status == 2)
        return row;
    }).length);
    this.startVerify(temp);
    //--------------------------------------
    temp = [];
    temp.push(filterdata.length);
    temp.push(filterdata.filter(function (row) {
      if (row.pi_edu_level == 1)
        return row;
    }).length);
    temp.push(filterdata.filter(function (row) {
      if (row.pi_edu_level == 2)
        return row;
    }).length);
    temp.push(filterdata.filter(function (row) {
      if (row.pi_edu_level == 3)
        return row;
    }).length);
    temp.push(filterdata.filter(function (row) {
      if (row.pi_edu_level == 4)
        return row;
    }).length);
    temp.push(filterdata.filter(function (row) {
      if (row.pi_edu_level == 5)
        return row;
    }).length);
    this.startQual(temp);
  }








}
