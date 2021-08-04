import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {map} from 'rxjs/operators';
import {User} from '../_models/user';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<User>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) {
  }

  login(model: any): any {
    return this.http.post(this.baseUrl + 'account/login', model).pipe(
      map((response: any) => {
          const user: User = response;
          if (user) {
            this.setCurrentUser(user);
          }
        }
      )
    );
  }

  register(model: any): any {
    return this.http.post(this.baseUrl + 'account/register', model).pipe(
      map((userData: any) => {
        const user: User = userData;
        if (user) {
          this.setCurrentUser(user);
        }
        return userData;
      })
    );
  }

  setCurrentUser(user: User): void {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(undefined);
    this.router.navigate(['/']);
  }

  getDecodedToken(token: string): any {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
