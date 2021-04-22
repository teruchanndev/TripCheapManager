import { Component, OnInit } from '@angular/core';
import { Ticket } from 'src/app/modals/ticket.model';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-tickets-create-from-excel',
  templateUrl: './tickets-create-from-excel.component.html',
  styleUrls: ['./tickets-create-from-excel.component.css']
})
export class TicketsCreateFromExcelComponent implements OnInit {
  ticket: Ticket;

  arrayBuffer: any;
  file: File;
  constructor() { }

  ngOnInit(): void {
  }

  incomingfile(event) {
    this.file = event.target.files[0];
  }
  Upload() {
    const fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            const data = new Uint8Array(this.arrayBuffer);
            const arr = new Array();
            for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
            const bstr = arr.join('');
            const workbook = XLSX.read(bstr, {type: 'binary'});
            const first_sheet_name = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[first_sheet_name];
            const row = XLSX.utils.sheet_to_json(worksheet, {raw: true});
            console.log(row[0]['address']);
        };
        fileReader.readAsArrayBuffer(this.file);
  }

}
