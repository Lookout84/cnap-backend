// Функція для перевірки накладень у розкладі
export const checkScheduleOverlap = (schedules: Schedule[]) => {
  for (let i = 0; i < schedules.length; i++) {
    for (let j = i + 1; j < schedules.length; j++) {
      const a = schedules[i];
      const b = schedules[j];
      
      if (a.dayOfWeek === b.dayOfWeek) {
        const aStart = new Date(`1970-01-01T${a.startTime}:00`);
        const aEnd = new Date(`1970-01-01T${a.endTime}:00`);
        const bStart = new Date(`1970-01-01T${b.startTime}:00`);
        const bEnd = new Date(`1970-01-01T${b.endTime}:00`);
        
        if (aStart < bEnd && bStart < aEnd) {
          return {
            hasOverlap: true,
            scheduleA: a,
            scheduleB: b,
          };
        }
      }
    }
  }
  return { hasOverlap: false };
};

// Функція для генерації слотів
export const generateTimeSlots = (
  startTime: string,
  endTime: string,
  duration: number
) => {
  const slots = [];
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  
  let current = new Date();
  current.setHours(startHours, startMinutes, 0, 0);
  
  const end = new Date();
  end.setHours(endHours, endMinutes, 0, 0);
  
  while (current < end) {
    const slotEnd = new Date(current.getTime() + duration * 60000);
    if (slotEnd > end) break;
    
    slots.push({
      start: current.toTimeString().substring(0, 5),
      end: slotEnd.toTimeString().substring(0, 5),
    });
    
    current = slotEnd;
  }
  
  return slots;
};