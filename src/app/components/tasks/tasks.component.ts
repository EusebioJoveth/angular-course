import { Component, Input } from '@angular/core';
import { TaskComponent } from './task/task.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { type NewTask } from '../../models/new-task';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TaskComponent, NewTaskComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {

  @Input({required: true}) userId!:string;
  @Input({required: true}) userName ?: string;
  isAddingTask = false;

  constructor(private _taskService: TasksService) {
  }



  get selectedUserTasks(){
    return this._taskService.getUserTasks(this.userId)
  }

  onStartAddTask(){
    this.isAddingTask = true;
  }

  onCancelAddTask(){
    this.isAddingTask = false;
  }

  onAddTask(taskData:NewTask){

    this.isAddingTask = false;
  }
}
