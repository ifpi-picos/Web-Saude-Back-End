import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz';

export default function calcularStatus(horarioSemana: { open: string; close: string }): boolean {
  if (horarioSemana && horarioSemana.open && horarioSemana.close) {
    try {
      const agora = new Date();
      const diaAtual = agora.getDay();
      const horaAtual = agora.getHours();
      const minutoAtual = agora.getMinutes();
      const horaAbertura = horarioSemana.open.split(':');
      const horaFechamento = horarioSemana.close.split(':');

      const horaAberturaInt = parseInt(horaAbertura[0]);
      const minutoAbertura = parseInt(horaAbertura[1]);
      const horaFechamentoInt = parseInt(horaFechamento[0]);
      const minutoFechamento = parseInt(horaFechamento[1]);

      const horarioAbertura = zonedTimeToUtc(
        new Date(0, 0, 0, horaAberturaInt, minutoAbertura),
        'America/Sao_Paulo'
      );
      const horarioFechamento = zonedTimeToUtc(
        new Date(0, 0, 0, horaFechamentoInt, minutoFechamento),
        'America/Sao_Paulo'
      );

      const agoraUtc = utcToZonedTime(agora, 'America/Sao_Paulo');

      const formato = 'HH:mm:ss zzzz (O)';

      console.log('Horário atual:', format(agoraUtc, formato));
      console.log('Horário de abertura da clínica:', format(horarioAbertura, formato));
      console.log('Horário de fechamento da clínica:', format(horarioFechamento, formato));
      console.log('Dia atual:', diaAtual);
      console.log('Hora atual:', horaAtual);
      console.log('Minuto atual:', minutoAtual);

      if (diaAtual >= 0 && diaAtual <= 6) {
        const tempoAtualEmMinutos = horaAtual * 60 + minutoAtual;
        const tempoAberturaEmMinutos =
          horarioAbertura.getHours() * 60 + horarioAbertura.getMinutes();
        const tempoFechamentoEmMinutos =
          horarioFechamento.getHours() * 60 + horarioFechamento.getMinutes();

        return tempoAtualEmMinutos >= tempoAberturaEmMinutos && tempoAtualEmMinutos <= tempoFechamentoEmMinutos;
      }
    } catch (error) {
      console.error('Erro ao calcular o status:', error);
    }
  }
  return false;
}
