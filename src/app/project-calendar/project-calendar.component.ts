import { Component } from '@angular/core';
import {CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup, moveItemInArray} from '@angular/cdk/drag-drop';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import {MatIcon} from '@angular/material/icon';
import {Appointment} from '../app/appointment-dialog/appointment-dialog.model';
import {MatDialog} from '@angular/material/dialog';
import {CalendarService} from '../app/calendar/calendar.service';
import {WorkflowService} from '../workflow/workflow.service';
import {PartnershipService, StrategicPartnership} from '../strategicparternship/strategicparternship.service';
import {GoalService} from '../goal/goal.service';
import {ProjectService} from '../project/project.service';
import {AppointmentDialogComponent} from '../app/appointment-dialog/appointment-dialog.component';
import {Workflow} from '../workflow/workflow.model';
import {addDays, differenceInCalendarDays} from 'date-fns';
import {Goal} from '../goal/goal.model';
import {Project} from '../models/project.model';
import {ProjectCalendarService} from './project-calendar.service';


enum CalendarView {
  Month = 'month',
  Week = 'week',
  Day = 'day',
}

@Component({
  selector: 'app-project-calendar',
  imports: [
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    DatePipe,
    MatButton,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatIcon,
    MatIconButton,
    NgForOf,
    NgIf
  ],
  templateUrl: './project-calendar.component.html',
  standalone: true,
  styleUrl: './project-calendar.component.scss'
})
export class ProjectCalendarComponent {

  viewDate: Date = new Date();
  selectedDate: Date | null = null;
  currentView: CalendarView = CalendarView.Month;
  monthDays: Date[] = [];
  weeks: Date[][] = [];
  appointments: Appointment[] = [];
  timeSlots: string[] = [];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  public CalendarView = CalendarView;

  constructor(
    public dialog: MatDialog,
    private calendarService: CalendarService,
    private projectService: ProjectService,
    private ProjectCalendarService : ProjectCalendarService
  ) {
    this.refreshAppointments();
    this.generateTimeSlots();
    this.generateView(this.currentView, this.viewDate);
  }

  private refreshAppointments() {
    this.appointments = this.ProjectCalendarService.getAppointments();
  }

  // Générer les créneaux horaires
  generateTimeSlots() {
    this.timeSlots = Array.from({length: 24}, (_, i) =>
      `${i.toString().padStart(2, '0')}:00`);
  }

  // Générer les vues du calendrier
  generateView(view: CalendarView, date: Date) {
    this.currentView = view;
    this.viewDate = new Date(date);

    switch (view) {
      case CalendarView.Month:
        this.generateMonthView(date);
        break;
      case CalendarView.Week:
        this.generateWeekView(date);
        break;
      case CalendarView.Day:
        this.generateDayView(date);
        break;
    }
  }

