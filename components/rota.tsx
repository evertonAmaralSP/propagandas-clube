'use client'
import Link, { useLinkStatus } from 'next/link'
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ComponentProps, type ReactNode } from 'react'
import r from './rota.module.css'

/**
 * O aviso de que a rota está a caminho, copiado do instrutores-clube (components/rota.tsx).
 *
 * Sem `loading.tsx` o App Router segura a tela anterior inteira até o payload
 * chegar — nada pisca, e a leitura de quem clicou é "travou". Esta barra ocupa
 * exatamente esse vão.
 *
 * `useLinkStatus()` é a única forma oficial de saber que uma navegação começou,
 * e ela só funciona DENTRO de um descendente do `<Link>` — não existe versão
 * global que escute todos. Daí a forma desta peça: um `<Sensor />` invisível
 * viaja dentro de cada link, avisa o contexto, e a barra, montada uma vez no
 * layout, é quem desenha. Trocar um `<Link>` por `<LinkDeRota>` é o que liga um
 * destino ao aviso; link que não for trocado continua funcionando, só continua
 * mudo.
 *
 * Tudo em CSS, sem biblioteca: uma barra de 3px não justifica dependência.
 */

/* A curva termina aos 8s. Passados 15, a barra já passou metade do tempo
   parada nos 94% dizendo "ainda estou tentando" — e a chance de ser pendência
   presa é maior que a de ser navegação viva. */
const TETO_MS = 15_000

type Acoes = { comecou: () => void; terminou: () => void }

/* Sem provedor, os dois viram nada e o link segue navegando igual. O provedor
   mora na raiz (`app/layout.tsx`); a saída é só rede de segurança. */
const SEM_BARRA: Acoes = { comecou: () => {}, terminou: () => {} }

const AcoesDaRota = createContext<Acoes>(SEM_BARRA)
/* Contexto separado, de propósito: o valor de `AcoesDaRota` é memoizado uma vez
   e nunca muda, então os links não re-renderizam a cada navegação — só a barra,
   que é a única que assina o estado. */
const NavegandoAgora = createContext(false)

export function ProvedorDeRota({ children }: { children: ReactNode }) {
  // Contador, e não booleano: dois links podem ficar pendentes ao mesmo tempo
  // (um clique enquanto o anterior não resolveu), e com booleano o primeiro a
  // terminar apagaria a barra do outro, que ainda está em voo.
  const [emVoo, setEmVoo] = useState(0)
  const acoes = useMemo<Acoes>(
    () => ({
      comecou: () => setEmVoo((n) => n + 1),
      terminou: () => setEmVoo((n) => Math.max(0, n - 1)),
    }),
    [],
  )

  // Teto, porque o piso não basta. A limpeza do sensor cobre o caso de o link
  // desmontar — mas os links mais clicados moram no LAYOUT, que não remonta
  // quando se navega entre telas irmãs do mesmo clube. Para eles, pendência que
  // não voltasse a false não teria quem zerasse, e a barra ficaria acesa nos 94%
  // pelo resto da sessão: um risco pequeno com um estrago que não passa.
  //
  // Zerar o contador, e não só apagar a barra, é o que mantém o clique seguinte
  // funcionando — se o contador ficasse preso em 1, `navegando` nunca voltaria a
  // mudar de valor e a barra não acenderia de novo.
  useEffect(() => {
    if (emVoo === 0) return
    const t = setTimeout(() => setEmVoo(0), TETO_MS)
    return () => clearTimeout(t)
  }, [emVoo])

  return (
    <AcoesDaRota.Provider value={acoes}>
      <NavegandoAgora.Provider value={emVoo > 0}>{children}</NavegandoAgora.Provider>
    </AcoesDaRota.Provider>
  )
}

/** Não desenha nada: existe para ter de onde chamar `useLinkStatus()`. */
function Sensor() {
  const { pending } = useLinkStatus()
  const { comecou, terminou } = useContext(AcoesDaRota)
  useEffect(() => {
    if (!pending) return
    comecou()
    // Roda quando o pendente cai E quando o link desmonta. O desmonte cobre o
    // link que vive na página; o que mora no layout não desmonta ao navegar
    // entre telas irmãs, e para esse o que vale é o teto do provedor.
    return terminou
  }, [pending, comecou, terminou])
  return null
}

/**
 * `next/link` com o sensor junto. A assinatura é a do Link, sem nada a mais:
 * quem troca o import não muda nenhuma prop.
 */
export function LinkDeRota({ children, ...resto }: ComponentProps<typeof Link>) {
  return (
    <Link {...resto}>
      {children}
      <Sensor />
    </Link>
  )
}

/* Precisa terminar depois da animação de fecho do CSS (240ms). O número maior
   é folga: cortar antes engoliria o fim do movimento. */
const FECHO_MS = 280

/** Lê onde o avanço parou e guarda em `--parado`, para o fecho continuar dali. */
function congelar(el: HTMLDivElement | null) {
  if (!el) return
  let escala = 0.9
  try {
    const t = getComputedStyle(el).transform
    if (t && t !== 'none') escala = new DOMMatrixReadOnly(t).a
  } catch {
    /* Navegador sem DOMMatrixReadOnly: o fecho começa dos 0.9 do padrão, que é
       o que esta função existe para evitar — e não vale mais que um catch. */
  }
  el.style.setProperty('--parado', String(escala))
}

export function BarraDeRota() {
  const navegando = useContext(NavegandoAgora)
  const [fase, setFase] = useState<'parada' | 'andando' | 'fechando'>('parada')
  // Troca a cada navegação para remontar o elemento e reiniciar a animação:
  // reaproveitar o mesmo nó deixaria a segunda navegação começar dos 94%.
  const [volta, setVolta] = useState(0)
  const avanco = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!navegando) return
    setVolta((n) => n + 1)
    setFase('andando')
  }, [navegando])

  useEffect(() => {
    if (navegando || fase !== 'andando') return
    congelar(avanco.current)
    setFase('fechando')
  }, [navegando, fase])

  useEffect(() => {
    if (fase !== 'fechando') return
    const t = setTimeout(() => setFase('parada'), FECHO_MS)
    return () => clearTimeout(t)
  }, [fase])

  if (fase === 'parada') return null
  return (
    // `aria-hidden`: a chegada da tela nova já é anunciada pelo leitor de rota
    // do próprio Next, e uma segunda região viva falando "carregando" a cada
    // clique atrapalharia mais do que informa.
    <div className={r.trilho} data-barra-rota={fase} aria-hidden="true">
      <div key={volta} ref={avanco} className={fase === 'fechando' ? `${r.avanco} ${r.conclui}` : r.avanco} />
    </div>
  )
}
