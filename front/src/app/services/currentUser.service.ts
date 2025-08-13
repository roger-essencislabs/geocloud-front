import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, take } from 'rxjs';
import { GlobalComponent } from '../global-component';
import { User } from '../models/User';
import { DatePipe } from '@angular/common';
import { catchError } from 'rxjs';

@Injectable({providedIn: 'root'})
export class CurrentUserService {

  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  public login(email: string, password: string): Observable<void>{
  return this.http.get<User>(`${GlobalComponent.baseUrl}User/login?email=${email}&password=${password}`).pipe(
    take(1),
    map((response: User) => {
      this.setCurrentUser(response);
         const user = response;
         if (user) {
          this.setCurrentUser(user);
         }
    }),
    catchError((error) => {
      if (error == 'OK')
        throw 'Invalid email or password';
      else
      {
        console.error('Server unavailable or network error:', error);
        throw 'Server unavailable or network error';
      }
    })
  );
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
            label: 'MENUITEMS.SETTINGS.LIST.USERS',
            link: '/users',
          },
          {
            id: 1020,
            label: 'MENUITEMS.SETTINGS.LIST.PROFILES',
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
            label: 'MENUITEMS.MENU1.LIST.ITEM1.TEXT',
            subItems: [
              {
                id: 2011,
                label: 'MENUITEMS.MENU1.LIST.ITEM1.LIST.SUBITEM11',
                // link: '/pages/1',
                parentId: 2010
              },
              {
                id: 2012,
                label: 'MENUITEMS.MENU1.LIST.ITEM1.LIST.SUBITEM12',
                // link: '/pages/2',
                parentId: 2010
              },
            ]
          },
        ]
      },
      {
          id: 4000,
          label: 'MENUITEMS.LIMS.TEXT',
          collapseid: 'Menu LIMS',
          icon: 'ri-flask-fill', // Icone de Backer.
          subItems: [
            {
              id: 4010,
              label: 'MENUITEMS.LIMS.LIST.ITEM1.TEXT',
              subItems: [
                {
                  id: 4011,
                  label: 'MENUITEMS.LIMS.LIST.ITEM1.LIST.SUBITEM11',
                  // link: '/pages/5',
                  parentId: 4010
                },
                {
                  id: 4012,
                  label: 'MENUITEMS.LIMS.LIST.ITEM1.LIST.SUBITEM12',
                  // link: '/pages/6',
                  parentId: 4010
                },
              ]
            },
          ]
        }
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
              label: 'MENUITEMS.MENUADM.LIST.ITEMADM1.TEXT',
              subItems: [
                {
                  id: 3011,
                  label: 'MENUITEMS.MENUADM.LIST.ITEMADM1.LIST.SUBITEMADM1',
                  // link: '/pages/5',
                  parentId: 3010
                },
                {
                  id: 3012,
                  label: 'MENUITEMS.MENUADM.LIST.ITEMADM1.LIST.SUBITEMADM2',
                  // link: '/pages/5',
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




