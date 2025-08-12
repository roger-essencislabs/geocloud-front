import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject, debounceTime } from 'rxjs';
import Swal from 'sweetalert2';

import { PaginatedResult, Pagination } from 'src/app/models/Pagination';
import { Profile } from 'src/app/models/Profile';

import { ProfileService } from 'src/app/services/profile.service';
import { GlobalComponent } from 'src/app/global-component';
import { CommonModule, DatePipe } from '@angular/common';
import { ProfilesGridComponent } from './profiles-grid/profiles-grid.component';
import { ProfilesListComponent } from './profiles-list/profiles-list.component';
import { BreadcrumbsComponent } from 'src/app/shared/breadcrumbs/breadcrumbs.component';
import { ProfileAvatar } from 'src/app/models/AvatarList';
import { profileAvatarsData } from 'src/assets/js/ProfileAvatarList';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbNavModule,
    ProfilesGridComponent,
    ProfilesListComponent,
    BreadcrumbsComponent
  ]
})

export class ProfilesComponent implements OnInit{

  //VAR - GLOBAL
  public breadCrumbItems!: Array<{}>;
  public profiles: Profile[] = [];
  public profileView = {} as Profile;
  public accountId: number = 0;
  public resGuid: string = '';
  public profileForm!: FormGroup;
  public modeForm: string = '';
  public viewType: number = 1;
  public profileAvatarList: ProfileAvatar[] = []

  //VAR - PAGINATION / SEARCH / SORT
  public pagination = {} as Pagination;
  public term = '';
  public sortField = 'p.id';
  public sortReverse = false;
  public termoBuscaChanged: Subject<string> = new Subject<string>();
  
  //VAR CHECKBOX
  public checkedValGet: number[] = [];
  public masterSelected!: boolean;

  //IMAGES
  public imgUrl: string | undefined;
  public fileList: any;
    
  @ViewChild("modal")
  public modal: any;

  @ViewChild("modalDelete")
  public modalDelete: any;
      
  get f(): any {
    return this.profileForm.controls;
  }

  constructor(private formBuilder: UntypedFormBuilder,
              private modalService: NgbModal,
              private profileService: ProfileService,  
              private datepipe: DatePipe,         
              ) {}

  ngOnInit(): void {
   
    this.breadCrumbItems = [
      { label: 'Settings' },
      { label: 'Profiles', active: true }
    ];

    this.viewType  = Number(sessionStorage.getItem('viewType'));
    this.accountId = Number(sessionStorage.getItem('accountId'));
    this.resGuid   = sessionStorage.getItem('resGuid')!;
    
    this.pagination = {currentPage: 1, pageSize: 6, totalCount: 1, totalPages:1} as Pagination;
    this.getProfiles();
          
    this.profileForm = this.formBuilder.group({
      id        : [''],
      accountId : ['', [Validators.required]],
      name      : ['', [Validators.required, Validators.minLength(4), Validators.maxLength(40)]],
      imgType   : ['', [Validators.maxLength(4)]],
    });

    // List Avatars
    this.profileAvatarList = profileAvatarsData;
    console.log("Lista: ", this.profileAvatarList);
  }

    public countProfile(name: string | undefined): number{
      return this.profileAvatarList.filter( u => u.profile === name).length;
    }

  //GLOBAL

  public getProfiles(): void {
    this.profileService.getByAccount(this.pagination.currentPage, 
                                    this.pagination.pageSize,
                                    this.term,
                                    this.sortField,
                                    this.sortReverse).subscribe({
      next: (paginatedResult: PaginatedResult<Profile[]>) => {
        this.profiles = paginatedResult.result!;
        this.pagination = paginatedResult.pagination!;
        if (this.profiles.length > 0) {
          this.profileView = this.profiles[0];
        } else {
          this.profileView = {};
        }
      },
      error: (error: any) => {
        console.error('error getProfiles');
      }
    })
  }  

  public getById(id: any) {
    if (id > 0) {
      this.profileService.getById(id).subscribe({
        next: (res: Profile) => {
          this.profileView = res;
        },
        error: (error: any) => {
          console.error(error);
        }
      })
    }
  }

  //PAGINATION 

