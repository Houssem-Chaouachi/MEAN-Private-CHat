import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as io from 'socket.io-client';
import * as jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  connectedUser: any;
  socket: any;
  constructor(private httpClient: HttpClient, private router: Router) {
    this.connectedUser = this.getConnectedUser();
  }
  login(form) {
    return this.httpClient.post('http://localhost:3002/users/login', form);
  }
  register(user) {
    return this.httpClient.post('http://localhost:3002/users/register', user);
  }
  getListeUsers() {
    return this.httpClient.get('http://localhost:3002/users/getListeUsers');
  }
  saveToken(token) {
    localStorage.setItem( 'token', token);
    this.connectedUser = this.getConnectedUser();
  }
  removeToken() {
    localStorage.deleteAll();
  }
  getConnectedUser() {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      return jwt_decode(token).data;
    }
  }
  validToken() {
    if (localStorage.getItem('token')) {
      return true;
    }
    this.connectedUser = {};
    return false;
  }
  logout() {
    localStorage.clear();
    this.connectedUser = null;
    this.router.navigateByUrl('/home');
    window.location.reload(true);
  }
}
