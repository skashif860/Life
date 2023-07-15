// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';
// Auth
import { AuthGuard } from './core/auth';
import { MyPageComponent } from './views/pages/my-page/my-page.component';
import { StaffComponent } from './views/pages/staff/staff.component';
import { ShiftComponent } from './views/pages/shift/shift.component';
import { FamilyComponent } from './views/pages/family/family.component';
import { TravelComponent } from './views/pages/travel/travel.component';
import { ChildbirthComponent } from './views/pages/childbirth/childbirth.component';
import { DeathComponent } from './views/pages/death/death.component';
import { AssistComponent } from './views/pages/assist/assist.component';
import { PlaceComponent } from './views/pages/place/place.component';

import { OrgComponent } from './views/pages/org/org.component';
import { ProfileComponent } from './views/pages/profile/profile.component';
import { ChangeComponent } from './views/pages/change/change.component';

const routes: Routes = [
	{path: 'auth', loadChildren: () => import('app/views/pages/auth/auth.module').then(m => m.AuthModule)},

	{
		path: '',
		component: BaseComponent,
		//canActivate: [AuthGuard],
		children: [

			{
				path: 'dashboard',
				loadChildren: () => import('app/views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
			},
			{
				path: 'stats',
				component: MyPageComponent
			},
			{
				path: 'staff',
				component: StaffComponent
			},
			{
				path: 'shift',
				component: ShiftComponent
			},
			{
				path: 'place',
				component: PlaceComponent
			},
			{
				path: 'dept',
				component: DeathComponent
			},
			{
				path: 'visit',
				component: ChildbirthComponent
			},
			{
				path: 'setting',
				component: AssistComponent
			},
			{
				path: 'org',
				component: OrgComponent
			},
			{
				path: 'profile',
				component: ProfileComponent
			},
			{
				path: 'change',
				component: ChangeComponent
			},
			
			
			
			
			
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					type: 'error-v6',
					code: 403,
					title: '403... Access forbidden',
					desc: 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
				}
			},
			{path: 'error/:type', component: ErrorPageComponent},
			{path: '', redirectTo: 'dashboard', pathMatch: 'full'},
			{path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
		]
	},

	{path: '**', redirectTo: 'error/403', pathMatch: 'full'},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
