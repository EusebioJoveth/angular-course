import { Component, inject, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Task } from '../../../models/task';
import { CardComponent } from '../../../shared/card/card.component';
import { TasksService } from '../../../services/tasks.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [ CardComponent, DatePipe ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {

  @Input({required:true}) task!:Task;
  private _taskService = inject(TasksService);

  onCompleteTask(){
    this._taskService.removeTask(this.task.id);
  }

}
