// Angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
// Core Module
import { CoreModule } from '../../../core/core.module';
import { PartialsModule } from '../../partials/partials.module';
import { DashboardComponent } from './dashboard.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ChartsModule } from 'ng2-charts';
import {AgmCoreModule} from '@agm/core';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

@NgModule({
	imports: [
		CommonModule,
		PartialsModule,
		CoreModule,
		NgCircleProgressModule,
		RouterModule.forChild([
			{
				path: '',
				component: DashboardComponent
			},
		]),
		ChartsModule,
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyDh0tEzFJEzwFKkAmeWi_7gG4cCPZR7wlk',
			libraries: ["places"]
		  }),
			AgmJsMarkerClustererModule
	],
	providers: [],
	declarations: [
		DashboardComponent,
	]
})
export class DashboardModule {
}