  public pageChanged(event: any): void {
    if (this.pagination.currentPage != event.page) {
      this.pagination.currentPage = event.page;
      this.getProfiles();
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

  public filterProfiles(evt: any) : void {
    if (this.termoBuscaChanged.observers.length == 0){
      this.termoBuscaChanged.pipe(debounceTime(400)).subscribe({
        next: (term) => {
          this.pagination.currentPage = 1;
          this.term = term;
          this.getProfiles();
        }
      });
    }
    this.termoBuscaChanged.next(evt.value);
  }

  //ORDER

  public orderByChange() {
    this.sortReverse = false;
    this.getProfiles(); 
  }

  public orderByColumn(sortField: string) {
    if(sortField == this.sortField) 
      { this.sortReverse = !this.sortReverse; }
    else 
      { this.sortReverse = false; }
    this.sortField = sortField;
    this.getProfiles(); 
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
      this.profileService.delete(i).subscribe({
        next: (res: any) => {  
          this.getProfiles();          
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
    this.profileForm.reset();
    this.profileForm.controls['id'].setValue(0);
    //Account
    this.profileForm.controls['accountId'].setValue(this.accountId);
    //Mode and Modal
    this.modeForm = 'post';
    this.modalService.open(modal, { size: 'md', centered: true });
    //Image 
    this.fileList = null;
    var img: any = document.getElementById("avatar-img");
    img.src = '/assets/images/system/profile.jpg';
  }

  public edit(modal: any, id: any): void {
    if (id > 0) {
      //Get profile by id
      this.profileService.getById(id).subscribe({
        next: (res: Profile) => {
          //Reset
          this.profileForm.reset();
          //Mode and Modal
          this.modeForm = 'put';
          this.modalService.open(modal, { size: 'md', centered: true });
          //Change Title 
          var modelTitle = document.getElementById('modalTitle') as HTMLAreaElement;
          modelTitle.innerHTML = 'Edit Profile';
          //********** Object to interface **********
          this.profileForm.patchValue(res);
          //Image 
          this.fileList = null;
          var img: any = document.getElementById("avatar-img");
          img.src = this.imgSrc(res);
        },
        error: (error: any) => {
          console.error(error);
        }
      }); 
    }
  }

  public save(): void {
    if (this.profileForm.valid){
      var s_profile = {...this.profileForm.value};
      if (this.modeForm == 'post') {
        //Add
        if (this.fileList != null) {
          s_profile.imgType = this.fileList.files[0].name.split('.').pop();
        }
        this.profileService.post(s_profile).subscribe({
          next: (res: Profile) => {
            if (this.fileList != null) {
              this.uploadImage(res.id!, this.fileList.files[0]!);
            }
            this.msg('Success - Profile add !');
            this.profileForm.reset();
            this.getProfiles();
            this.modalService.dismissAll();
          },
          error: (error: any) => {
            this.msg('error: addProfile');
          }
        })
      }
      else {
        if (this.modeForm == 'put') {
          //Edit
          if (this.fileList != null) {
            s_profile.imgType = this.fileList.files[0].name.split('.').pop();
            this.uploadImage(s_profile.id!, this.fileList.files[0]);
          }
          this.profileService.put(s_profile).subscribe({
            next: (res: Profile) => {
              this.msg('Success - Profile update !');
              this.profileForm.reset();
              this.getProfiles();
              this.modalService.dismissAll();
            },
            error: (error: any) => {
              this.msg('error: updateProfile');
            }
          })
        }
      }
    }
  }

  //IMAGES
   
  public imgSrc(profile: Profile): any{
    if (profile.imgType != null) {
      var imgPath = GlobalComponent.ipPort + this.resGuid + 'Images/Profiles/';
      var moment  = '?' + this.datepipe.transform(new Date, 'hhmmss'); 
      return imgPath + profile.id + '.' + profile.imgType + moment;
    }
    else {
      return '/assets/images/system/profile.jpg';
    }
  }
  
  public fileChange(event: any): void {
    this.fileList = (event.target as HTMLInputElement);
    this.profileForm.patchValue({
      image_src: this.fileList.files[0].name
    });
    const reader = new FileReader();
    reader.onload = () => {
      this.imgUrl = reader.result as string;
      (document.getElementById('avatar-img') as HTMLImageElement).src = this.imgUrl;
    }
    reader.readAsDataURL(this.fileList.files[0]);
  }

  public uploadImage(profileId: number, file: File): void {
    var ext = file!.name.split('.').pop();
    var pathName =  this.resGuid + 'Images/Profiles/' + profileId + '.' + ext;
    this.profileService.uploadImage(pathName, file).subscribe({
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
