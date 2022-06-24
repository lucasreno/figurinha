import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';

const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {
  isAutheticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY});
    if(token && token.value){
      this.token = token.value;
      this.isAutheticated.next(true);
    }else{
      this.isAutheticated.next(false);
    }
  }

  login(credenciais: { login, senha }): Observable<any> {
    return this.http.post('http://lucasreno.kinghost.net/login', credenciais).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        return from(Storage.set({ key: TOKEN_KEY, value: token }))
      }),
      tap(_ => { this.isAutheticated.next(true) })
    );
  }

  logout(): Promise<void> {
    this.isAutheticated.next(false);
    return Storage.remove({ key: TOKEN_KEY });
  }
}
