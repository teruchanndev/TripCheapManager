import { ServiceSelect } from './serviceSelect.model';

export interface Order {
    id: string;
    nameTicket: string;
    imageTicket: string;
    dateStart: string;
    dateEnd: string;
    idTicket: string;
    idCreator: string;
    idCustomer: string;
    itemService: Array<ServiceSelect>;
    payMethod: string;
    status: boolean; // dùng or chưa dùng
    isCancel: boolean; // người dùng hủy
    isSuccess: boolean; // người bán hủy
    isConfirm: boolean; // người bán xác nhận
    created_at: Date;
}
