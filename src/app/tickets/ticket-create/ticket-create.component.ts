import { flatten } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Ticket } from '../ticket.model';
import { TicketsService } from '../tickets.service';

interface Category {
  name: string;
  categoryItem: Array<string>;
}

@Component({
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.css']
})
export class TicketCreateComponent implements OnInit {

  categories: Category[] = [
    {
      name: 'các điểm tham quan',
      // tslint:disable-next-line:max-line-length
      categoryItem: ['công viên và công viên nước', 'bảo tàng và triển lãm', 'thiên nhiên kỳ thú', 'Cáp treo và ngắm cảnh', 'Di tích lịch sử', 'Vé và vé tham quan']
    },
    {
      name: 'tour',
      // tslint:disable-next-line:max-line-length
      categoryItem: ['đạp xe và đi bộ', 'tour riêng', 'ngắm cảnh từ trên cao', 'tour biển đảo', 'tham quan']
    },
    {
      name: 'thể thao và hoạt động ngoài trời',
      // tslint:disable-next-line:max-line-length
      categoryItem: ['hoạt động dưới nước', 'hoạt động ngoài trời', 'cắm trại', 'ván trượt tuyết']
    },
    {
      name: 'thư giãn & làm đẹp',
      // tslint:disable-next-line:max-line-length
      categoryItem: ['spa & massanges', 'làm đẹp', 'suối nước nóng']
    },
    {
      name: 'văn hóa & workshops',
      // tslint:disable-next-line:max-line-length
      categoryItem: ['lớp học truyền thống', 'lớp học & workshops']
    },
    {
      name: 'Vui chơi & giải trí về đêm',
      // tslint:disable-next-line:max-line-length
      categoryItem: ['games & VR', 'hoạt động về đêm & đồ uống']
    }
  ];

  price = 0;
  percent = 0;
  price_reduce = 0;
  selectItem = '';
  valueItemSelect = '';
  valueItem: Array<string>;

  ticket: Ticket;

  isChecked = false;

  calPrice_reduce() {
    this.price_reduce = this.price - (this.price * this.percent) / 100;
  }

  changeSelectCategory(value) {
    if ( value === '' ) {
      this.valueItem = [];
    } else {
      this.valueItem = this.categories
                .find(item => item.name === value).categoryItem;
    }
  }

  checkStt(){
    if(this.isChecked){
      this.isChecked = false;
    } else {
      this.isChecked = true;
    }
    console.log(this.isChecked);
  }

  constructor(
    public ticketsService: TicketsService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  onSaveTicket(form: NgForm) {
    if (form.invalid) { return; } else {
      const ticket = this.ticketsService.addTicket(
        form.value.title,
        form.value.content,
        this.isChecked,
        form.value.price,
        this.price_reduce,
        form.value.percent,
        this.selectItem,
        this.valueItemSelect,
        form.value.city);
      console.log(ticket);
    }
    form.reset();
  }


}
