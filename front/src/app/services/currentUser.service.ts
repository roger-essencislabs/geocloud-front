import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, take } from 'rxjs';
import { GlobalComponent } from '../global-component';
import { User } from '../models/User';
import { DatePipe } from '@angular/common';

@Injectable({providedIn: 'root'})
export class CurrentUserService {

  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  public login(email: string, password: string): Observable<void>{
    return this.http.get<User>(`${GlobalComponent.baseUrl}User/login?email=${email}&password=${password}`).pipe(
      take(1),
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  }

  public setCurrentUser(user: User): void {
    console.log('setCurrentUser');
    sessionStorage.setItem('user',                    JSON.stringify(user));
    sessionStorage.setItem('userId',                  String(user.id));
    sessionStorage.setItem('userName',                user.firstName + ' ' + user.lastName);
    sessionStorage.setItem('profileId',               String(user.profileId));
    sessionStorage.setItem('profileName',             user.profile?.name!);
    sessionStorage.setItem('accountId',               String(user.profile!.account!.id!));
    sessionStorage.setItem('company',                 user.profile?.account?.company!);
    sessionStorage.setItem('resGuid',                 'Resources/' + user.profile?.account?.guid! + '/');
    sessionStorage.setItem('viewType',                '1');
    //ImgUser
    if (user.imgTypeProfile != null) {
      var imgPath = GlobalComponent.ipPort + sessionStorage.getItem('resGuid') + 'Images/Users/Profiles/';
      var moment  = "?" + this.datePipe.transform(new Date, 'hhmmss'); 
      sessionStorage.setItem('userImg', imgPath + user.id + '.' + user.imgTypeProfile + moment);
    }
    else {
      sessionStorage.setItem('userImg', '/assets/images/system/profile_user.jpg');
    }
    //Make Menu
    var mm = this.makeMenu(user);
    sessionStorage.setItem('menuUser', JSON.stringify(mm));
  }

  public logout(): void {
    console.log('logout');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('userId');      
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userImg');
    sessionStorage.removeItem('profileId');
    sessionStorage.removeItem('profileName');
    sessionStorage.removeItem('accountId');
    sessionStorage.removeItem('company');
    sessionStorage.removeItem('resGuid');
    sessionStorage.removeItem('viewType');
    sessionStorage.removeItem('menuUser');
  }

  public makeMenu(user: User){
    var mm = [
      {
        id: 1000,
        label: 'MENUITEMS.SETTINGS.TEXT',
        collapseid: 'Settings',
        icon: 'ri-reactjs-fill', //'ri-layout-grid-line'
        subItems: [
          {
            id: 1010,
            label: 'Users',
            link: '/users',
          },
          {
            id: 1020,
            label: 'Profiles',
            link: '/profiles',
          },
        ]
      },
      {
        id: 2000,
        label: 'MENUITEMS.MENU1.TEXT',
        collapseid: 'Menu 1',
        icon: 'ri-account-circle-line', //'ri-layout-grid-line'
        subItems: [
          {
            id: 2010,
            label: 'Item 1',
            subItems: [
              {
                id: 2011,
                label: 'Sub Item 11',
                // link: '/pages/1',
                parentId: 2010
              },
              {
                id: 2012,
                label: 'Sub Item 12',
                // link: '/pages/2',
                parentId: 2010
              },
            ]
          },
        ]
      },
      
    ];

    if (user.profile?.account?.id == 1){
      var m1 = 
        {
          id: 3000,
          label: 'MENUITEMS.MENUADM.TEXT',
          collapseid: 'Menu Adm',
          icon: 'ri-building-line', //'ri-layout-grid-line'
          subItems: [
            {
              id: 3010,
              label: 'Item Adm 1',
              subItems: [
                {
                  id: 3011,
                  label: 'Sub Item Adm 1',
                  // link: '/pages/5',
                  parentId: 3010
                },
                {
                  id: 3012,
                  label: 'Sub Item  Adm 2',
                  // link: '/pages/6',
                  parentId: 3010
                },
              ]
            },
          ]
        }
      mm.push(m1);
    }
       
    return mm;
  }
}




