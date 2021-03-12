import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { startOfHour, parseISO, isEqual } from 'date-fns';

const appointmentsRouter = Router();

interface Appointment {
  id: string;
  provider: string;
  date: Date;
}

const appointments: Appointment[] = [];

appointmentsRouter.get('/', (request, response) => {
  return response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = parseISO(date);

  const appointmentDate = startOfHour(parsedDate);

  const findAppointmentInTheSameDate = appointments.find(appointment =>
    isEqual(appointmentDate, appointment.date),
  );

  if (findAppointmentInTheSameDate) {
    return response.status(400).json({
      message: 'There is already an appointment scheduled for this date',
    });
  }

  const appointment = {
    id: uuid(),
    provider,
    date: appointmentDate,
  };

  appointments.push(appointment);

  return response.json(appointment);
});

export default appointmentsRouter;
