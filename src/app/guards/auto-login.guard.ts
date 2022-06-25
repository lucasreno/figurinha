import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AutenticacaoService } from '../autenticacao.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
  constructor(
    private authService: AutenticacaoService,
    private router: Router
  ) { }

  canLoad(): Observable<boolean> {
    return this.authService.isAutheticated.pipe(
      filter(val => val !== null),
      take(1),
      map(isAuthenticated => {
        console.log("Auto login :)")
        if(isAuthenticated)
          this.router.navigateByUrl('/home')
        else
          return true;
      })
    );
  }
}
