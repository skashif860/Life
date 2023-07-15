export class MenuConfig {
	public defaults: any = {
		header: {
			self: {},
			items: [
				{
					title: 'Dashboard',
					root: true,
					alignment: 'left',
					page: '/stats',
					toggle: 'click',

				},
				
				{
					title: 'Staff',
					root: true,
					alignment: 'left',
					page: '/travel',
					toggle: 'click',

				}

			]
		},

	};
	public focal: any = {
		header: {
			self: {},
			items: [
				// {
				// 	title: 'Stats',
				// 	root: true,
				// 	alignment: 'left',
				// 	page: '/stats',
				// 	toggle: 'click',

				// },
				{
					title: 'Staff',
					root: true,
					alignment: 'left',
					page: '/staff',
					toggle: 'click',

				},
				{
					title: 'Shift',
					root: true,
					alignment: 'left',
					page: '/shift',
					toggle: 'click',

				},
				{
					title: 'Department',
					root: true,
					alignment: 'left',
					page: '/dept',
					toggle: 'click',

				},
				{
					title: 'Places',
					root: true,
					alignment: 'left',
					page: '/place',
					toggle: 'click',

				},
				{
					title: 'Visit',
					root: true,
					alignment: 'left',
					page: '/visit',
					toggle: 'click',

				},
				{
					title: 'Setting',
					root: true,
					alignment: 'left',
					page: '/setting',
					toggle: 'click',

				}
				
				
			]
		},

	};

	public get configs():void {
		console.log("m here",localStorage.getItem('reload'));
		if(localStorage.getItem('reload') != "1"){
			localStorage.setItem("reload","1");
			window.location.reload(true); 
		}
		
		if (parseInt(JSON.parse(localStorage.getItem('user_role'))) == 1) {
			return this.defaults;
		} else {
			return this.focal;
		}



	}

	// public getUserRole(){
	// 	console.log("m here");
	// 	return new Promise(async function (resolve, reject) {
	// 		resolve()
	// 	});

	// }
}

