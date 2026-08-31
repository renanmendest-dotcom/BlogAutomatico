import { chromium } from 'playwright';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pins as novosPins } from './pins-data.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..', '..', '..');
const publicDir = join(root, 'public', 'pinterest', 'programacao-2026-08-31');
const photoDir = join(here, 'fotos');
const productDir = join(here, 'produtos');
const logoPath = join(root, 'public', 'logo-curva-viva.png');
const site = 'https://www.curvaviva.com.br';
const pinterestDestinationSite = 'https://blog-automatico-sigma.vercel.app';

const boards = {
  ondas: 'Cabelo ondulado: leveza e definição',
  cachos: 'Cabelo cacheado: definição e cuidado',
  finalizacao: 'Finalização e day after',
};

const themes = {
  terracotta: { bg: '#F8F3EC', accent: '#C2564C', ink: '#2B2027', soft: '#F0D2CB' },
  plum: { bg: '#F8F3EC', accent: '#6B3D5E', ink: '#2B2027', soft: '#EFE5D9' },
  olive: { bg: '#F5F3E8', accent: '#66704C', ink: '#293126', soft: '#E0E2C7' },
  blue: { bg: '#EEF5F4', accent: '#47797B', ink: '#203A3B', soft: '#CFE2DF' },
  rose: { bg: '#FFF2F3', accent: '#A94F67', ink: '#4B2632', soft: '#F1CED7' },
};

