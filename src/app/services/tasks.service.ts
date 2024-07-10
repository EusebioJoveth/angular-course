import { Injectable } from '@angular/core';
import { NewTask } from '../models/new-task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private tasks = [
    {
      id: 't1',
      userId: 'u1',
      title: "Programador Angular",
      summary: "Aprenda todas as funcionalidades básicas e avançadas do Angular e como aplicá-las.",
      dueDate: "2025-12-31"
    },
    {
      id: 't2',
      userId: 'u1',
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

  constructor(){
    const tasks = localStorage.getItem('tasks');
    if(tasks){
      this.tasks = JSON.parse(tasks);
    }
  }

  getUserTasks(userId: string){
    return this.tasks.filter((task)=> task.userId ===userId)
  }

  addTask(taskData: NewTask, userId:string){
    console.log('task', taskData, 'user', userId )
    this.tasks.unshift({
      id: new Date().getTime().toString(),
      userId: userId,
      title: taskData.title,
      summary: taskData.summary,
      dueDate: taskData.date
    });
    this.saveTasks();
  }

  removeTask(id:string){
   this.tasks =  this.tasks.filter((task)=>  task.id !==id)
   this.saveTasks();
  }

  private saveTasks(){
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}
