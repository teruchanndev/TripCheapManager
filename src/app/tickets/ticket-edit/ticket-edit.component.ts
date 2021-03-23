import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Ticket } from '../ticket.model';
import { TicketsService } from '../tickets.service';

interface Category {
  name: string;
  categoryItem: Array<string>;
}

@Component({
  selector: 'app-ticket-edit',
  templateUrl: './ticket-edit.component.html',
  styleUrls: ['./ticket-edit.component.css']
})
export class TicketEditComponent implements OnInit {

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

  private ticketId: string;
  ticket: Ticket;
  isChecked: boolean; //check status true hay false => set checked slide toggle

  price_reduce;
  selectItem;
  valueItem = [];

  selectedCategory;
  selectedCategoryService;
  percent = 0;
  price = 0;

  constructor(
    public ticketsService: TicketsService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.ticketId = paramMap.get("ticketId");
      this.ticketsService.getTicket(this.ticketId).subscribe(ticketData => {
        this.ticket = {id: ticketData._id,
                       title: ticketData.title,
                       content: ticketData.content,
                       status: ticketData.status,
                       price: ticketData.price,
                       city: ticketData.city,
                       category: ticketData.category,
                       categoryService: ticketData.categoryService,
                       percent: ticketData.percent,
                       price_reduce: ticketData.price_reduce};
        console.log(ticketData);
        this.isChecked = ticketData.status;
        this.selectedCategory = ticketData.category;
        this.selectedCategoryService = ticketData.categoryService;
        this.valueItem = this.categories
        .find(item => item.name === ticketData.category).categoryItem;
      });
    });
  }


  checkStt(){
    if(this.isChecked){
      this.isChecked = false;
    } else {
      this.isChecked = true;
    }
    console.log(this.isChecked);
  }


  calPrice_reduce(){
      this.price_reduce = this.price - (this.price * this.percent) / 100;
      console.log(this.price);
      console.log(this.percent);
      console.log(this.price_reduce);
  }

  onUpdateTicket(form: NgForm){
    this.ticketsService.updateTickets(
      this.ticketId,
      form.value.title,
      form.value.content,
      this.isChecked,
      form.value.price,
      this.price_reduce,
      form.value.percent,
      this.selectedCategory,
      this.selectedCategoryService,
      form.value.city
    );
  }

  changeSelectCategory(value){
    if ( value === '' ) {
      this.valueItem = [];
    } else {
      this.valueItem = this.categories
                .find(item => item.name === value).categoryItem;
    }
  }


}
