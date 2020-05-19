import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
const MINUTES_UNITL_AUTO_LOGOUT = 15; // in mins
const CHECK_INTERVAL = 15000; // in ms
const STORE_KEY = 'lastAction';

@Injectable({
  providedIn: 'root'
})

export class AutoLogoutService {

  timerInterval: any;
  private resetListener = () => this.reset();

  public getLastAction() {
    return parseInt(localStorage.getItem(STORE_KEY));
  }
  public setLastAction(lastAction: number) {
    localStorage.setItem(STORE_KEY, lastAction.toString())
  }

  constructor(
    private router: Router
  ) {
  }

  initListener() {
    this.check();
    document.body.addEventListener('click', this.resetListener);
    document.body.addEventListener('mouseover', this.resetListener);
    document.body.addEventListener('mouseout', this.resetListener);
    document.body.addEventListener('keydown', this.resetListener);
    document.body.addEventListener('keyup', this.resetListener);
    document.body.addEventListener('keypress', this.resetListener);
    this.initInterval();
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    this.timerInterval = setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }

  check() {
    const now = Date.now();
    const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;
    if (isTimeout) {
      clearInterval(this.timerInterval);
      localStorage.removeItem('activeUser')
      localStorage.removeItem('user');
      localStorage.removeItem('UD');
      this.router.navigate(['/']);
    }
  }

  removeListener() {
    document.body.removeEventListener('click', this.resetListener);
    document.body.removeEventListener('mouseover', this.resetListener);
    document.body.removeEventListener('mouseout', this.resetListener);
    document.body.removeEventListener('keydown', this.resetListener);
    document.body.removeEventListener('keyup', this.resetListener);
    document.body.removeEventListener('keypress', this.resetListener);
    clearInterval(this.timerInterval);
  }

}
