import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MenuService {

    private openSidebar = new Subject<boolean>();

    public getValueOpenSidebar() {
        return this.openSidebar;
    }

    public notifyValueOpenSidebar(bool: boolean) {
        this.openSidebar.next(bool);
    }
}
