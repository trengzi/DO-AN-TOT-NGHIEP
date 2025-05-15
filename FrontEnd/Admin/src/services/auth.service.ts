import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public static isDangNhap = false;
  static dataSubject: Subject<boolean> = new Subject<boolean>();
  public static role = localStorage.getItem('roleAdmin') ?? 1;
  static dataSubjectRole: Subject<number> = new Subject<number>();
  public static employeeId = localStorage.getItem('employeeId');
  static dataSubjectEmployeeId: Subject<any> = new Subject<any>();

  constructor(){
    const storedValue = localStorage.getItem('isLoggedInAdmin');
    const storedValueRole = localStorage.getItem('roleAdmin');
    const storedValueEmployeeId = localStorage.getItem('employeeId');
    if(typeof(storedValue) == 'boolean')
    AuthService.isDangNhap = storedValue;
    if(typeof(storedValueRole) == 'number')
    AuthService.role = storedValueRole;
    AuthService.employeeId = storedValueEmployeeId;
  }

  // 1: admin, 2: manager, 3: employee
  updateData(newData: boolean, newDataRow: number, employeeId: any) {
    AuthService.dataSubject.next(newData);
    AuthService.isDangNhap = newData;
    AuthService.role = newDataRow;
    AuthService.employeeId = employeeId
    AuthService.dataSubjectEmployeeId.next(employeeId);
    localStorage.setItem('isLoggedInAdmin', newData.toString());
    localStorage.setItem('roleAdmin', newDataRow.toString());
    localStorage.setItem('employeeId', employeeId)
  }

  dangXuat():void{
    this.updateData(false, 0, '');
  }
}
