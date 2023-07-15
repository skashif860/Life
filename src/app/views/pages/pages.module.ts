// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
import { MyPageComponent } from './my-page/my-page.component';
import { StaffComponent } from './staff/staff.component';
import { ShiftComponent } from './shift/shift.component';
import {
	MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatAutocompleteModule,
	MAT_DIALOG_DEFAULT_OPTIONS,
	MatSnackBarModule,
	MatTooltipModule,
	MatSliderModule,
	MatSlideToggleModule,
} from '@angular/material';
import {MatStepperModule  } from '@angular/material/stepper';
import { FamilyComponent } from './family/family.component';
import { TravelComponent } from './travel/travel.component';
import { ChildbirthComponent } from './childbirth/childbirth.component';
import { DeathComponent } from './death/death.component';
import { AssistComponent } from './assist/assist.component';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AgmCoreModule } from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PlaceComponent } from './place/place.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { NgFloatingActionMenuModule } from 'ng-floating-action-menu';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatFormFieldModule } from '@angular/material';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';

import { DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { OrgComponent } from './org/org.component';
import { ProfileComponent } from './profile/profile.component';
import { ChangeComponent } from './change/change.component';



@NgModule({
	declarations: [MyPageComponent, StaffComponent, ShiftComponent, FamilyComponent, TravelComponent, ChildbirthComponent,
		 DeathComponent, AssistComponent, PlaceComponent, OrgComponent, ProfileComponent, ChangeComponent],
	exports: [],
	imports: [
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyBX660ic45FDdyyS-P1DTqt3eEbDcAkSoE',
			libraries: ["places"]
		  }),
		  AgmJsMarkerClustererModule,
		CommonModule,
		HttpClientModule,
		FormsModule,
		ReactiveFormsModule,
		CoreModule,
		PartialsModule,
		MatInputModule,
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatSortModule,
	MatTableModule,
	MatSelectModule,
	MatMenuModule,
	MatProgressBarModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatTabsModule,
	MatNativeDateModule,
	MatCardModule,
	MatRadioModule,
	MatIconModule,
	MatDatepickerModule,
	MatAutocompleteModule,
	MatSnackBarModule,
	MatTooltipModule,
	BrowserModule,
	BrowserAnimationsModule,
	MatStepperModule,
	NgbModule,
	DateInputsModule,
	MatSliderModule,
	MatSlideToggleModule,
	NgFloatingActionMenuModule,
	NgMultiSelectDropDownModule.forRoot(),
	MatFormFieldModule,
	NgxMatSelectSearchModule,
	DropDownListModule,
	DateTimePickerModule
	],
	providers: [
		
	]
})
export class PagesModule {
	ngDoBootstrap(app) {
		fetch(MyPageComponent)
		  .then((name)=>{ bootstrapRootComponent(app, name)});
	  }
	 
}
function bootstrapRootComponent(app, name) {
	// define the possible bootstrap components 
	// with their selectors (html host elements)
	const options = {
	  'kt-my-page': MyPageComponent,
	  'kt-village': StaffComponent,
	  'kt-focal': ShiftComponent,
	  'kt-family': FamilyComponent,
	  'kt-travel': TravelComponent,
	  'kt-childbirth': ChildbirthComponent,
	  'kt-death':DeathComponent,
	  'kt-assist':AssistComponent,
	  'kt-suspect':PlaceComponent

	};
	// obtain reference to the DOM element that shows status
	// and change the status to `Loaded`
	const statusElement = document.querySelector('#status');
	statusElement.textContent = 'Loaded';
	// create DOM element for the component being bootstrapped
	// and add it to the DOM
	const componentElement = document.createElement(name);
	document.body.appendChild(componentElement);
	// bootstrap the application with the selected component
	const component = options[name];
	app.bootstrap(component);
  }
  
  function fetch(url) {
	return new Promise((resolve) => {
	  setTimeout(() => {
		resolve('b-comp');
	  }, 2000);
	});
  }
//platformBrowserDynamic().bootstrapModule(PagesModule);
