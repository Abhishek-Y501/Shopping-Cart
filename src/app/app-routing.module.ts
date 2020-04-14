import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppCustomPreloaderService } from './shared/services/app-custom-preloader.service';


const routes: Routes = [
  {
    path: '', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  }, {
    path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule), data: { preload: true }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: AppCustomPreloaderService })],
  exports: [RouterModule],
  providers: [AppCustomPreloaderService]
})
export class AppRoutingModule { }
