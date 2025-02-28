import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, debounceTime, fromEvent, merge } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DataTableDirective } from 'angular-datatables';
import { ErrorService } from './services/error.service';
import { GetDataService } from './services/get-data.service';
import { PostDataService } from './services/post-data.service';
import { GenericValidator } from './shared/generic-validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Machine Assignment (v1.1)';
  myDate = new Date();
  maxDate: Date = this.myDate;
  bsConfig: Partial<BsDatepickerConfig> | undefined;
  dtTrigger: Subject<any> = new Subject<any>();
  declare dtOptions: any;
  declare employeeForm: FormGroup;
  declare isAddBtnClick: boolean;
  declare selectedGender: string;
  declare displayMessage: { [key: string]: string };
  private genericValidator: GenericValidator;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef<any>[] = [];
  @ViewChild(DataTableDirective) dtElement!: DataTableDirective;

  constructor(
    private titleService: Title,
    private toster: ToastrService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public error: ErrorService,
    public getDataService: GetDataService,
    public postDataService: PostDataService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe
  ) {
    this.titleService.setTitle("Employees");
    this.isAddBtnClick = false;
    this.genericValidator = new GenericValidator();
    this.displayMessage = {
      "txtFirstName": "",
      "txtLastName": "",
      "txtEmail": "",
      "txtMobile": "",
      "txtPan": "",
      "txtPassport": "",
      "txtDOB": "",
      "txtDOJ": "",
      "ddlCountry": "",
      "ddlState": "",
      "ddlCity": "",
      "fileProfile": "",
      "rdoGender": ""
    };
  }

  ngOnInit(): void {
    this.GetAllEmployee();
    this.GetCountryList();
    this.employeeForm = this.formBuilder.group( {
      txtFirstName: new FormControl(["", [Validators.required, Validators.pattern('^[a-zA-Z][a-zA-Z]+$')]]),
      txtLastName: new FormControl([""]),
      txtEmail: new FormControl(["", [Validators.required, Validators.email]]),
      txtMobile: new FormControl(["", [Validators.required, Validators.pattern('^[6-9]{1}[0-9]{9}$'), Validators.minLength(10), Validators.maxLength(10)]]),
      txtPan: new FormControl(["", [Validators.required, Validators.pattern('^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$'), Validators.minLength(10), Validators.maxLength(10)]]),
      txtPassport: new FormControl(["", [Validators.required, Validators.pattern('^[A-PR-WY-Z][1-9]\\d\\s?\\d{4}[1-9]$'), Validators.minLength(8), Validators.maxLength(12)]]),
      txtDOB: new FormControl(["", [Validators.required]]),
      txtDOJ: new FormControl(["", [Validators.required]]),
      ddlCountry: new FormControl(["", [Validators.required]]),
      ddlState: new FormControl(["", [Validators.required]]),
      ddlCity: new FormControl(["", [Validators.required]]),
      fileProfile: new FormControl([this.EmployeeId === 0 ? "" : "NA", [Validators.required]]),
      rdoGender: new FormControl(["", [Validators.required]]),
      txtImageName: new FormControl([""]),
    }, { validator: GenericValidator.validateGender })
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 20,
      processing: true,
      dom: 'Bfrtip',
      buttons: ['colvis', 'copy', 'print', 'excel']
    };
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(this.employeeForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(800)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.employeeForm);
    });

  }

  //------------------------Get All Employee List-------------------------------
  GetEmployeeById(modal: any, EmployeeId: number) {

    this.spinner.show();
    this.getDataService.GetEmployeeById(EmployeeId).subscribe(async (data: any) => {
      if (data != null) {
        
        this.modalService.open(modal, { size: 'xl' });
        this.EmployeeId = EmployeeId;
        this.imageUrl = data.ProfileImage;
        this.selectedGender = data.Gender.toString();
        this.isChecked = data.IsActive;
        
        this.selectedCountry = parseInt(data.CountryId);
        this.getDataService.GetStateList(data.CountryId).subscribe(dataList => {
          this.stateList = dataList;
        })
        this.selectedState = parseInt(data.StateId);
        this.getDataService.GetCityList(data.StateId).subscribe(dataList => {
          this.cityList = dataList;
        })
        this.selectedCity = parseInt(data.CityId);

        this.employeeForm.patchValue({
          txtFirstName: data.FirstName,
          txtLastName: data.LastName,
          txtEmail: data.EmailAddress,
          txtMobile: data.MobileNumber,
          txtPan: data.PanNumber,
          txtPassport: data.PassportNumber,
          txtDOB: this.datePipe.transform(new Date(data.DateOfBirth), 'yyyy-MM-dd'),
          txtDOJ: this.datePipe.transform(new Date(data.DateOfJoinee), 'yyyy-MM-dd'),
          ddlCountry: data.CountryId,
          ddlState: data.StateId,
          ddlCity: data.CityId,
          fileProfile: "",
          rdoGender: data.Gender,
          txtImageName: data.ProfileImageName,
        });

      }
      else {
        this.error.LogError("No Data Found");
      }
    }, error => {
      this.spinner.hide();
      this.error.LogError(error);
    });
  }

  //------------------------Get All Employee List-------------------------------
  employeeList: any = [];
  skeloader: boolean = true;
  GetAllEmployee() {
    this.getDataService.GetAllEmployee().subscribe(data => {
      if (data != null) {
        this.employeeList = data;
        this.skeloader = false;

        if (this.employeeList.length > 0) {
          this.dtTrigger.next(null);
        }
      }
      else {
        setTimeout(() => {
          this.skeloader = false;
        }, 1000);
      }
    })
  }

  //------------------------Add Update Employee---------------------------
  EmployeeId: number = 0;
  isChecked: boolean = false;
  AddUpdateEmployee(employeeId: number) {

    let model = {
      Row_Id: employeeId,
      FirstName: this.employeeForm.value.txtFirstName,
      LastName: this.employeeForm.value.txtLastName,
      EmailAddress: this.employeeForm.value.txtEmail,
      MobileNumber: this.employeeForm.value.txtMobile,
      PanNumber: this.employeeForm.value.txtPan.trim().toUpperCase(),
      PassportNumber: this.employeeForm.value.txtPassport.trim().toUpperCase(),
      ProfileImage: this.imageUrl,
      ProfileImageName: this.employeeForm.value.txtImageName,
      CountryId: this.employeeForm.value.ddlCountry,
      StateId: this.employeeForm.value.ddlState,
      CityId: this.employeeForm.value.ddlCity,
      Gender: this.employeeForm.value.rdoGender,
      IsActive: this.isChecked,
      DateOfBirth: this.employeeForm.value.txtDOB,
      DateOfJoinee: this.employeeForm.value.txtDOJ,
    }
    console.log(this.EmployeeId)
    console.log(model)
    console.log(this.employeeForm.value)
    console.log(this.employeeForm.valid)
    console.log(this.employeeForm.invalid)
    this.spinner.show();
    return;
    this.postDataService.AddUpdateEmployee(model).subscribe((response: any) => {
      if (response != null) {
        if (response.Response_Status == 1) {

          this.GetAllEmployee();
          this.clearForm()
          this.modalService.dismissAll();
          this.EmployeeId = 0;

          this.toster.success(response.Message, 'Done', { timeOut: 10000 })
        } else {
          this.toster.error(response.Message, 'Error', { timeOut: 10000 })
        }
      }
    }, error => {
      this.spinner.hide();
      this.error.LogError(error);
    });
  }

  //------------------------Delete Employee-----------------------------
  DeleteEmployee(employeeId: number, isDeleted: boolean) {
    let model = {
      EmployeeId: employeeId,
      IsDeleted: isDeleted
    }
    this.spinner.show();
    this.postDataService.DeleteEmployee(model).subscribe((response: any) => {
      if (response != null) {
        if (response.Response_Status == 1) {

          this.GetAllEmployee();

          this.toster.success(response.Message, 'Done', { timeOut: 10000 })
        } else {
          this.toster.error(response.Message, 'Error', { timeOut: 10000 })
        }
      }
    }, error => {
      this.spinner.hide();
      this.error.LogError(error);
    });
  }

  //-----------------Country List----------------------//
  countryList: any = []
  selectedCountry = 0;
  GetCountryList() {
    this.getDataService.GetCountryList().subscribe(data => {
      this.countryList = data;
    })
  }

  //-----------------State List----------------------//
  stateList: any = []
  selectedState = 0;
  GetStateList(event: any) {
    this.selectedCountry = event.target.value;
    this.getDataService.GetStateList(this.selectedCountry).subscribe(data => {
      this.stateList = data;
    })
  }

  //-----------------City List----------------------//
  cityList: any = []
  selectedCity = 0;
  GetCityList(event: any) {
    this.selectedState = event.target.value;
    this.getDataService.GetCityList(this.selectedState).subscribe(data => {
      this.cityList = data;
      //this.selectedCity = Math.min.apply(Math, this.holdingPlan.map((o: any) => o.ListId));
    })
  }

  //------------------------------------------------------------
  imageUrl: any = "./assets/default.png";
  fileSizeError: boolean = false;
  fileTypeError: boolean = false;
  errorMsgFile: string = '';
  handleFileInput(event: any) {
    if (event.target.files && event.target.files[0]) {

      const selectedFile = event.target.files[0];
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(selectedFile.type)) {
        this.fileTypeError = true;
        this.errorMsgFile = 'File must be in JPG or PNG format.';
        return;
      } else {
        this.fileTypeError = false;
      }

      // Check file size
      const maxSizeKB = 200;
      const fileSizeKB = Math.round(selectedFile.size / 1024);
      if (fileSizeKB > maxSizeKB) {
        this.fileSizeError = true;
        this.errorMsgFile = 'File size should not exceed 200KB.';
        return;
      } else {
        this.fileSizeError = false;
      }

      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
      }
    }
  }

  //------------------------------------------------------------
  ageError: boolean = false;
  errorMsgAge: string = '';
  validatAge() {
    const dateOfBirth = this.employeeForm.value.txtDOB;
    const dateOfJoining = this.employeeForm.value.txtDOJ;
    const currentDate = new Date();

    if (dateOfBirth && dateOfJoining) {
      const age = currentDate.getFullYear() - new Date(dateOfBirth).getFullYear();
      if (age < 18) {
        this.ageError = true;
        this.errorMsgAge = 'Age must be at least 18 years';
        return { underage: true };
      }
    }

    return null;
  }

  //-------------------------------------------------------------
  public open(modal: any): void {
    this.clearForm()
    this.modalService.open(modal, { size: 'xl' });
  }

  clearForm() {
    this.employeeForm.reset();
    this.imageUrl = "./assets/default.png";
  }
}
