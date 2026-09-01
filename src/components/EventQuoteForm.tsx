import React, { FormEvent, useState } from 'react';
import { ArrowRight, Check, CheckCircle2 } from 'lucide-react';

const eventTypes = [
  'Casamento',
  'Aniversário',
  '15 anos',
  'Formatura',
  'Evento corporativo',
  'Festa/balada',
  'Evento de lançamento',
  'Chá/reunião',
];

const services = [
  ['Filmmaker', 'Cobertura do evento para produção de um vídeo completo editado.'],
  ['Storymaker', 'Cobertura em tempo real, com produção e postagem de Stories durante o evento.'],
  ['Filmmaker + Storymaker', 'Quero os dois serviços.'],
];

const videoFiles = [
  'Quero apenas o vídeo completo editado.',
  'Quero o vídeo completo editado + acesso aos arquivos brutos.',
  'Tenho interesse apenas nos arquivos brutos.',
  'Ainda não sei / gostaria de entender melhor.',
];

const photographerOptions = [
  'Sim, já tenho fotógrafo contratado.',
  'Não, ainda não tenho.',
  'Não preciso de fotógrafo.',
];

const photographyOptions = [
  'Sim, gostaria de receber orçamento.',
  'Não, somente vídeo.',
  'Ainda estou avaliando.',
];

const budgets = [
  'R$ 500 a R$ 1.000',
  'R$ 1.500 a R$ 2.000',
  'Acima de R$ 2.000',
  'Ainda não tenho um orçamento definido',
];

const inputClass = 'w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-black focus:ring-2 focus:ring-black/5';

