export interface Appointment {
  id: string; // <- Ajouté
  uuid?: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  color?: string;  // Si tu souhaites ajouter une couleur à un rendez-vous
}
