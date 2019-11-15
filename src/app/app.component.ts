import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  searchForm: FormGroup;
  data: any;
  name: any;
  avatarUrl: any;
  location: any;
  htmlUrl: any;
  dataLoading = false;
  dataFound = false;
  dataNotFound = false;
  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }
  ngOnInit() {
    this.searchForm = new FormGroup({
      searchText : new FormControl('')
    });
  }

  fetchProfile(username) {
    return this.http.get('https://api.github.com/users/' + username + '?access_token=beba3c150021bfb49769385927dfa59fac2cdf04');
  }

  onSubmit() {
    const searchText = this.searchForm.value.searchText;
    const localData = localStorage.getItem(searchText);
    if (searchText) {
      this.setDataLoading();
      if (localData) {
        this.data = JSON.parse(localData);
        this.fillData(this.data);
      } else {
        this.fetchProfile(searchText).subscribe(response => {
          this.data = response;
          this.fillData(this.data);
          localStorage.setItem(searchText, JSON.stringify(this.data));
        }, error => {
          this.setDataNotFound();
          this.openSnackBar('No Profile Found', '');
        });
      }
   } else {
     this.openSnackBar('Enter any text', '');
   }
 }

  fillData(data) {
    this.setDataFound();
    this.name = data.name;
    this.avatarUrl = data.avatar_url;
    this.location = data.location;
    this.htmlUrl = data.html_url;
  }

  setDataFound() {
    this.dataFound = true;
    this.dataNotFound = false;
    this.dataLoading = false;
  }

  setDataNotFound() {
    this.dataFound = false;
    this.dataNotFound = true;
    this.dataLoading = false;
  }

  setDataLoading() {
    this.dataFound = false;
    this.dataNotFound = false;
    this.dataLoading = true;
  }

  openSnackBar(message, action) {
    this.snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }
}
