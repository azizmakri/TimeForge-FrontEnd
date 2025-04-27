import {Component} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CalendarService } from './calendar.service';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import { Appointment } from '../appointment-dialog/appointment-dialog.model';
import { DatePipe, NgForOf, NgIf} from '@angular/common';
import { CdkDropListGroup, CdkDropList, CdkDrag, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { addDays, differenceInCalendarDays } from 'date-fns';
import {Workflow} from '../../workflow/workflow.model';
import {WorkflowService} from '../../workflow/workflow.service';
import {PartnershipService, StrategicPartnership} from '../../strategicparternship/strategicparternship.service';
import {Goal} from '../../goal/goal.model';
import {GoalService} from '../../goal/goal.service';
import {ProjectService} from '../../project/project.service';
import {Project} from '../../models/project.model';


enum CalendarView {
  Month = 'month',
  Week = 'week',
  Day = 'day',
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [
    CdkDropListGroup, CdkDropList, DatePipe, MatButtonToggleGroup,
    NgIf, MatButtonToggle, MatIcon, NgForOf,
    CdkDrag, MatButton, MatIconButton
  ],
})
export class CalendarComponent {
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
    private workflowService: WorkflowService,
    private partnershipService:PartnershipService,
    private goalService: GoalService,
    private projectService: ProjectService,
  ) {
    this.refreshAppointments();
    this.generateTimeSlots();
    this.generateView(this.currentView, this.viewDate);
  }

  private refreshAppointments() {
    this.appointments = this.calendarService.getAppointments();
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
        this.calendarService.addAppointment(result);
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
          this.calendarService.deleteAppointment(result.uuid);
        } else {
          this.calendarService.updateAppointment(result);
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
    this.workflowService.getAllWorkflows().subscribe((workflows) => {
      this.loadWorkflowsIntoCalendar(workflows);
    });
    this.partnershipService.getAllPartnerships().subscribe((partnerships) => {
      this.loadPartnershipIntoCalendar(partnerships);
    });
    this.goalService.getAllGoals().subscribe((goals) => {
      this.loadGoalsIntoCalendar(goals);
    })
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

  loadPartnershipIntoCalendar(partnerships: StrategicPartnership[]) {
    const addedDates = new Set<string>(); // To track unique dates

    partnerships.forEach(partner => {
      const creationDate = new Date(partner.creationDate);

      if (isNaN(creationDate.getTime())) {
        console.error('Invalid creationDate for partner', partner);
        return;
      }

      const dateString = creationDate.toISOString().split('T')[0];

      if (!addedDates.has(dateString)) {
        this.appointments.push({
          endTime: '',
          startTime: '',
          id: `${partner.id}`,
          title: partner.name,
          date: creationDate
        });
        addedDates.add(dateString);
      }
    });
  }
  loadWorkflowsIntoCalendar(workflows: Workflow[]) {
    const addedDates = new Set<string>(); // To track unique dates

    workflows.forEach(workflow => {
      // Check if startDate and endDate are valid
      const start = new Date(workflow.startDate);
      const end = new Date(workflow.endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error('Invalid date for workflow', workflow);
        return;
      }

      const days = differenceInCalendarDays(end, start) + 1;

      for (let i = 0; i < days; i++) {
        const date = addDays(start, i);
        const dateString = date.toISOString().split('T')[0]; // Get the date part (YYYY-MM-DD)

        // Only add the date if it has not been added already
        if (!addedDates.has(dateString)) {
          this.appointments.push({
            endTime: '',
            startTime: '',
            id: `${workflow.id}-${i}`,
            title: workflow.workflowName,
            date: date
          });
          addedDates.add(dateString); // Mark the date as added
        }
      }
    });
  }
  loadGoalsIntoCalendar(goals: Goal[]) {
    const addedDates = new Set<string>(); // Pour suivre les dates uniques

    goals.forEach(goal => {
      // Vérification des dates valides
      const start = new Date(goal.startDate!);
      const end = new Date(goal.endDate!);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.error('Invalid date for goal', goal);
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
            id: `${goal.goal_id}-${i}`,
            title: goal.title,
            date: date
          });
          addedDates.add(dateString);
        }
      }
    });
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
