// Angular
import { Injectable } from '@angular/core';
// RxJS
import { BehaviorSubject } from 'rxjs';
// Object path
import * as objectPath from 'object-path';
// Services
import { MenuConfigService } from './menu-config.service';


@Injectable()
export class MenuHorizontalService {
	// Public properties
	menuList$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

	/**
	 * Service constructor
	 *
	 * @param menuConfigService: MenuConfigService
	 */
	constructor(private menuConfigService: MenuConfigService) {
		this.loadMenu();
	}

	/**
	 * Load menu list
	 */
	async loadMenu() {
		// get menu list
		let focal_menu = [
			{
				title: 'Stats',
				root: true,
				alignment: 'left',
				page: '/stats',
				toggle: 'click',

			},
			{
				title: 'Village Head',
				root: true,
				alignment: 'left',
				page: '/villager',
				toggle: 'click',

			},
			{
				title: 'Family Person',
				root: true,
				alignment: 'left',
				page: '/family',
				toggle: 'click',

			},
			{
				title: 'Focals',
				root: true,
				alignment: 'left',
				page: '/focal',
				toggle: 'click',

			},
			{
				title: 'Travel Report',
				root: true,
				alignment: 'left',
				page: '/travel',
				toggle: 'click',

			},
			{
				title: 'Child Birth Report',
				root: true,
				alignment: 'left',
				page: '/childbirth',
				toggle: 'click',

			},
			{
				title: 'Death Report',
				root: true,
				alignment: 'left',
				page: '/death',
				toggle: 'click',

			},
			{
				title: 'Asistance Report',
				root: true,
				alignment: 'left',
				page: '/assist',
				toggle: 'click',

			}]
		let menuItems: any[];
		menuItems = objectPath.get(this.menuConfigService.getMenus(), 'header.items');
		this.menuList$.next(menuItems);
		// await this.getUserRole().catch((err)=>{
		// 	console.log(err);
		// }).then((role)=>{
		// 	console.log("Role",role);
		// 	switch (role) {
		// 		case 1:
		// 			menuItems = objectPath.get(this.menuConfigService.getMenus(), 'header.items');
		// 			break;
		// 		default:
		// 			menuItems = focal_menu;
		// 			break;
		// 	}
		// 	console.log("menu", menuItems);
		// 	this.menuList$.next(menuItems);
		// });
		
	}
	// getUserRole(){
	// 	return new Promise(async function (resolve, reject) {
	// 		resolve(parseInt(JSON.parse(localStorage.getItem('user_role'))))
	// 	});
		
	// }
}
