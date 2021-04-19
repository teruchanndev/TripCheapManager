import { Component, OnInit } from '@angular/core';
import { Ticket } from 'src/app/modals/ticket.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  ticket: Ticket;

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
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            var row = XLSX.utils.sheet_to_json(worksheet,{raw:true});
            console.log(row[0]['address']);
        }
        fileReader.readAsArrayBuffer(this.file);
  }

}