function Choice({ name, value, type = 'radio', description }: { name: string; value: string; type?: 'radio' | 'checkbox'; description?: string }) {
  return (
    <label className="group flex cursor-pointer gap-3 rounded-xl border border-black/10 bg-white p-4 transition hover:border-black/30 has-[:checked]:border-black has-[:checked]:bg-yellow-50">
      <input className="peer sr-only" type={type} name={name} value={value} required={type === 'radio'} />
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border border-black/25 transition peer-checked:border-black peer-checked:bg-black ${type === 'radio' ? 'rounded-full' : 'rounded-md'}`}>
        <Check size={12} className="text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
      </span>
      <span>
        <span className="block text-sm font-semibold text-black">{value}</span>
        {description && <span className="mt-1 block text-xs leading-relaxed text-black/50">{description}</span>}
      </span>
    </label>
  );
}

function Field({ number, title, helper, children }: { number: string; title: string; helper?: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-black/10 py-7 first:border-0 first:pt-0">
      <legend className="mb-4 flex w-full gap-3 text-base font-semibold text-black">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-[10px] text-white">{number}</span>
        <span>{title}{helper && <small className="mt-1 block text-xs font-normal leading-relaxed text-black/45">{helper}</small>}</span>
      </legend>
      {children}
    </fieldset>
  );
}

export const EventQuoteForm = () => {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const servicesSelected = data.getAll('servicos').join(', ');
    if (!servicesSelected) {
      window.alert('Selecione pelo menos um serviço para continuar.');
      return;
    }
    const otherEvent = data.get('tipoOutro');
    const webhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;
    const payload = {
      nome: data.get('nome'),
      whatsapp: data.get('whatsapp'),
      data: data.get('data'),
      local: data.get('local'),
      horario: data.get('horario'),
      tipoEvento: data.get('tipoEvento') === 'Outro' ? `Outro — ${otherEvent}` : data.get('tipoEvento'),
      servicos: servicesSelected,
      arquivos: data.get('arquivos'),
      fotografo: data.get('fotografo'),
      fotografia: data.get('fotografia'),
      orcamento: data.get('orcamento'),
      detalhes: data.get('detalhes') || 'Não informado',
    };
    const lines = [
      '*NOVO PEDIDO DE ORÇAMENTO — EVENTO*',
      '',
      `*Nome:* ${data.get('nome')}`,
      `*WhatsApp:* ${data.get('whatsapp')}`,
      `*Data:* ${data.get('data')}`,
      `*Local:* ${data.get('local')}`,
      `*Horário:* ${data.get('horario')}`,
      `*Tipo de evento:* ${payload.tipoEvento}`,
      `*Serviço:* ${payload.servicos}`,
      `*Arquivos:* ${payload.arquivos}`,
      `*Fotógrafo no evento:* ${payload.fotografo}`,
      `*Interesse em fotografia:* ${payload.fotografia}`,
      `*Investimento:* ${payload.orcamento}`,
      `*Detalhes:* ${payload.detalhes}`,
    ];

    if (!webhookUrl) {
      setSubmitError('A integração com a planilha ainda não foi ativada. Tente novamente em instantes.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      window.open(`https://wa.me/5511958247301?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer');
      setSent(true);
    } catch {
      setSubmitError('Não foi possível salvar suas informações. Verifique sua conexão e tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <section id="orcamento" className="bg-[#f3f3f3] px-4 py-24 md:px-8 md:py-36">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-black px-6 py-16 text-center text-white md:px-16 md:py-24">
          <CheckCircle2 className="mx-auto mb-8 text-yellow-400" size={48} strokeWidth={1.5} />
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.35em] text-yellow-400">Formulário concluído</p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">Obrigada por preencher! 💛</h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/60 md:text-base">
            Recebemos suas informações e vamos analisar todos os detalhes do seu evento.
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-white/60 md:text-base">
            Em breve entraremos em contato pelo WhatsApp para conversar sobre a disponibilidade da data e apresentar a melhor opção de cobertura para você. 🎥✨
          </p>
          <button type="button" onClick={() => setSent(false)} className="mt-10 text-xs font-semibold uppercase tracking-widest text-white/50 underline underline-offset-4 transition hover:text-white">
            Preencher novamente
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="orcamento" className="bg-[#f3f3f3] px-4 py-24 text-black md:px-8 md:py-36">
      <div className="mx-auto max-w-[1120px]">
        <header className="mb-12 max-w-3xl md:mb-16">
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.35em] text-black/45">Vamos conversar sobre o seu evento</p>
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-[-0.04em] md:text-6xl">Orçamento de cobertura de eventos.</h2>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-black/55 md:text-base">Conte os principais detalhes do seu evento. Assim, conseguimos verificar a disponibilidade da data e preparar uma proposta mais adequada para você.</p>
        </header>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-black/10 bg-[#fafafa] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.06)] md:p-10 lg:p-14">
          <div className="grid gap-x-8 lg:grid-cols-2">
            <Field number="01" title="Nome completo"><input className={inputClass} name="nome" type="text" autoComplete="name" placeholder="Como podemos chamar você?" required /></Field>
            <Field number="02" title="WhatsApp para contato"><input className={inputClass} name="whatsapp" type="tel" autoComplete="tel" placeholder="(00) 00000-0000" required /></Field>
            <Field number="03" title="Qual é a data do seu evento?"><input className={inputClass} name="data" type="date" required /></Field>
            <Field number="04" title="Onde será o evento?"><input className={inputClass} name="local" type="text" placeholder="Local, cidade ou endereço" required /></Field>
          </div>

          <Field number="05" title="Qual será o horário do evento?" helper="Informe o horário de início e, se souber, o horário de término."><input className={inputClass} name="horario" type="text" placeholder="Ex.: das 18h às 23h" required /></Field>

          <Field number="06" title="Qual é o tipo de evento?">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {eventTypes.map((item) => <Choice key={item} name="tipoEvento" value={item} />)}
              <label className="rounded-xl border border-black/10 bg-white p-4 transition focus-within:border-black has-[:checked]:border-black has-[:checked]:bg-yellow-50">
                <span className="flex items-center gap-3 text-sm font-semibold"><input type="radio" name="tipoEvento" value="Outro" required />Outro</span>
                <input className="mt-3 w-full border-b border-black/20 bg-transparent py-1 text-sm outline-none focus:border-black" name="tipoOutro" type="text" placeholder="Qual?" />
              </label>
            </div>
          </Field>

          <Field number="07" title="Qual serviço você procura?" helper="Pode selecionar mais de uma opção.">
            <div className="grid gap-3 lg:grid-cols-3">{services.map(([name, description]) => <Choice key={name} type="checkbox" name="servicos" value={name} description={description} />)}</div>
          </Field>

          <Field number="08" title="Sobre os arquivos da cobertura em vídeo:"><div className="grid gap-3 md:grid-cols-2">{videoFiles.map((item) => <Choice key={item} name="arquivos" value={item} />)}</div></Field>
          <Field number="09" title="Você já terá fotógrafo no evento?"><div className="grid gap-3 md:grid-cols-3">{photographerOptions.map((item) => <Choice key={item} name="fotografo" value={item} />)}</div></Field>
          <Field number="10" title="Você gostaria de contratar fotografia junto com a cobertura em vídeo?"><div className="grid gap-3 md:grid-cols-3">{photographyOptions.map((item) => <Choice key={item} name="fotografia" value={item} />)}</div></Field>
          <Field number="11" title="Qual orçamento você pretende investir na cobertura do evento?" helper="Isso nos ajuda a apresentar a opção mais adequada para você."><div className="grid gap-3 md:grid-cols-2">{budgets.map((item) => <Choice key={item} name="orcamento" value={item} />)}</div></Field>
          <Field number="12" title="Tem alguma informação importante que gostaria de nos contar sobre o evento?" helper="Ex.: quantidade de convidados, duração, atrações, momentos especiais ou referências de vídeos."><textarea className={`${inputClass} min-h-36 resize-y`} name="detalhes" placeholder="Conte um pouco mais sobre o evento..." /></Field>

          <div className="flex flex-col items-start justify-between gap-6 border-t border-black/10 pt-8 md:flex-row md:items-center">
            <p className="max-w-md text-xs leading-5 text-black/40">Ao enviar, suas respostas serão organizadas em uma mensagem para a nossa equipe no WhatsApp.</p>
            <button type="submit" disabled={submitting} className="group flex w-full items-center justify-center gap-3 rounded-full bg-black px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-yellow-400 hover:text-black disabled:cursor-wait disabled:opacity-60 md:w-auto">
              {submitting ? 'Salvando...' : 'Solicitar orçamento'} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          {submitError && <p role="alert" className="mt-4 text-sm font-medium text-red-600">{submitError}</p>}
        </form>
      </div>
    </section>
  );
};
