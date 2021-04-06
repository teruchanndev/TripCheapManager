export interface Service {
    name: string;
    included: Array<string>;
    notIncluded: Array<string>;
    timeStart: string;
    timeStop: string;
    dayActive: string;
    //set độ tuổi
    itemService: Array<
    {
        name: string,
        price: number
    }>
}
  