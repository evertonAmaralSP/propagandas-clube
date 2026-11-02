import { acampamento } from './acampamento'
import type { DefinicaoDeTemplate } from './motor'
import { r01Elegante } from './r01-elegante'
import { r02FotoCheia } from './r02-foto-cheia'
import { r03CartaoData } from './r03-cartao-data'
import { r04Numero } from './r04-numero'
import { r05Informativo } from './r05-informativo'
import { r06Carimbo } from './r06-carimbo'
import { r07Holofote } from './r07-holofote'
import { r08Unidades } from './r08-unidades'
import { r09Versiculo } from './r09-versiculo'
import { r10Listras } from './r10-listras'
import { r11Circulo } from './r11-circulo'
import { r12Aviso } from './r12-aviso'
import { reuniao } from './reuniao'
import { t01Investidura } from './t01-investidura'
import { t02Trilha } from './t02-trilha'
import { t03Campori } from './t03-campori'
import { t04DiaDesbravador } from './t04-dia-desbravador'
import { t05Especialidade } from './t05-especialidade'
import { t06Solidaria } from './t06-solidaria'
import { t07Talentos } from './t07-talentos'
import { t08Gincana } from './t08-gincana'
import { t09Sabado } from './t09-sabado'
import { t10Desfile } from './t10-desfile'
import { t11Aniversario } from './t11-aniversario'
import { t12Pais } from './t12-pais'
import { tragaUmAmigo } from './traga-um-amigo'

// Os templates do clube, na ordem em que aparecem no wizard. Template novo = um arquivo com a
// definição e a arte (com `categoria` e `deInformacoes`), acrescentado aqui; o wizard, o editor,
// a prévia e a exportação vêm do motor. Os desenhos vêm do canvas "Chamadas do Clube".
export const TEMPLATES: DefinicaoDeTemplate[] = [
  // Reunião Regular
  reuniao, r01Elegante, r02FotoCheia, r03CartaoData, r04Numero, r05Informativo, r06Carimbo,
  r07Holofote, r08Unidades, r09Versiculo, r10Listras, r11Circulo, r12Aviso,
  // Eventos
  t01Investidura, t02Trilha, t03Campori, t04DiaDesbravador, t05Especialidade, t06Solidaria,
  t07Talentos, t08Gincana, t09Sabado, t10Desfile, t11Aniversario, t12Pais, acampamento, tragaUmAmigo,
]

export const templatePorId = (id: string) => TEMPLATES.find((t) => t.id === id) ?? null
