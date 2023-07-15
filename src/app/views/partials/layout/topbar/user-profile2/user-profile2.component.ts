// Angular
import { Component, Input, OnInit } from '@angular/core';
// RxJS
import { Observable } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
import { AppState } from '../../../../../core/reducers';
import { currentUser, Logout, User } from '../../../../../core/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'kt-user-profile2',
	templateUrl: './user-profile2.component.html',
})
export class UserProfile2Component implements OnInit {
	// Public properties
	user$: Observable<User>;

	@Input() avatar = true;
	@Input() greeting = true;
	@Input() badge: boolean;
	@Input() icon: boolean;

	public user_name='';
	public district='';
	public taluka='';
	public uc='';
	

	/**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
	constructor(private store: Store<AppState>,private router: Router) {
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit(): void {
		if(JSON.parse(localStorage.getItem('user_name')))
		{
		this.user_name=JSON.parse(localStorage.getItem('user_name'))

		// this.user_name='aaa'
		// this.district = 'aaa'
		// this.taluka = 'aaa'
		// this.uc = 'aaa'
		
		}else{
			this.router.navigate(['/auth/login']);
		}
	}

	/**
	 * Log out
	 */
	logout() {
		localStorage.clear();
		this.router.navigate(['/auth/login']);
	}
}
