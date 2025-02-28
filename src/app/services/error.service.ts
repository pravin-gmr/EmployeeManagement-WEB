import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  touchMessage = ''

  constructor(private toastr: ToastrService, private router: Router) { }

  public LogError(err: string) {
    var arrError: any = [];
    arrError = err;

    switch (arrError.status) {
      case 0:
        {
          this.toastr.error('Application is not connected to the server, kindly check your internet connection', 'Alert', {
            timeOut: 10000
          })
          break;
        }
      case 400:
        {
          this.toastr.error("Something went wrong, contact system Admin");
          break;
        }
      case 401:
        {
          this.toastr.error('You are not authorized for the service that you are trying to use, contact system Admin !', 'Alert');
          break;
        }
      case 404:
        {
          this.toastr.error('The action you are trying to perform is not found, contact system Admin !', 'Alert')
          break;
        }
      case 408:
        {
          this.toastr.error('Its taking to much time to response, kindly check your internet connection or contact system Admin !', 'Alert')
          break;
        }
      case 500:
        {
          this.toastr.error('Internal server error, not able to connect to the server !', 'Alert')
          break;
        }
    }
  }

  public LogFormError(err: any) {
    var arrFormError: any = [];
    arrFormError = err;
    this.touchMessage = ''
    switch (arrFormError.name.touched && arrFormError.name.errors?.required || arrFormError.name.touched && arrFormError.name.errors?.pattern.requiredPattern) {
      case true:
        {
          this.touchMessage = 'Fields are required'
          break;
        }
    }
  }

  // openDialog(error: any) {
  //   const dialogRef = this.dialog.open(
  //     ErrorDialogComponent,
  //     {
  //       width: '50%',
  //       height: '50%',
  //       disableClose: true,
  //       data: { error: error },
  //     }
  //   )

  //   dialogRef.afterClosed().subscribe((result) => {

  //   });
  // }

}
