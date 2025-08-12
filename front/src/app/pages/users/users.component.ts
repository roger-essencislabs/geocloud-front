import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbNavModule} from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable, Subject, debounceTime } from 'rxjs';
import { CommonModule, DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

import { PaginatedResult, Pagination } from 'src/app/models/Pagination';
import { GlobalComponent } from 'src/app/global-component';

import { User }    from 'src/app/models/User';
import { Profile } from 'src/app/models/Profile';
import { Country } from 'src/app/models/Country';

import { UserService }     from 'src/app/services/user.service';
import { ProfileService }  from 'src/app/services/profile.service';
import { CountryService }  from 'src/app/services/country.service';
import { UsersGridComponent } from './users-grid/users-grid.component';
import { UsersListComponent } from './users-list/users-list.component';
import { BreadcrumbsComponent } from 'src/app/shared/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    UsersGridComponent,
    UsersListComponent,
    BreadcrumbsComponent
  ]
})

export class UsersComponent implements OnInit{

  //VAR - GLOBAL
  public breadCrumbItems!: Array<{}>;
  public users: User[] = [];
  public profiles: Profile[] = [];
  public countries: Country[] = [];
  public userView = {} as User;
  public resGuid: string = '';
  public userForm!: FormGroup;
  public modeForm: string = '';
  public viewType: number = 1;

  //VAR - PAGINATION / SEARCH / SORT
  public pagination = {} as Pagination;
  public term = '';
  public sortField = 'u.id';
  public sortReverse = false;
  public termoBuscaChanged: Subject<string> = new Subject<string>();
  
  //VAR CHECKBOX
  public checkedValGet: number[] = [];
  public masterSelected!: boolean;

  //IMAGES
  public imgUrl: string | undefined;
  public fileListProfile: any;
  public fileListCover: any;
  public imageUrl$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  @ViewChild("modal")
  public modal: any;

  @ViewChild("modalDelete")
  public modalDelete: any;
      
  get f(): any {
    return this.userForm.controls;
  }

  constructor(private userService: UserService,
              private profileService: ProfileService,
              private countryService: CountryService,
              private modalService: NgbModal,
              private formBuilder: UntypedFormBuilder,
              private datepipe: DatePipe,
    ) {}

