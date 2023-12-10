
export default function calcularStatus(horarioSemana: { open: string; close: string }): boolean {
    if (horarioSemana && horarioSemana.open && horarioSemana.close) {
      const now = new Date();
      const currentDay = now.getDay();
      const currentHour = ('0' + now.getHours()).slice(-2);
      const currentMinute = ('0' + now.getMinutes()).slice(-2);
      const openTime = horarioSemana.open.split(':');
      const closeTime = horarioSemana.close.split(':');
  
      const openHour = parseInt(openTime[0]);
      const openMinute = parseInt(openTime[1]);
      const closeHour = parseInt(closeTime[0]);
      const closeMinute = parseInt(closeTime[1]);
  
      const currentTimeInMinutes = parseInt(currentHour) * 60 + parseInt(currentMinute);
      const openTimeInMinutes = openHour * 60 + openMinute;
      const closeTimeInMinutes = closeHour * 60 + closeMinute;
  
      console.log('Horário atual:', now.toLocaleString());
      console.log('Horário de abertura da clínica:', openTimeInMinutes);
      console.log('Horário de fechamento da clínica:', closeTimeInMinutes);
      console.log('Dia atual:', currentDay);
      console.log('Hora atual:', currentHour);
      console.log('Minuto atual:', currentMinute);
  
      if (currentDay >= 0 && currentDay <= 7) {
        if (currentTimeInMinutes >= openTimeInMinutes && currentTimeInMinutes <= closeTimeInMinutes) {
          return true;
        }
      }
    }
    return false;
  }
  