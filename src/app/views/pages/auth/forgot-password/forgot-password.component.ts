// Angular
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// RxJS
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
// Translate
import { TranslateService } from '@ngx-translate/core';
// Auth
import { AuthNoticeService, AuthService } from '../../../../core/auth';
import { UserServiceService } from '../../../../services/user-service.service'

@Component({
	selector: 'kt-forgot-password',
	templateUrl: './forgot-password.component.html',
	encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
	// Public params
	forgotPasswordForm: FormGroup;
	loading = false;
	errors: any = [];
	code_ = false;

	private unsubscribe: Subject<any>; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

	/**
	 * Component constructor
	 *
	 * @param authService
	 * @param authNoticeService
	 * @param translate
	 * @param router
	 * @param fb
	 * @param cdr
	 */
	constructor(
		private authService: AuthService,
		public authNoticeService: AuthNoticeService,
		private translate: TranslateService,
		private router: Router,
		private fb: FormBuilder,
		private cdr: ChangeDetectorRef,
		private userService: UserServiceService,
	) {
		this.unsubscribe = new Subject();
	}

	/**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

	/**
	 * On init
	 */
	ngOnInit() {
		this.initRegistrationForm();
	}

	/**
	 * On destroy
	 */
	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.loading = false;
	}

	/**
	 * Form initalization
	 * Default params, validators
	 */
	initRegistrationForm() {
		this.forgotPasswordForm = this.fb.group({
			msisdn: ['', Validators.compose([
				Validators.required,
				Validators.pattern('^[+92][0-9]{12}$')])
			],
			code: ['', Validators.compose([])
			],
			pass: ['', Validators.compose([])
			],
			con_pass: ['', Validators.compose([])
			]
		});
	}
// convenience getter for easy access to form fields
get f() { return this.forgotPasswordForm.controls; }
	/**
	 * Form Submit
	 */
	submit() {
		const controls = this.forgotPasswordForm.controls;
		/** check form */
		if (this.forgotPasswordForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		this.loading = true;
if(!this.code_){
	this.userService.forget(controls.msisdn.value).subscribe(async (response: any) => {
		this.loading = false;
		if (response.rescode) {
			this.loading = false;
			this.code_=true;
			this.authNoticeService.setNotice(this.translate.instant(response.message), 'success');
			this.forgotPasswordForm = this.fb.group({
				msisdn: [controls.msisdn.value, Validators.compose([])
				],
				code: ['', Validators.compose([
					Validators.required,
				])
				],
				pass: ['', Validators.compose([
					Validators.required,
				])
				],
				con_pass: ['', Validators.compose([
					Validators.required,
				])
				]
			});
		} else {
			this.loading = false;
			this.authNoticeService.setNotice(this.translate.instant(response.message), 'danger');
		}
	});
}else{
	this.userService.reset(controls.msisdn.value,controls.code.value,controls.pass.value,controls.con_pass.value).subscribe(async (response: any) => {
		this.loading = false;
		if (response.rescode) {
			this.loading = false;
			this.code_=false;
			this.authNoticeService.setNotice(this.translate.instant(response.message+". Now you can Login."), 'success');
			this.forgotPasswordForm = this.fb.group({
				msisdn: ['', Validators.compose([])
				],
				code: ['', Validators.compose([
					Validators.required,
				])
				],
				pass: ['', Validators.compose([
					Validators.required,
				])
				],
				con_pass: ['', Validators.compose([
					Validators.required,
				])
				]
			});
			
		} else {
			this.loading = false;
			this.authNoticeService.setNotice(this.translate.instant(response.message), 'danger');
		}
	});
}
		

		
	}

	// custom validator to check that two fields match
 MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            // return if another validator has already found an error on the matchingControl
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}
	/**
	 * Checking control validation
	 *
	 * @param controlName: string => Equals to formControlName
	 * @param validationType: string => Equals to valitors name
	 */
	isControlHasError(controlName: string, validationType: string): boolean {
		const control = this.forgotPasswordForm.controls[controlName];
		if (!control) {
			return false;
		}

		const result =
			control.hasError(validationType) &&
			(control.dirty || control.touched);
		return result;
	}
}
