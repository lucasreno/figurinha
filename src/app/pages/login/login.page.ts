import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { TestObject } from 'protractor/built/driverProviders';
import { AutenticacaoService } from 'src/app/autenticacao.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credenciais: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AutenticacaoService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.credenciais = this.fb.group({
      login: ['teste', [Validators.required, Validators.minLength(3)]],
      senha: ['123', [Validators.required]]
    });
  }

  async login(){
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.login(this.credenciais.value).subscribe(
      async (res) => {
        await loading.dismiss();
        this.router.navigateByUrl('/home');
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login falhou',
          message: res.error,
          buttons: ['OK']
        });
        await alert.present();
      }
    );

  }

}