  generateMonthView(date: Date) {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    this.weeks = [];
    this.monthDays = [];

    // Calculer le début de la semaine
    const startDay = new Date(firstDay);
    startDay.setDate(firstDay.getDate() - firstDay.getDay());

    // Calculer la fin de la semaine
    const endDay = new Date(lastDay);
    endDay.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

    let currentDate = new Date(startDay);
    let week: Date[] = [];

    while (currentDate <= endDay) {
      week.push(new Date(currentDate));
      this.monthDays.push(new Date(currentDate));

      if (week.length === 7) {
        this.weeks.push(week);
        week = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  generateWeekView(date: Date) {
    const startOfWeek = this.startOfWeek(date);
    this.monthDays = Array.from({length: 7}, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  }

  generateDayView(date: Date) {
    this.monthDays = [new Date(date)];
  }

  // Navigation
  previous() {
    const newDate = new Date(this.viewDate);

    switch (this.currentView) {
      case CalendarView.Month:
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case CalendarView.Week:
        newDate.setDate(newDate.getDate() - 7);
        break;
      case CalendarView.Day:
        newDate.setDate(newDate.getDate() - 1);
        break;
    }

    this.generateView(this.currentView, newDate);
  }

  next() {
    const newDate = new Date(this.viewDate);

    switch (this.currentView) {
      case CalendarView.Month:
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case CalendarView.Week:
        newDate.setDate(newDate.getDate() + 7);
        break;
      case CalendarView.Day:
        newDate.setDate(newDate.getDate() + 1);
        break;
    }

    this.generateView(this.currentView, newDate);
  }

  viewToday() {
    this.generateView(this.currentView, new Date());
  }

  // Gestion des dates
  startOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isCurrentMonth(date: Date): boolean {
    return (
      date.getMonth() === this.viewDate.getMonth() &&
      date.getFullYear() === this.viewDate.getFullYear()
    );
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  // Gestion des rendez-vous
  selectDate(date: Date) {
    this.selectedDate = date;
    this.addAppointment();
  }

  getAppointmentsForDate(date: Date): Appointment[] {
    return this.appointments.filter(app => this.isSameDate(app.date, date));
  }

  getAppointmentsForDateTime(date: Date, timeSlot: string): Appointment[] {
    const [hours] = timeSlot.split(':').map(Number);
    return this.appointments.filter(app => {
      return (
        this.isSameDate(app.date, date) &&
        app.date.getHours() === hours
      );
    });
  }

  // Gestion du drag and drop
  drop(event: CdkDragDrop<any[]>, targetDate: Date) {
    const previousDate = event.previousContainer.data;
    const targetAppointments = event.container.data;

    if (event.previousContainer !== event.container) {
      const moved = event.previousContainer.data[event.previousIndex];
      this.removeAppointmentFromDate(moved, event.previousContainer.id);
      moved.date = targetDate;
      targetAppointments.splice(event.currentIndex, 0, moved);
    } else {
      moveItemInArray(targetAppointments, event.previousIndex, event.currentIndex);
    }
  }

  removeAppointmentFromDate(appointment: any, containerId: string) {
    const dateStr = containerId.replace('drop-list-', '');
    const date = new Date(dateStr);

    const appointmentsForDate = this.getAppointmentsForDate(date);

    const index = appointmentsForDate.findIndex(a => a.id === appointment.id);
    if (index > -1) {
      appointmentsForDate.splice(index, 1);
    }
  }


  // Gestion de la boîte de dialogue
  addAppointment() {
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      width: '400px',
      data: {
        date: this.selectedDate || this.viewDate,
        title: '',
        description: '',
        color: this.getRandomColor()
      },
    });

    dialogRef.afterClosed().subscribe((result: Appointment) => {
      if (result) {
        this.ProjectCalendarService.addAppointment(result);
        this.refreshAppointments();
      }
    });
  }

  editAppointment(appointment: Appointment, event: Event) {
    event.stopPropagation();

    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      width: '500px',
      data: {...appointment}
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.remove) {
          this.ProjectCalendarService.deleteAppointment(result.uuid);
        } else {
          this.ProjectCalendarService.updateAppointment(result);
        }
        this.refreshAppointments();
      }
    });
  }

  getRandomColor(): string {
    const hue = Math.floor(Math.random() * 360);
    return `hsla(${hue}, 70%, 50%, 0.7)`;
  }

  switchToView(view: CalendarView) {
    this.generateView(view, this.viewDate);
  }

  connectedDropListsIds: string[] = [];

  ngOnInit() {
    this.updateConnectedDropLists();
    this.projectService.getAllProjects().subscribe((projects) => {
      this.loadProjectsIntoCalendar(projects);
    })

  }

  updateConnectedDropLists() {
    const dates = this.weeks.flat(); // toutes les dates visibles dans le mois
    this.connectedDropListsIds = dates.map(date => this.getDropListId(date));
  }

  getDropListId(date: Date): string {
    return `drop-list-${date.toDateString()}`;
  }

  saveAppointmentsToStorage() {
    localStorage.setItem('appointments', JSON.stringify(this.appointments));
  }

  loadAppointmentsFromStorage() {
    const stored = localStorage.getItem('appointments');
    if (stored) {
      this.appointments = JSON.parse(stored);
    }
  }

  loadProjectsIntoCalendar(projects: Project[]) {
    const addedDates = new Set<string>(); // Pour suivre les dates uniques

    projects.forEach(project => {
      // Vérifie que les dates sont définies et valides
      const start = new Date(project.startDate!);
      const end = new Date(project.endDate!);

      if (!project.startDate || !project.endDate || isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error('Invalid date for project', project);
        return;
      }

      const days = differenceInCalendarDays(end, start) + 1;

      for (let i = 0; i < days; i++) {
        const date = addDays(start, i);
        const dateString = date.toISOString().split('T')[0];

        if (!addedDates.has(dateString)) {
          this.appointments.push({
            endTime: '',
            startTime: '',
            id: `${project.projet_id}-${i}`,
            title: `${project.title} (${project.category})`, // Ajoute la catégorie si utile
            date: date
          });
          addedDates.add(dateString);
        }
      }
    });
  }

}