const pinsAnterior = [
  {
    id: '01', kind: 'photo', theme: 'terracotta', photo: '01-day-after-borrifador.png', side: 'left', position: 'center 52%',
    eyebrow: 'DAY AFTER SEM ENCHARCAR', headline: 'Precisa molhar o cabelo inteiro?',
    body: 'Não. Umedeça apenas as partes amassadas, modele essas mechas e preserve o que ainda está bonito.',
    title: 'Day after cacheado: precisa molhar o cabelo inteiro?',
    description: 'No day after, umedeça somente as áreas amassadas e modele as mechas que perderam a forma. Molhar o cabelo inteiro aumenta o tempo de secagem e pode acrescentar produto onde não precisa.',
    alt: 'Mulher cacheada borrifa pouca água em uma mecha diante da janela; a arte orienta umedecer somente as áreas amassadas no day after.',
    link: '/artigos/como-recuperar-os-cachos-no-day-after-sem-lavar/', board: boards.cachos,
    publish: '2026-08-24T12:18:00', local: '24/08/2026 09:18', keywords: 'day after cacheado, recuperar cachos, cachos amassados, borrifador',
  },
  {
    id: '02', kind: 'guide', theme: 'plum',
    eyebrow: 'SALVE PARA CONSULTAR', headline: 'Gelatina: o sinal e o próximo teste',
    intro: 'Espere o cabelo secar e observe o que permanece.',
    rows: [
      ['Rigidez solta ao amassar', 'Fixação normal. Mantenha a dose.'],
      ['Continua duro depois de amassar', 'Reduza somente a gelatina.'],
      ['Pontinhos ou farelo branco', 'Teste a mistura e simplifique as camadas.'],
      ['Raiz baixa e comprimento pesado', 'Concentre no comprimento e nas pontas.'],
      ['Aspereza permanece', 'Compare uma lavagem com menos produto.'],
    ],
    title: 'Gelatina no cabelo cacheado: fixação, excesso ou aspereza?',
    description: 'Avalie a gelatina somente com o cabelo seco. Rigidez que solta ao amassar costuma ser fixação; dureza persistente pede menos gelatina; farelo branco pede teste da mistura; raiz baixa pede distância da raiz; aspereza persistente pede uma lavagem com menos produto.',
    alt: 'Infográfico com cinco sinais após usar gelatina no cabelo cacheado e o próximo teste indicado para cada um.',
    required: ['Rigidez solta ao amassar', 'Continua duro depois de amassar', 'Pontinhos ou farelo branco', 'Raiz baixa e comprimento pesado', 'Aspereza permanece'],
    link: '/artigos/gelatina-capilar-resseca-cabelo-cacheado/', board: boards.finalizacao,
    publish: '2026-08-24T17:37:00', local: '24/08/2026 14:37', keywords: 'gelatina cabelo cacheado, cabelo duro, gelatina resseca, fixação cachos',
  },
  {
    id: '03', kind: 'photo', theme: 'blue', photo: '06-difusor-costas.png', side: 'right', position: 'center 54%',
    eyebrow: 'DIFUSOR NO MORNO', headline: 'Ainda precisa de proteção térmica?',
    body: 'Sim. O acessório distribui o ar, mas o fio continua exposto ao calor. Confirme a função no rótulo.',
    title: 'Protetor térmico no difusor morno ainda é necessário?',
    description: 'O difusor no morno ainda expõe ondas e cachos ao calor. Use antes da secagem um produto que declare proteção térmica e distribua uma camada fina conforme o rótulo.',
    alt: 'Mulher de costas seca ondas com difusor; a arte explica que o ar morno ainda exige um produto com proteção térmica declarada.',
    link: '/artigos/precisa-usar-protetor-termico-no-difusor/', board: boards.finalizacao,
    publish: '2026-08-24T23:11:00', local: '24/08/2026 20:11', keywords: 'protetor térmico difusor, difusor morno, secar cachos, proteção térmica',
  },
  {
    id: '04', kind: 'guide', theme: 'olive',
    eyebrow: 'ONDULADO FINO', headline: 'Mousse: escolha o primeiro teste',
    intro: 'Mude uma coisa por lavagem e avalie o cabelo seco.',
    rows: [
      ['Creme pesa com facilidade', 'Teste somente mousse e pouca quantidade.'],
      ['Pontas precisam de maciez', 'Pouco creme nas pontas e mousse por cima.'],
      ['Fixador deixa rígido', 'Use menos mousse e o cabelo mais molhado.'],
      ['A forma some ao secar', 'Aplique por mechas e não manipule durante a secagem.'],
    ],
    title: 'Mousse para cabelo ondulado fino: qual teste fazer primeiro?',
    description: 'Se o creme pesa, teste somente mousse; se as pontas pedem maciez, use pouco creme nelas; se fica rígido, reduza o mousse; se a forma some, aplique por mechas e não mexa enquanto seca. Avalie sempre o cabelo seco.',
    alt: 'Infográfico com quatro situações do cabelo ondulado fino e o primeiro teste indicado ao usar mousse.',
    required: ['Creme pesa com facilidade', 'Pontas precisam de maciez', 'Fixador deixa rígido', 'A forma some ao secar'],
    link: '/artigos/mousse-para-cabelo-ondulado-fino-funciona-sem-pesar/', board: boards.ondas,
    publish: '2026-08-25T11:52:00', local: '25/08/2026 08:52', keywords: 'mousse cabelo ondulado fino, finalização leve, ondas com volume, mousse sem pesar',
  },
  {
    id: '05', kind: 'photo', theme: 'rose', photo: '09-leave-in-aplicar.png', side: 'left', position: 'center 52%',
    eyebrow: 'FINALIZAÇÃO SEM PESO', headline: 'Leave-in ou creme: qual pesa menos?',
    body: 'O nome não decide. Compare função, textura, dose e as outras camadas da rotina.',
    title: 'Leave-in ou creme de pentear: qual pesa menos no cabelo?',
    description: 'Um leave-in cremoso pode pesar mais que um creme fluido usado em pouca quantidade. Escolha pela função, textura, dose e combinação com outros finalizadores, não apenas pelo nome da embalagem.',
    alt: 'Mulher distribui produto em uma seção de cabelo úmido; a arte explica que peso depende de textura, dose e camadas, não do nome leave-in ou creme.',
    link: '/artigos/leave-in-ou-creme-de-pentear/', board: boards.finalizacao,
    publish: '2026-08-25T16:41:00', local: '25/08/2026 13:41', keywords: 'leave-in ou creme de pentear, finalização sem pesar, cabelo cacheado, cabelo ondulado',
  },
  {
    id: '06', kind: 'photo', theme: 'terracotta', photo: '13-creme-cacheado-volume.png', side: 'right', position: 'center 55%',
    eyebrow: 'AVALIE DEPOIS DE SECO', headline: 'Como saber se o creme pesou?',
    body: 'Raiz colada, secagem demorada, pouco movimento, resíduo ou sensação oleosa pedem menos produto.',
    title: 'Creme para cabelo cacheado: como saber se pesou?',
    description: 'Raiz colada, secagem demorada, mechas sem movimento, resíduo e sensação oleosa podem indicar excesso de creme. Reduza uma variável por vez antes de concluir que a fórmula não funciona.',
    alt: 'Mulher cacheada levanta a raiz do cabelo seco; a arte lista sinais de que o creme de pentear pode ter pesado.',
    required: ['Raiz colada', 'secagem demorada', 'pouco movimento', 'resíduo', 'sensação oleosa'],
    link: '/artigos/melhores-cremes-de-pentear-para-cabelo-cacheado/', board: boards.cachos,
    publish: '2026-08-25T22:26:00', local: '25/08/2026 19:26', keywords: 'creme cabelo cacheado, creme pesou, cabelo sem volume, finalização cacheada',
  },
  {
    id: '07', kind: 'photo', theme: 'plum', photo: '11-creme-gel-texturas.png', side: 'left', position: 'center 55%',
    eyebrow: 'ESCOLHA PELA FUNÇÃO', headline: 'Creme ou gelatina: o que muda?',
    body: 'Creme costuma priorizar desembaraço e maciez. Gelatina costuma ajudar a definição a durar.',
    title: 'Creme de pentear ou gelatina: escolha pelo resultado desejado',
    description: 'O creme de pentear costuma priorizar desembaraço, maciez e modelagem. A gelatina costuma entrar quando a prioridade é fazer a definição durar mais. Comece pela função que está faltando.',
    alt: 'Duas mãos mostram creme branco e gel transparente; a arte compara a função mais comum de creme de pentear e gelatina.',
    link: '/artigos/creme-de-pentear-ou-gelatina-qual-escolher-2026/', board: boards.finalizacao,
    publish: '2026-08-26T13:07:00', local: '26/08/2026 10:07', keywords: 'creme de pentear ou gelatina, definição cachos, finalização cabelo, gelatina capilar',
  },
  {
    id: '08', kind: 'guide', theme: 'blue',
    eyebrow: 'DAY AFTER', headline: 'O que fazer em cada situação',
    intro: 'Retoque só o que perdeu a forma.',
    rows: [
      ['Poucas mechas amassadas', 'Água ou bruma somente nessas áreas.'],
      ['Frizz na camada de cima', 'Mãos levemente úmidas e movimento suave.'],
      ['Uma mecha perdeu a curva', 'Umedeça e enrole essa mecha no dedo.'],
      ['Sem forma por inteiro', 'Reavalie a finalização e a proteção ao dormir.'],
      ['Fios pesados ou com acúmulo', 'Evite novas camadas e considere lavar.'],
    ],
    title: 'Day after cacheado: o que fazer em cada situação',
    description: 'Poucas mechas amassadas pedem retoque localizado; frizz no topo pede mãos úmidas; uma mecha esticada pode ser enrolada no dedo; perda geral de forma pede revisão da rotina; acúmulo pede evitar novas camadas e considerar lavar.',
    alt: 'Guia de day after com cinco situações comuns e uma ação prática para recuperar ondas, cachos ou crespos.',
    required: ['Poucas mechas amassadas', 'Frizz na camada de cima', 'Uma mecha perdeu a curva', 'Sem forma por inteiro', 'Fios pesados ou com acúmulo'],
    link: '/artigos/como-recuperar-os-cachos-no-day-after-sem-lavar/', board: boards.cachos,
    publish: '2026-08-26T18:22:00', local: '26/08/2026 15:22', keywords: 'day after cacheado, recuperar cachos, frizz day after, cachos amassados',
  },
  {
    id: '09', kind: 'photo', theme: 'rose', photo: '03-gelatina-amassar-seco.png', side: 'right', position: 'center 54%',
    eyebrow: 'NÃO JULGUE MOLHADO', headline: 'Gelatina deixou o cabelo duro?',
    body: 'Espere secar por completo e amasse com as mãos secas. Se a rigidez soltar, era fixação.',
    title: 'Gelatina deixou o cabelo duro? Faça este teste depois de seco',
    description: 'Espere o cabelo secar completamente e amasse as mechas de baixo para cima com as mãos secas. Se a rigidez diminui e o toque fica confortável, o efeito firme era a camada de fixação.',
    alt: 'Close de mãos amassando cachos secos; a arte orienta avaliar a rigidez da gelatina somente depois de o cabelo secar.',
    link: '/artigos/gelatina-capilar-resseca-cabelo-cacheado/', board: boards.finalizacao,
    publish: '2026-08-26T23:03:00', local: '26/08/2026 20:03', keywords: 'gelatina cabelo duro, amassar cachos secos, fixação gelatina, cabelo cacheado',
  },
  {
    id: '10', kind: 'guide', theme: 'terracotta',
    eyebrow: 'SECAGEM COM CUIDADO', headline: 'Difusor: situação e cuidado prático',
    intro: 'Temperatura baixa ajuda, mas a função do produto precisa estar declarada.',
    rows: [
      ['Difusor no quente', 'Use proteção e não pare na mesma mecha.'],
      ['Difusor no morno', 'Use proteção e distribua antes de secar.'],
      ['Difusor no frio', 'Proteção não é exigida pela função térmica.'],
      ['Creme sem menção a calor', 'Não conte com proteção térmica.'],
      ['Finalizador com proteção', 'Pode cumprir as duas etapas se o rótulo permitir.'],
    ],
    title: 'Difusor em cabelo cacheado: temperatura e proteção térmica',
    description: 'No quente ou morno, use produto com proteção térmica declarada. No frio, ela não é exigida pela função térmica. Creme sem menção a calor não deve ser presumido como protetor; um finalizador com essa função pode cumprir as duas etapas se o rótulo permitir.',
    alt: 'Infográfico relaciona cinco situações de uso do difusor ao cuidado indicado com proteção térmica.',
    required: ['Difusor no quente', 'Difusor no morno', 'Difusor no frio', 'Creme sem menção a calor', 'Finalizador com proteção'],
    link: '/artigos/precisa-usar-protetor-termico-no-difusor/', board: boards.finalizacao,
    publish: '2026-08-27T12:34:00', local: '27/08/2026 09:34', keywords: 'difusor cabelo cacheado, proteção térmica, temperatura difusor, secagem cachos',
  },
  {
    id: '11', kind: 'photo', theme: 'olive', photo: '07-mousse-mao.png', side: 'right', position: 'center 53%',
    eyebrow: 'ESPUMA NÃO É GARANTIA', headline: 'Mousse sempre fica leve?',
    body: 'Não. Dose, combinação com creme e resposta do fio ainda decidem peso, volume e toque.',
    title: 'Mousse para cabelo ondulado sempre fica leve?',
    description: 'A textura em espuma não garante finalização sem peso. Quantidade, combinação com creme e resposta do fio ainda mudam volume, toque e duração. Comece com pouco e avalie depois de seco.',
    alt: 'Mão mostra espuma modeladora ao lado de cabelo ondulado úmido; a arte explica que mousse não garante leveza por si só.',
    link: '/artigos/mousse-para-cabelo-ondulado-fino-funciona-sem-pesar/', board: boards.ondas,
    publish: '2026-08-27T17:06:00', local: '27/08/2026 14:06', keywords: 'mousse cabelo ondulado, mousse pesa, ondas finas, finalização sem creme',
  },
  {
    id: '12', kind: 'photo', theme: 'blue', photo: '10-leave-in-teste-dividido.png', side: 'left', position: 'center 57%',
    eyebrow: 'TESTE ANTES DE COMPRAR', headline: 'Leave-in de um lado, creme do outro',
    body: 'Use a mesma técnica e compare, depois de seco, desembaraço, movimento, toque e duração.',
    title: 'Leave-in ou creme: faça um teste dividido no cabelo',
    description: 'Aplique leave-in em um lado e creme de pentear no outro, com técnica e dose equivalentes. Depois de seco, compare desembaraço, movimento, toque e duração antes de comprar outro finalizador.',
    alt: 'Mulher de costas segura duas partes do cabelo cacheado; a arte ensina um teste dividido entre leave-in e creme de pentear.',
    required: ['desembaraço', 'movimento', 'toque', 'duração'],
    link: '/artigos/leave-in-ou-creme-de-pentear/', board: boards.finalizacao,
    publish: '2026-08-27T23:48:00', local: '27/08/2026 20:48', keywords: 'teste leave-in creme de pentear, finalização cacheada, cabelo sem pesar, teste dividido',
  },
  {
    id: '13', kind: 'guide', theme: 'rose', compact: true,
    eyebrow: 'GUIA DE ESCOLHA', headline: 'Creme para cacheado por objetivo',
    intro: 'A indicação ajuda a reduzir a lista. O resultado depende da dose e do seu fio.',
    rows: [
      ['Lola Meu Cacho Minha Vida', 'Equilíbrio entre desembaraço, maciez e definição.'],
      ['Widi Care Encaracolando a Juba', 'Aplicação em fitas finas para cacheados.'],
      ['Salon Line Definição Natural', 'Pote grande e menor custo por 100 g na comparação.'],
      ['Soul Power Curly Styling', 'Modelagem com indicação para cacheados.'],
      ['Inoar Meu Cacho, Meu Crush', 'Indicação ampla para diferentes curvaturas.'],
      ['Skala #Mais Cachos 250 g', 'Menor gasto inicial para experimentar.'],
      ['Soul Power Curly On', 'Indicação específica para cabelos crespos.'],
    ],
    title: 'Creme para cabelo cacheado: compare 7 opções por objetivo',
    description: 'Compare as 7 opções: Lola para equilíbrio geral; Widi para fitagem; Salon Line para menor custo por 100 g; Soul Power Styling para cacheados; Inoar para indicação ampla; Skala para menor gasto inicial; Soul Power Curly On para crespos.',
    alt: 'Tabela vertical compara sete cremes de pentear pela principal finalidade de cada opção.',
    required: ['Lola Meu Cacho Minha Vida', 'Widi Care Encaracolando a Juba', 'Salon Line Definição Natural', 'Soul Power Curly Styling', 'Inoar Meu Cacho, Meu Crush', 'Skala #Mais Cachos 250 g', 'Soul Power Curly On'],
    link: '/artigos/melhores-cremes-de-pentear-para-cabelo-cacheado/', board: boards.cachos,
    publish: '2026-08-28T11:41:00', local: '28/08/2026 08:41', keywords: 'melhor creme cabelo cacheado, creme de pentear cacheado, comparar cremes, cabelo crespo',
  },
  {
    id: '14', kind: 'guide', theme: 'plum',
    eyebrow: 'COMPARAÇÃO RÁPIDA', headline: 'Creme de pentear ou gelatina?',
    intro: 'Escolha pelo que está faltando na sua finalização.',
    rows: [
      ['Desembaraço', 'Creme costuma ter essa função como prioridade.'],
      ['Maciez', 'Creme costuma ajudar; na gelatina depende da fórmula.'],
      ['Duração do formato', 'Gelatina costuma ser a escolha mais direta.'],
      ['Day after', 'Creme ajuda no retoque; gelatina pode prolongar a forma.'],
      ['Risco de pesar', 'Aumenta com excesso em qualquer uma das opções.'],
      ['Melhor começo', 'Pouca quantidade no cabelo úmido.'],
    ],
    title: 'Creme de pentear ou gelatina: comparação rápida para escolher',
    description: 'Creme costuma priorizar desembaraço e maciez; gelatina costuma priorizar duração. Os dois podem pesar em excesso. Para começar, use pouca quantidade no cabelo úmido e avalie qual função realmente falta.',
    alt: 'Tabela compara creme de pentear e gelatina em desembaraço, maciez, duração, day after, risco de pesar e primeiro teste.',
    required: ['Desembaraço', 'Maciez', 'Duração do formato', 'Day after', 'Risco de pesar', 'Melhor começo'],
    link: '/artigos/creme-de-pentear-ou-gelatina-qual-escolher-2026/', board: boards.finalizacao,
    publish: '2026-08-28T16:19:00', local: '28/08/2026 13:19', keywords: 'creme de pentear ou gelatina, comparação finalizadores, definição cachos, maciez cabelo',
  },
  {
    id: '15', kind: 'photo', theme: 'terracotta', photo: '02-day-after-mecha.png', side: 'right', position: 'center 54%',
    eyebrow: 'RETOQUE LOCALIZADO', headline: 'Uma mecha perdeu a curva?',
    body: 'Umedeça só essa parte, enrole a mecha no dedo e solte com cuidado. Não refaça o cabelo inteiro.',
    title: 'Day after: como recuperar uma mecha que perdeu a curva',
    description: 'No day after, umedeça apenas a mecha esticada, enrole-a no dedo e solte com cuidado. Esse retoque localizado evita molhar e reaplicar produto no cabelo inteiro.',
    alt: 'Mulher ondulada modela com os dedos uma única mecha diante do espelho; a arte ensina um retoque localizado no day after.',
    link: '/artigos/como-recuperar-os-cachos-no-day-after-sem-lavar/', board: boards.ondas,
    publish: '2026-08-28T22:57:00', local: '28/08/2026 19:57', keywords: 'day after cabelo ondulado, recuperar mecha, dedoliss, ondas amassadas',
  },
  {
    id: '16', kind: 'photo', theme: 'olive', photo: '04-gelatina-pontas.png', side: 'left', position: 'center 54%',
    eyebrow: 'DEPOIS DE AMASSAR', headline: 'A aspereza ainda continua?',
    body: 'Reduza a gelatina, simplifique as camadas e compare uma lavagem por vez antes de trocar tudo.',
    title: 'Gelatina deixou o cabelo áspero mesmo depois de seco?',
    description: 'Se a aspereza continua depois de o cabelo secar e a rigidez ser amassada, reduza a gelatina e simplifique as camadas. Compare uma lavagem por vez para descobrir se o problema é dose, combinação ou fórmula.',
    alt: 'Mulher crespa observa as pontas de uma mecha; a arte orienta reduzir gelatina e simplificar camadas quando a aspereza permanece.',
    link: '/artigos/gelatina-capilar-resseca-cabelo-cacheado/', board: boards.cachos,
    publish: '2026-08-29T13:26:00', local: '29/08/2026 10:26', keywords: 'gelatina resseca cabelo cacheado, cabelo áspero, excesso gelatina, cachos secos',
  },
  {
    id: '17', kind: 'photo', theme: 'rose', photo: '05-difusor-perfil.png', side: 'left', position: 'center 57%',
    eyebrow: 'FORMATO MAIS PRESERVADO', headline: 'Troque de mecha com o difusor desligado',
    body: 'Apoie a mecha com o aparelho desligado, ligue por instantes e desligue antes de mudar de posição.',
    title: 'Difusor em cabelo cacheado: como trocar de mecha sem bagunçar',
    description: 'Coloque a mecha no difusor com o aparelho desligado, ligue por alguns instantes e desligue antes de trocar de posição. Isso reduz o vento solto sobre o cabelo e ajuda a preservar o formato.',
    alt: 'Mulher apoia uma seção cacheada no difusor; a arte ensina a ligar o aparelho somente depois de posicionar a mecha.',
    link: '/artigos/precisa-usar-protetor-termico-no-difusor/', board: boards.finalizacao,
    publish: '2026-08-29T18:43:00', local: '29/08/2026 15:43', keywords: 'como usar difusor cabelo cacheado, secar cachos, difusor sem frizz, finalização cacheada',
  },
  {
    id: '18', kind: 'photo', theme: 'blue', photo: '08-mousse-amassar.png', side: 'right', position: 'center 55%',
    eyebrow: 'TESTE CONTROLADO', headline: 'Mousse sozinho ou com creme?',
    body: 'Se o creme pesa, teste mousse sozinho. Se as pontas pedem maciez, use pouco creme nelas e mousse por cima.',
    title: 'Mousse sozinho ou com creme no cabelo ondulado fino?',
    description: 'Quando o creme derruba o volume, teste o mousse sozinho. Se apenas as pontas precisam de maciez, use pouco creme nelas e aplique mousse por cima. Mude uma combinação por lavagem.',
    alt: 'Mulher amassa as pontas do cabelo ondulado com espuma; a arte explica quando testar mousse sozinho ou com pouco creme.',
    link: '/artigos/mousse-para-cabelo-ondulado-fino-funciona-sem-pesar/', board: boards.ondas,
    publish: '2026-08-29T23:12:00', local: '29/08/2026 20:12', keywords: 'mousse sozinho ou com creme, cabelo ondulado fino, finalização leve, mousse para ondas',
  },
  {
    id: '19', kind: 'guide', theme: 'terracotta', compact: true,
    eyebrow: 'LEIA O CABELO SECO', headline: 'O sinal e o ajuste da finalização',
    intro: 'Mude uma variável por vez para descobrir o que pesa ou o que falta.',
    rows: [
      ['Raiz colada e comprimento murcho', 'Retire uma camada ou reduza a dose.'],
      ['Pontas ásperas com bom formato', 'Teste pouco leave-in antes do fixador.'],
      ['Muitos nós na aplicação', 'Procure creme com mais deslizamento.'],
      ['Forma bonita molhada e solta depois', 'Mantenha a base e acrescente pouca fixação.'],
      ['Secagem muito demorada', 'Reduza produtos cremosos e excesso de água.'],
      ['Resíduo visível', 'Use menos e teste os produtos separados.'],
    ],
    title: 'Finalização pesada: o que o cabelo seco está mostrando',
    description: 'Raiz colada pede menos camadas; pontas ásperas podem pedir pouco leave-in; nós pedem mais deslizamento; forma que some pede fixação; secagem longa pede menos cremosos; resíduo pede menor dose e produtos separados.',
    alt: 'Guia com seis sinais observados depois de o cabelo secar e o ajuste sugerido para a próxima finalização.',
    required: ['Raiz colada e comprimento murcho', 'Pontas ásperas com bom formato', 'Muitos nós na aplicação', 'Forma bonita molhada e solta depois', 'Secagem muito demorada', 'Resíduo visível'],
    link: '/artigos/leave-in-ou-creme-de-pentear/', board: boards.finalizacao,
    publish: '2026-08-30T12:09:00', local: '30/08/2026 09:09', keywords: 'finalização pesada, leave-in ou creme, cabelo sem volume, resíduo cabelo',
  },
  {
    id: '20', kind: 'photo', theme: 'plum', photo: '12-gelatina-camada-fina.png', side: 'right', position: 'center 54%',
    eyebrow: 'CAMADAS FINAS', headline: 'Pode usar creme e gelatina juntos?',
    body: 'Pode. Comece com pouco creme e acrescente uma camada fina de gelatina. Avalie somente depois de seco.',
    title: 'Creme e gelatina juntos: como começar sem exagerar',
    description: 'Creme e gelatina podem ser usados juntos. Comece com pouco creme e acrescente uma camada fina de gelatina, porque excesso aumenta o risco de peso, rigidez e resíduos. Avalie o cabelo completamente seco.',
    alt: 'Mulher aplica uma camada fina de gel sobre uma mecha úmida; a arte orienta usar pouco creme e pouca gelatina.',
    link: '/artigos/creme-de-pentear-ou-gelatina-qual-escolher-2026/', board: boards.finalizacao,
    publish: '2026-08-30T17:54:00', local: '30/08/2026 14:54', keywords: 'creme e gelatina juntos, ordem finalização, gelatina capilar, cachos definidos',
  },
  {
    id: '21', kind: 'photo', theme: 'olive', photo: '14-creme-cacheado-dose.png', side: 'left', position: 'center 55%',
    eyebrow: 'NÃO EXISTE DOSE UNIVERSAL', headline: 'Quanto creme usar no cabelo cacheado?',
    body: 'Comece com pequenas porções por seção. Acrescente só onde os dedos ainda travam e avalie depois de seco.',
    title: 'Quanto creme de pentear usar no cabelo cacheado?',
    description: 'Não existe dose universal de creme de pentear. Comece com pequenas porções por seção, distribua bem e acrescente somente onde os dedos ainda travam. Avalie o resultado quando o cabelo estiver completamente seco.',
    alt: 'Mão mostra pequena porção de creme enquanto a outra separa uma mecha úmida; a arte ensina a ajustar a dose por seção.',
    link: '/artigos/melhores-cremes-de-pentear-para-cabelo-cacheado/', board: boards.cachos,
    publish: '2026-08-30T23:32:00', local: '30/08/2026 20:32', keywords: 'quanto creme usar cabelo cacheado, creme de pentear, dose finalização, cachos sem pesar',
  },
];

