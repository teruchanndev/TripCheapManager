import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  arrayBuffer:any;
  file:File;
  incomingfile(event) 
  {
    this.file= event.target.files[0]; 
  }

  Upload() {
      let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, {type:"binary"});
            for(let item of workbook.SheetNames) {
              // var first_sheet_name = workbook.SheetNames[1];
              var worksheet = workbook.Sheets[item];
              console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
            }
            
        }
        fileReader.readAsArrayBuffer(this.file);
  }

}
