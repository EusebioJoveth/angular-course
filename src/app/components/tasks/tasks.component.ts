import { Component, Input } from '@angular/core';
import { TaskComponent } from './task/task.component';
import { NewTaskComponent } from './new-task/new-task.component';
import { type NewTask } from '../../models/new-task';

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

  tasks = [
    {
      id: 't1',
      userId: 'u1',
      title: "Programador Angular",
      summary: "Aprenda todas as funcionalidades básicas e avançadas do Angular e como aplicá-las.",
      dueDate: "2025-12-31"
    },
    {
      id: 't2',
      userId: 'u3',
      title: "Criar testes Unitários",
      summary: "Criar testes unitários e de integrações",
      dueDate: "2025-12-31"
    },
    {
      id: 't3',
      userId: 'u3',
      title: "Desenvolver a API",
      summary: "Configurar a api e implementar a autenticação",
      dueDate: "2025-12-31"
    }
  ];

  get selectedUserTasks(){
    return this.tasks.filter((task) => task.userId === this.userId);
  }

  onCompleteTask(id: string){
    this.tasks = this.tasks.filter((task)=> task.id !==id)
  }

  onStartAddTask(){
    this.isAddingTask = true;
  }

  onCancelAddTask(){
    this.isAddingTask = false;
  }

  onAddTask(taskData:NewTask){
    this.tasks.unshift({
      id: new Date().getTime().toString(),
      userId: this.userId,
      title: taskData.title,
      summary: taskData.summary,
      dueDate: taskData.date
    });
    this.isAddingTask = false;
  }
}
