import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class SearchService {
    private TaskTermSource = new BehaviorSubject<string>(''); // Initial value is empty
    currentTaskTerm = this.TaskTermSource.asObservable();
  
    constructor() {}
  
    UpdatesearchTerm(searchTerm: string) {
      this.TaskTermSource.next(searchTerm); // Emit the new search term
    }
  }
 