void pinsAnterior;
const pins = novosPins;

function escapeHtml(value) {
  return String(value).replace(/[&<>\"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);
}

function mimeType(path) {
  if (path.endsWith('.png')) return 'image/png';
  if (path.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

async function imageUrl(path) {
  const data = await readFile(path);
  return `data:${mimeType(path)};base64,${data.toString('base64')}`;
}

function sharedCss(theme) {
  return `
    *{box-sizing:border-box}html,body{margin:0;width:1000px;height:1500px;overflow:hidden}
    body{font-family:Arial,Helvetica,sans-serif;background:${theme.bg};color:${theme.ink}}
    .pin{position:relative;width:1000px;height:1500px;overflow:hidden;background:${theme.bg}}
    .brand{position:absolute;z-index:8;right:58px;bottom:52px;display:flex;align-items:center;gap:13px;background:#fffef8ee;border:1px solid #ffffffaa;border-radius:999px;padding:9px 19px 9px 9px;box-shadow:0 10px 28px #0002;font-size:22px;font-weight:800}
    .brand img{width:65px;height:65px;border-radius:50%;object-fit:cover}.brand small{display:block;font-size:15px;margin-top:2px}
    .save{position:absolute;z-index:8;left:58px;bottom:55px;color:#fff;background:${theme.accent};border:1px solid ${theme.accent};border-radius:999px;padding:12px 19px;font-size:22px;font-weight:900;letter-spacing:.4px;box-shadow:0 8px 24px #0002}
  `;
}

async function photoHtml(pin, logo) {
  const theme = themes[pin.theme];
  const photo = await imageUrl(join(photoDir, pin.photo));
  const panelSide = pin.side === 'right' ? 'right:58px;text-align:right;align-items:flex-end' : 'left:58px;text-align:left;align-items:flex-start';
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
    ${sharedCss(theme)}
    .photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${pin.position}}
    .shade{position:absolute;inset:0;background:linear-gradient(180deg,${theme.ink}20 0%,${theme.ink}05 54%,${theme.ink}50 100%)}
    .panel{position:absolute;z-index:6;top:62px;${panelSide};width:760px;display:flex;flex-direction:column;padding:34px 38px 38px;border-radius:38px;background:${theme.bg}F2;box-shadow:0 18px 52px #00000022;border:1px solid #ffffffbb}
    .eyebrow{display:inline-block;width:max-content;max-width:100%;padding:11px 19px;border-radius:999px;background:${theme.accent};color:white;font-size:22px;font-weight:900;letter-spacing:1.8px}
    h1{font-family:Georgia,'Times New Roman',serif;font-size:${pin.headline.length > 43 ? 64 : 72}px;line-height:1.01;letter-spacing:-2.8px;margin:24px 0 18px;text-wrap:balance}
    .body{font-size:30px;line-height:1.28;font-weight:650;text-wrap:balance}
  </style></head><body><main class="pin"><img class="photo" src="${photo}" alt=""><div class="shade"></div><section class="panel"><div class="eyebrow">${escapeHtml(pin.eyebrow)}</div><h1>${escapeHtml(pin.headline)}</h1><div class="body">${escapeHtml(pin.body)}</div></section><div class="save">${escapeHtml(pin.cta)}</div><div class="brand"><img src="${logo}" alt=""><span>Curva Viva<small>curvaviva.com.br</small></span></div></main></body></html>`;
}

async function guideHtml(pin, logo) {
  const theme = themes[pin.theme];
  const rowSize = pin.compact ? 22 : pin.rows.length >= 6 ? 24 : 27;
  const gap = pin.compact ? 10 : 13;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
    ${sharedCss(theme)}
    .shape{position:absolute;border-radius:999px;background:${theme.soft};opacity:.8}.s1{width:430px;height:430px;right:-170px;top:-180px}.s2{width:360px;height:360px;left:-190px;bottom:40px}
    .content{position:absolute;z-index:4;inset:58px 58px 145px;display:flex;flex-direction:column}
    .eyebrow{display:inline-block;width:max-content;padding:11px 19px;border-radius:999px;background:${theme.accent};color:white;font-size:22px;font-weight:900;letter-spacing:1.8px}
    h1{font-family:Georgia,'Times New Roman',serif;font-size:${pin.headline.length > 39 ? 63 : 70}px;line-height:1;letter-spacing:-2.8px;margin:22px 0 12px;max-width:880px;text-wrap:balance}
    .intro{font-size:27px;line-height:1.25;font-weight:650;max-width:850px;margin-bottom:22px}
    .rows{display:flex;flex-direction:column;gap:${gap}px;flex:1;justify-content:flex-start;margin-top:24px}
    .row{display:grid;grid-template-columns:39% 61%;align-items:center;border-radius:24px;overflow:hidden;background:#fffdf8;border:1px solid ${theme.soft};box-shadow:0 7px 18px #0000000e;min-height:${pin.compact ? 92 : 105}px}
    .cue,.action{padding:${pin.compact ? '15px 18px' : '18px 21px'};font-size:${rowSize}px;line-height:1.16}.cue{height:100%;display:flex;align-items:center;background:${theme.soft};color:${theme.ink};font-weight:900}.action{font-weight:650}
  </style></head><body><main class="pin"><div class="shape s1"></div><div class="shape s2"></div><section class="content"><div class="eyebrow">${escapeHtml(pin.eyebrow)}</div><h1>${escapeHtml(pin.headline)}</h1><div class="intro">${escapeHtml(pin.intro)}</div><div class="rows">${pin.rows.map(([cue, action]) => `<div class="row"><div class="cue">${escapeHtml(cue)}</div><div class="action">${escapeHtml(action)}</div></div>`).join('')}</div></section><div class="save">${escapeHtml(pin.cta)}</div><div class="brand"><img src="${logo}" alt=""><span>Curva Viva<small>curvaviva.com.br</small></span></div></main></body></html>`;
}

async function productHtml(pin, logo, productSources) {
  const theme = themes[pin.theme];
  const products = pin.products.map((product) => ({
    product,
    src: productSources.get(product),
  }));
  const compact = products.length >= 3;
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>
    ${sharedCss(theme)}
    .shape{position:absolute;border-radius:999px;background:${theme.soft};opacity:.85}.s1{width:430px;height:430px;right:-140px;top:-170px}.s2{width:350px;height:350px;left:-170px;bottom:160px}
    .content{position:absolute;z-index:4;left:58px;right:58px;top:58px}
    .eyebrow{display:inline-block;padding:11px 19px;border-radius:999px;background:${theme.accent};color:#fff;font-size:22px;font-weight:900;letter-spacing:1.8px}
    h1{font-family:Georgia,'Times New Roman',serif;font-size:${pin.headline.length > 42 ? 62 : 70}px;line-height:1;letter-spacing:-2.8px;margin:22px 0 14px;max-width:880px;text-wrap:balance}
    .body{font-size:27px;line-height:1.25;font-weight:650;max-width:870px;text-wrap:balance}
    .products{position:absolute;z-index:3;left:48px;right:48px;top:600px;height:690px;display:flex;align-items:center;justify-content:center;gap:14px;padding:38px;border-radius:54px;background:linear-gradient(145deg,#ffffffd9,${theme.soft}b0);border:1px solid #fff;box-shadow:0 24px 65px #0002;isolation:isolate}
    .products img{max-height:${compact ? 535 : 600}px;max-width:${compact ? 30 : 64}%;object-fit:contain;mix-blend-mode:multiply;filter:drop-shadow(0 26px 20px #0004);-webkit-mask-image:radial-gradient(ellipse 64% 64% at center,#000 72%,transparent 100%);mask-image:radial-gradient(ellipse 64% 64% at center,#000 72%,transparent 100%)}
    .products img:nth-child(2){transform:translateY(-20px)}
  </style></head><body><main class="pin"><div class="shape s1"></div><div class="shape s2"></div><section class="content"><div class="eyebrow">${escapeHtml(pin.eyebrow)}</div><h1>${escapeHtml(pin.headline)}</h1><div class="body">${escapeHtml(pin.body)}</div></section><div class="products">${products.map(({ src }) => `<img src="${src}" alt="">`).join('')}</div><div class="save">${escapeHtml(pin.cta)}</div><div class="brand"><img src="${logo}" alt=""><span>Curva Viva<small>curvaviva.com.br</small></span></div></main></body></html>`;
}

function normalize(value) {
  return value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

const forbiddenCue = /deslize|arrast|para o lado|próxim[ao] página|→/i;
for (const pin of pins) {
  if (pin.title.length > 100) throw new Error(`Título acima de 100 caracteres no Pin ${pin.id}`);
  if (pin.description.length > 500) throw new Error(`Descrição acima de 500 caracteres no Pin ${pin.id}`);
  if (forbiddenCue.test(`${pin.eyebrow} ${pin.headline} ${pin.body ?? ''} ${pin.intro ?? ''}`)) {
    throw new Error(`Pin único ${pin.id} contém indicação falsa de continuidade`);
  }
  const delivered = normalize(`${pin.headline} ${pin.body ?? ''} ${pin.intro ?? ''} ${(pin.rows ?? []).flat().join(' ')} ${pin.description}`);
  const missing = (pin.required ?? []).filter((detail) => !delivered.includes(normalize(detail)));
  if (missing.length) throw new Error(`Pin ${pin.id} não entrega: ${missing.join(', ')}`);
}

await mkdir(publicDir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
const page = await browser.newPage({ viewport: { width: 1000, height: 1500 }, deviceScaleFactor: 1 });
const logo = await imageUrl(logoPath);

async function cropProductMargins(path) {
  const src = await imageUrl(path);
  return page.evaluate(async (source) => {
    const image = new Image();
    image.src = source;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    context.drawImage(image, 0, 0);
    const frame = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = frame;
    const width = canvas.width;
    const height = canvas.height;
    const cornerIndexes = [0, width - 1, width * (height - 1), width * height - 1];
    const targets = cornerIndexes.map((index) => {
      const offset = index * 4;
      return [data[offset], data[offset + 1], data[offset + 2], data[offset + 3]];
    });
    const isForeground = (index) => {
      const offset = index * 4;
      if (data[offset + 3] < 32) return false;
      return targets.every(([r, g, b, a]) => {
        if (a < 32) return true;
        const dr = data[offset] - r;
        const dg = data[offset + 1] - g;
        const db = data[offset + 2] - b;
        return Math.sqrt(dr * dr + dg * dg + db * db) > 48;
      });
    };
    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        if (!isForeground(y * width + x)) continue;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
    if (minX > maxX || minY > maxY) return source;
    const padX = Math.round(width * 0.035);
    const padY = Math.round(height * 0.035);
    minX = Math.max(0, minX - padX);
    minY = Math.max(0, minY - padY);
    maxX = Math.min(width - 1, maxX + padX);
    maxY = Math.min(height - 1, maxY + padY);
    const cropWidth = maxX - minX + 1;
    const cropHeight = maxY - minY + 1;
    const output = document.createElement('canvas');
    output.width = cropWidth;
    output.height = cropHeight;
    output.getContext('2d').drawImage(image, minX, minY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    return output.toDataURL('image/png');
  }, src);
}

const productNames = [...new Set(pins.flatMap((pin) => pin.products ?? []))];
const productSources = new Map();
for (const product of productNames) {
  productSources.set(product, await cropProductMargins(join(productDir, product)));
}

for (const pin of pins) {
  const html = pin.kind === 'photo'
    ? await photoHtml(pin, logo)
    : pin.kind === 'product'
      ? await productHtml(pin, logo, productSources)
      : await guideHtml(pin, logo);
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.screenshot({ path: join(publicDir, `pin-${pin.id}.png`) });
}

await page.setViewportSize({ width: 1400, height: 1900 });
const reviewCards = await Promise.all(pins.map(async (pin) => `<figure><img src="${await imageUrl(join(publicDir, `pin-${pin.id}.png`))}" alt="Pin ${pin.id}"><figcaption>${pin.id} · ${escapeHtml(pin.local)}</figcaption></figure>`));
await page.setContent(`<!doctype html><html><head><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#e9e4dd;font-family:Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:16px}figure{position:relative;margin:0;border-radius:15px;overflow:hidden;background:#fff;box-shadow:0 6px 18px #0002}img{display:block;width:100%;aspect-ratio:2/3;object-fit:cover}figcaption{position:absolute;left:7px;right:7px;bottom:7px;border-radius:99px;background:#fffef0e8;color:#542638;padding:5px 8px;text-align:center;font-weight:800;font-size:12px}</style></head><body><main class="grid">${reviewCards.join('')}</main></body></html>`, { waitUntil: 'networkidle' });
await page.screenshot({ path: join(here, 'revisao-visual.png'), fullPage: true });
await browser.close();

const header = ['Title', 'Media URL', 'Pinterest board', 'Thumbnail', 'Description', 'Link', 'Publish date', 'Keywords'];
const rows = pins.map((pin) => {
  return [
    pin.title,
    `${site}/pinterest/programacao-2026-08-31/pin-${pin.id}.png`,
    pin.board,
    '',
    pin.description,
    `${pinterestDestinationSite}${pin.link}`,
    pin.publish,
    pin.keywords,
  ].map(csvCell).join(',');
});
await writeFile(join(here, 'pinterest-bulk.csv'), `\uFEFF${header.map(csvCell).join(',')}\r\n${rows.join('\r\n')}\r\n`, 'utf8');

const manifest = pins.map(({ id, title, alt, local, publish, board, link, kind, photo, products, cta }) => ({
  id, title, alt, horario_brasilia: local, horario_utc: publish, board, link: `${pinterestDestinationSite}${link}`, kind, photo: photo ?? null, products: products ?? [], cta,
}));
await writeFile(join(here, 'manifesto-pins.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

console.log(`Renderizados ${pins.length} Pins em ${publicDir}`);
console.log(`CSV criado em ${join(here, 'pinterest-bulk.csv')}`);
console.log(`Manifesto criado em ${join(here, 'manifesto-pins.json')}`);