  ngOnInit(): void {

    this.breadCrumbItems = [
      { label: 'Settings' },
      { label: 'Users', active: true }
    ];

    this.viewType = Number(sessionStorage.getItem('viewType'));
    this.resGuid  = sessionStorage.getItem('resGuid')!;

    this.pagination = {currentPage: 1, pageSize: 6, totalCount: 1, totalPages:1} as Pagination;
    this.getUsers();
    
    this.getProfiles();
    this.getCountries();
          
    this.userForm = this.formBuilder.group({
      id             : [''],
      profileId      : ['', [Validators.required]],
      firstName      : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
      lastName       : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
      phone          : ['', [Validators.maxLength(40)]],
      email          : ['', [Validators.required, Validators.maxLength(60), Validators.email]],
      countryId      : ['', [Validators.required]],
      state          : ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]],
      city           : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
      password       : ['', [Validators.required, Validators.minLength(8), Validators.maxLength(40)]],
      access         : ['', [Validators.required]],
      attempts       : ['', [Validators.required]],
      blocked        : ['', [Validators.required]],
      imgTypeProfile : ['', [Validators.maxLength(4)]],
      imgTypeCover   : ['', [Validators.maxLength(4)]],
      register       : ['', [Validators.required]]
    });
  }

  //GLOBAL

  public getUsers(): void {
    this.userService.getByAccount(this.pagination.currentPage, 
                                  this.pagination.pageSize,
                                  this.term,
                                  this.sortField,
                                  this.sortReverse).subscribe({
      next: (paginatedResult: PaginatedResult<User[]>) => {
        this.users = paginatedResult.result!;
        this.pagination = paginatedResult.pagination!;
        if (this.users.length > 0) {
          this.userView = this.users[0];
        } else {
          this.userView = {};
        }
      },
      error: (error: any) => {
        console.error('error getUsers');
      }
    })
  }  

  public getById(id: any) {
    if (id > 0) {
      this.userService.getById(id).subscribe({
        next: (res: User) => {
          this.userView = res;
        },
        error: (error: any) => {
          console.error(error);
        }
      })
    }
  }

  public showDate(date: Date): string{
    return this.datepipe.transform(date, 'yyyy MMM dd')!;;
  }

  public getProfiles(): void {
    let accountId = Number(sessionStorage.getItem('accountId'));
    this.profileService.getByAccountList(accountId).subscribe({
      next: (resProfiles: Profile[]) => {
        this.profiles = resProfiles;
      },
      error: (error: any) => {
        console.error(error);
        this.msg('error getProfiles');
      }
    })
  }

  public getCountries(): void {
    this.countryService.get('').subscribe({
      next: (resCountries: Country[]) => {
        this.countries = resCountries;
      },
      error: (error: any) => {
        console.error(error);
        this.msg('error getCountries');
      }
    })
  }

  // PAGINATION 

  public pageChanged(event: any): void {
    if (this.pagination.currentPage != event.page) {
      this.pagination.currentPage = event.page;
      this.getUsers();
    }
  }

  public showingEntries(): string{
    var x: number = 1 + (this.pagination.currentPage! -1 ) * (this.pagination.pageSize!);
    var y: number = x + (this.pagination.pageSize!) - 1;
    var z: number = this.pagination.totalCount!;
    if (x > z) { x = z};
    if (y > z) { y = z};
    return "Showing entries " + x +  " to " + y + " of " + z;
  }

  //SEARCH

  public filterUsers(evt: any) : void {
    if (this.termoBuscaChanged.observers.length == 0){
      this.termoBuscaChanged.pipe(debounceTime(400)).subscribe({
        next: (term) => {
          this.pagination.currentPage = 1;
          this.term = term;
          this.getUsers();
        }
      });
    }
    this.termoBuscaChanged.next(evt.value);
  }

  //ORDER

  public orderByChange() {
    this.sortReverse = false;
    this.getUsers(); 
  }

  public orderByColumn(sortField: string) {
    if(sortField == this.sortField) 
      { this.sortReverse = !this.sortReverse; }
    else 
      { this.sortReverse = false; }
    this.sortField = sortField;
    this.getUsers(); 
  }

  //CHECKBOX
  
  public checkUncheckAll(ev: any) {
    var checkboxes: any = document.getElementsByName('checkAll');
    for (var i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = this.masterSelected;
    }
    this.masterSelected ? 
      (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : 
      (document.getElementById("remove-actions") as HTMLElement).style.display = "none"; 
  }

  public onCheckboxChange(e: any) {
    var someCheck: boolean = false;
    var checkboxes: any = document.getElementsByName('checkAll');
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked == true) {
        someCheck = true;
        break;
      }
    }
    someCheck ? 
      (document.getElementById("remove-actions") as HTMLElement).style.display = "block" : 
      (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
  } 

  //DELETE

  public deleteItem(modal: any, id: any) {
    this.checkedValGet = [];
    this.checkedValGet.push(id);
    this.modalService.open(modal, { centered: true });
  }

  public deleteMultiple(modal: any) {
    this.checkedValGet = [];
    var checkboxes: any = document.getElementsByName('checkAll');
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        this.checkedValGet.push(checkboxes[i].value);
      }
    }
    if (this.checkedValGet.length > 0) {
      this.modalService.open(modal, { centered: true });
    }
  }

  public delete() {
    this.checkedValGet.forEach((i: any) => {
      this.userService.delete(i).subscribe({
        next: (res: any) => {  
          this.getUsers();          
        },
        error: (error: any) => {
          console.error(error);
        }
      })
    });
    (document.getElementById("remove-actions") as HTMLElement).style.display = "none";
    this.masterSelected = false;
  }

  //ADD EDIT SAVE

  public add(modal: any): void {
    //Reset and Id
    this.userForm.reset();
    this.userForm.controls['id'].setValue(0);
    //Combos position
    this.userForm.controls['profileId'].setValue('');
    this.userForm.controls['countryId'].setValue('');
    //Fields not included in the form
    this.userForm.controls['password'].setValue('12345678');
    this.userForm.controls['access'].setValue(new Date());
    this.userForm.controls['attempts'].setValue(0);
    this.userForm.controls['blocked'].setValue(false);
    this.userForm.controls['register'].setValue(new Date());
    //Mode and Modal    
    this.modeForm = 'post';
    this.modalService.open(modal, { size: 'lg', centered: true });
    //Image Profile
    this.fileListProfile = null;
    var img_profile: any = document.getElementById("profile-img");
    img_profile.src = '/assets/images/system/profile_user.jpg';
    //Image Cover
    this.fileListCover = null;
    var img_cover: any = document.getElementById("cover-img");
    img_cover.src = '/assets/images/system/cover.jpg';
  }

  public edit(modal: any, id: any): void {
    if (id > 0) {
      //Get user by id
      this.userService.getById(id).subscribe({
        next: (res: User) => {
          //Reset
          this.userForm.reset();
          //Mode and Modal
          this.modeForm = 'put';
          this.modalService.open(modal, { size: 'lg', centered: true });
          //Change Title
          var modelTitle = document.getElementById('modalTitle') as HTMLAreaElement;
          modelTitle.innerHTML = 'Edit User';
          //********** Object to interface **********
          this.userForm.patchValue(res);
          //Combo Profile
          this.userForm.controls['profileId'].setValue(res.profileId);
          //Combo Country
          this.userForm.controls['countryId'].setValue(res.countryId);
          //Image Profile
          this.fileListProfile = null;
          var img_profile: any = document.getElementById("profile-img");
          img_profile.src = this.imgUserProfileSrc(res);
          //Image Cover
          this.fileListCover = null;
          var img_cover: any = document.getElementById("cover-img");
          img_cover.src = this.imgUserCoverSrc(res);
        },
        error: (error: any) => {
          console.error(error);
        }
      }); 
    }
  }

  public save(): void {
    if (this.userForm.valid){
      var s_user = {...this.userForm.value}; 
      if (this.modeForm == 'post') {
        //Add
        if (this.fileListProfile != null) {
          s_user.imgTypeProfile = this.fileListProfile.files[0].name.split('.').pop();
        }
        if (this.fileListCover != null) {
          s_user.imgTypeCover = this.fileListCover.files[0].name.split('.').pop();
        }
        this.userService.post(s_user).subscribe({
          next: (res: User) => {
            if (this.fileListProfile != null) {
              this.uploadImageProfile(res.id!, this.fileListProfile.files[0]!);
            }
            if (this.fileListCover != null) {
               this.uploadImageCover(res.id!, this.fileListCover.files[0]);
            }
            this.msg('Success - User add !');
            this.userForm.reset();
            this.getUsers();
            this.modalService.dismissAll();
          },
          error: (error: any) => {
            this.msg(error + 'error: addUser');
          }
        })
      }
      else {
        if (this.modeForm == 'put') {
          //Edit
          if (this.fileListProfile != null) {
           s_user.imgTypeProfile = this.fileListProfile.files[0].name.split('.').pop();
           this.uploadImageProfile(s_user.id!, this.fileListProfile.files[0]);
          }
          if (this.fileListCover != null) {
            s_user.imgTypeCover = this.fileListCover.files[0].name.split('.').pop();
            this.uploadImageCover(s_user.id!, this.fileListCover.files[0]);
          }
          this.userService.put(s_user).subscribe({
            next: (res: User) => {
              this.msg('Success - User update !');
              this.userForm.reset();
              this.getUsers();
              this.modalService.dismissAll();
              // location.reload();
            },
            error: (error: any) => {
              this.msg('error: updateUser');
            }
          })
        }
      }
    }
  }

  //IMAGES
   
  public imgUserProfileSrc(user: User): any{
    if (user.imgTypeProfile != null) {
      var imgPath = GlobalComponent.ipPort + this.resGuid + 'Images/Users/Profiles/';
      var moment  = '?' + this.datepipe.transform(new Date, 'hhmmss'); 
      return imgPath + user.id + '.' + user.imgTypeProfile + moment;
    }
    else {
      return '/assets/images/system/profile_user.jpg';
    }
  }

  public imgUserProfileSrc$(user: User): any{
    if (user.imgTypeProfile != null) {
      var imgPath = GlobalComponent.ipPort + this.resGuid + 'Images/Users/Profiles/';
      var moment  = '?' + this.datepipe.transform(new Date, 'hhmmss'); 
      var url = imgPath + user.id + '.' + user.imgTypeProfile + moment;
      this.imageUrl$.next(url);
    }
  }

  public getObservableImageUrl(): Observable<string> {
    return this.imageUrl$;
  }

  public imgUserCoverSrc(user: User): any{
    if (user.imgTypeCover != null) {
      var imgPath = GlobalComponent.ipPort + this.resGuid + 'Images/Users/Covers/';
      var moment = '?' + this.datepipe.transform(new Date, 'hhmmss'); 
      return imgPath + user.id + '.' + user.imgTypeCover + moment;
    }
    else {
      return '/assets/images/system/cover.jpg';
    }
  }

  public fileChangeProfile(event: any): void {
    this.fileListProfile = (event.target as HTMLInputElement);
    this.userForm.patchValue({
      image_src: this.fileListProfile.files[0].name
    });
    const reader = new FileReader();
    reader.onload = () => {
      this.imgUrl = reader.result as string;
      (document.getElementById('profile-img') as HTMLImageElement).src = this.imgUrl;
    }
    reader.readAsDataURL(this.fileListProfile.files[0]);
  }

  public fileChangeCover(event: any): void {
    this.fileListCover = (event.target as HTMLInputElement);
    this.userForm.patchValue({
      image_src: this.fileListCover.files[0].name
    });
    const reader = new FileReader();
    reader.onload = () => {
      this.imgUrl = reader.result as string;
      (document.getElementById('cover-img') as HTMLImageElement).src = this.imgUrl;
    }
    reader.readAsDataURL(this.fileListCover.files[0]);
  }

  public uploadImageProfile(userId: number, file: File): void {
    var ext = file!.name.split('.').pop();
    var pathName =  this.resGuid + 'Images/Users/Profiles/' + userId + '.' + ext;
    this.userService.uploadImage(pathName, file).subscribe({
      next: () => {
      },
      error: (error: any) => {
      }
    })
  }

  public uploadImageCover(userId: number, file: File): void {
    var ext = file!.name.split('.').pop();
    var pathName =  this.resGuid + 'Images/Users/Covers/' + userId + '.' + ext;
    this.userService.uploadImage(pathName, file).subscribe({
      next: () => {
      },
      error: (error: any) => {
      }
   })
  }
 
  //MSG

  public msg(msg: string){
    let timerInterval: any;
    Swal.fire({
      title: msg,
      icon: 'success',
      timer: 2000,
      timerProgressBar: true,
      willClose: () => {
        clearInterval(timerInterval);
      },
    })
  }
 
}