'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import p from '@/app/estilo/portal.module.css'
import { LinkDeRota } from '@/components/rota'
import { classeFontesDasArtes } from '@/components/templates/fontes'
import { templatePorId } from '@/components/templates'
import {
  ORDEM_DAS_SECOES, limparValores, pendencias, resolverImagens, txt, type Campo, type Valores,
} from '@/components/templates/motor'
import { arquivoParaSalvar, baixar, gerarPng, nomeDoPng } from '@/components/templates/exportar'
import { AvisoDoEnvio, useEnvioWhatsapp } from '@/components/templates/envio-whatsapp'
import type { FotoDaGaleria, LogoDoClube } from '@/components/templates/tipos-do-editor'
import { LIMITE_DA_PROPAGANDA } from '@/lib/propagandas'
import { salvarPropaganda } from '../../propagandas/acoes'
import { SeletorDeFoto } from './seletor-de-foto'
import ed from './editor.module.css'

type Acao = 'baixar' | 'whatsapp' | 'salvar'
type Estado =
  | { tipo: 'parado' }
  | { tipo: 'gerando'; para: Acao }
  | { tipo: 'salvo' }
  | { tipo: 'erro'; mensagem: string }

/**
 * A definição do template vem do registro no navegador (tem componente); o servidor manda só o id.
 * `inicial` são os valores de uma propaganda salva, para fazer uma cópia; foto ou logo que não
 * existem mais voltam vazios.
 */
export function Editor({ templateId, fotos, logos, inicial, rascunho }: {
  templateId: string; fotos: FotoDaGaleria[]; logos: LogoDoClube[]; inicial?: unknown; rascunho?: string
}) {
  const t = templatePorId(templateId)!
  const principal = logos.find((l) => l.principal)?.id ?? null
  const preparar = (bruto: unknown) => {
    const v = limparValores(t, bruto, principal)
    const existe = new Set([...fotos.map((f) => f.id), ...logos.map((l) => l.id)])
    for (const c of t.campos) {
      if ((c.tipo === 'foto' || c.tipo === 'logo') && v[c.chave] && !existe.has(String(v[c.chave]))) v[c.chave] = ''
    }
    return v
  }
  const [valores, setValores] = useState<Valores>(() => preparar(inicial))

  // opção vinda do wizard: os valores estão no sessionStorage (só existe no navegador)
  useEffect(() => {
    if (!rascunho) return
    try {
      const salvo = sessionStorage.getItem(`rascunho:${rascunho}`)
      if (salvo) setValores(preparar(JSON.parse(salvo)))
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps -- só na abertura
  }, [rascunho])
  const [escolhendo, setEscolhendo] = useState<Campo | null>(null)
  const [estado, setEstado] = useState<Estado>({ tipo: 'parado' })
  const envio = useEnvioWhatsapp()
  const arte = useRef<HTMLDivElement>(null)
  const palco = useRef<HTMLDivElement>(null)
  const [escala, setEscala] = useState(0.6)

  const enderecos = useMemo(() => {
    const m = new Map<string, string>()
    fotos.forEach((f) => m.set(f.id, f.url))
    logos.forEach((l) => m.set(l.id, l.url))
    return m
  }, [fotos, logos])
  const fotoPorId = useMemo(() => new Map(fotos.map((f) => [f.id, f])), [fotos])

  // a prévia ocupa a largura da coluna; a arte fica no tamanho real e só a tela a reduz
  useEffect(() => {
    const el = palco.current
    if (!el) return
    const ajustar = () => setEscala(Math.min(1, el.clientWidth / t.largura))
    ajustar()
    const obs = new ResizeObserver(ajustar)
    obs.observe(el)
    return () => obs.disconnect()
  }, [t.largura])

  // mudou a arte: o aviso de "salvo" e os do envio deixam de valer
  const mudar = (chave: string, valor: string | number) => {
    setValores((v) => ({ ...v, [chave]: valor }))
    setEstado((e) => (e.tipo === 'gerando' ? e : { tipo: 'parado' }))
    envio.limpar()
  }

  const faltando = pendencias(t, valores)
  const ocupado = estado.tipo === 'gerando'
  const nome = nomeDoPng(t.nome, txt(valores, 'titulo').split('\n').join(' '))
  const Arte = t.Arte

  const salvo = estado.tipo === 'salvo'

  async function gerar(para: Acao): Promise<Blob | null> {
    if (!arte.current) return null
    envio.limpar()
    setEstado({ tipo: 'gerando', para })
    try {
      return await gerarPng(arte.current, t.largura, t.altura)
    } catch (e) {
      console.error('templates: não gerou o PNG', e)
      setEstado({ tipo: 'erro', mensagem: 'Não consegui gerar a imagem. Recarregue a página e tente de novo.' })
      return null
    }
  }

  async function aoBaixar() {
    const blob = await gerar('baixar')
    if (!blob) return
    baixar(blob, nome)
    setEstado((e) => (e.tipo === 'gerando' ? { tipo: 'parado' } : e))
  }

  async function aoEnviarWhatsapp() {
    const blob = await gerar('whatsapp')
    if (!blob) return
    setEstado({ tipo: 'parado' })
    await envio.enviar(blob, nome)
  }

  async function aoSalvar() {
    const png = await gerar('salvar')
    if (!png || !arte.current) return
    try {
      const arquivo = await arquivoParaSalvar(arte.current, t.largura, t.altura, png, LIMITE_DA_PROPAGANDA)
      const dados = new FormData()
      dados.set('arquivo', new File([arquivo], nome, { type: arquivo.type }))
      dados.set('template', t.id)
      dados.set('valores', JSON.stringify(valores))
      dados.set('largura', String(t.largura * 2))
      dados.set('altura', String(t.altura * 2))
      const r = await salvarPropaganda(dados)
      setEstado(r.ok ? { tipo: 'salvo' } : { tipo: 'erro', mensagem: r.erro })
    } catch (e) {
      console.error('templates: não salvou a propaganda', e)
      setEstado({ tipo: 'erro', mensagem: 'Não consegui salvar a arte. Tente de novo.' })
    }
  }

  const secoes = ORDEM_DAS_SECOES
    .map((s) => ({ secao: s, campos: t.campos.filter((c) => c.secao === s) }))
    .filter((s) => s.campos.length > 0)

  return (
    <div className={ed.grade}>
      <section className={ed.colunaPrevia} aria-label="Prévia">
        <div ref={palco} className={ed.palco} style={{ height: t.altura * escala }}>
          <div className={ed.escala} style={{ width: t.largura, height: t.altura, transform: `scale(${escala})` }}>
            <div ref={arte} className={classeFontesDasArtes} role="img" aria-label={`Prévia da propaganda ${t.nome}`}>
              <Arte v={resolverImagens(t, valores, enderecos)} />
            </div>
          </div>
        </div>

        <div className={ed.acoes}>
          {faltando.length > 0 && (
            <p className={ed.falta} role="status">Falta preencher: {faltando.join(', ')}.</p>
          )}
          <div className={ed.botoes}>
            <button type="button" className={p.btnGold} onClick={aoBaixar} disabled={ocupado || faltando.length > 0}>
              {estado.tipo === 'gerando' && estado.para === 'baixar' ? 'Gerando…' : 'Baixar PNG'}
            </button>
            <button type="button" className={p.btnPine} onClick={aoEnviarWhatsapp} disabled={ocupado || faltando.length > 0}>
              {estado.tipo === 'gerando' && estado.para === 'whatsapp' ? 'Gerando…' : 'Enviar no WhatsApp'}
            </button>
            <button type="button" className={p.btnFino} onClick={aoSalvar} disabled={ocupado || salvo || faltando.length > 0}>
              {estado.tipo === 'gerando' && estado.para === 'salvar' ? 'Salvando…' : salvo ? 'Salva na galeria' : 'Salvar na galeria'}
            </button>
          </div>
          {salvo && (
            <p className={ed.aviso} role="status">
              Salva em <LinkDeRota href="/propagandas" className={p.link}>Propagandas</LinkDeRota>. Mude algo na arte para salvar outra versão.
            </p>
          )}
          <AvisoDoEnvio envio={envio} classe={ed.aviso} />
          {estado.tipo === 'erro' && <p className={p.erro} role="alert">{estado.mensagem}</p>}
          <p className={p.ajuda}>PNG de {t.largura * 2} × {t.altura * 2} px, no formato do status e dos stories.</p>
        </div>
      </section>

      <div className={ed.formulario}>
        {secoes.map(({ secao, campos }) => (
          <fieldset key={secao} className={`${p.card} ${ed.secao}`}>
            <legend className={ed.legenda}>{secao}</legend>
            {secao === 'Imagens' ? (
              <>
                {campos.filter((c) => c.tipo === 'logo').map((c) => (
                  <CampoLogo key={c.chave} campo={c} valor={txt(valores, c.chave)} logos={logos} mudar={mudar} />
                ))}
                <div className={ed.fotos}>
                  {campos.filter((c) => c.tipo === 'foto').map((c) => {
                    const foto = fotoPorId.get(txt(valores, c.chave))
                    return (
                      <div key={c.chave} className={ed.foto}>
                        <button type="button" className={ed.fotoBotao} onClick={() => setEscolhendo(c)}
                          aria-label={foto ? `${c.rotulo}: ${foto.nome}. Trocar` : `Escolher ${c.rotulo}`}>
                          {foto
                            // eslint-disable-next-line @next/next/no-img-element -- URL assinada do Storage
                            ? <img src={foto.url} alt="" />
                            : <span>+ {c.rotulo}</span>}
                        </button>
                        <span className={ed.fotoRotulo}>{c.rotulo}</span>
                      </div>
                    )
                  })}
                </div>
                {fotos.length === 0 && (
                  <p className={p.ajuda}>A galeria está vazia. <LinkDeRota href="/enviar" className={p.link}>Envie fotos</LinkDeRota> primeiro.</p>
                )}
              </>
            ) : (
              campos.map((c) => <CampoSimples key={c.chave} campo={c} valor={valores[c.chave]} mudar={mudar} />)
            )}
          </fieldset>
        ))}
      </div>

      {escolhendo && (
        <SeletorDeFoto
          titulo={escolhendo.rotulo}
          fotos={fotos}
          atual={txt(valores, escolhendo.chave)}
          escolher={(id) => mudar(escolhendo.chave, id)}
          fechar={() => setEscolhendo(null)}
        />
      )}
    </div>
  )
}

function CampoSimples({ campo: c, valor, mudar }: { campo: Campo; valor: string | number | undefined; mudar: (k: string, v: string | number) => void }) {
  const id = `campo-${c.chave}`
  if (c.tipo === 'texto') {
    const texto = String(valor ?? '')
    return (
      <div>
        <label className={p.rotulo} htmlFor={id}>{c.rotulo}{c.obrigatorio ? ' *' : ''}</label>
        {c.multilinha ? (
          <textarea id={id} className={`${p.campo} ${ed.area}`} value={texto} maxLength={c.maximo}
            rows={Math.min(7, texto.split('\n').length + 1)} onChange={(e) => mudar(c.chave, e.target.value)} />
        ) : (
          <input id={id} className={p.campo} value={texto} maxLength={c.maximo} onChange={(e) => mudar(c.chave, e.target.value)} />
        )}
        {c.ajuda && <p className={p.ajuda}>{c.ajuda}</p>}
      </div>
    )
  }
  if (c.tipo === 'tamanho') {
    const n = Number(valor ?? c.padrao)
    return (
      <div>
        <label className={p.rotulo} htmlFor={id}>{c.rotulo} <span className={ed.valor}>{n} px</span></label>
        <input id={id} className={ed.faixa} type="range" min={c.min} max={c.max} step={c.passo} value={n}
          onChange={(e) => mudar(c.chave, Number(e.target.value))} />
      </div>
    )
  }
  if (c.tipo === 'cor') {
    return (
      <div role="group" aria-labelledby={`${id}-rotulo`}>
        <span id={`${id}-rotulo`} className={p.rotulo}>{c.rotulo}</span>
        <div className={ed.cores}>
          {c.opcoes.map((o) => (
            <button key={o.valor} type="button" className={`${ed.cor} ${valor === o.valor ? ed.corAtiva : ''}`}
              aria-pressed={valor === o.valor} onClick={() => mudar(c.chave, o.valor)}>
              <span className={ed.amostra} style={{ background: o.valor }} aria-hidden="true" />
              {o.nome}
            </button>
          ))}
        </div>
      </div>
    )
  }
  return null
}

function CampoLogo({ campo: c, valor, logos, mudar }: { campo: Campo; valor: string; logos: LogoDoClube[]; mudar: (k: string, v: string) => void }) {
  return (
    <div role="group" aria-labelledby="rotulo-logo">
      <span id="rotulo-logo" className={p.rotulo}>{c.rotulo}</span>
      {logos.length === 0 ? (
        <p className={p.ajuda}>O clube ainda não tem logo. <LinkDeRota href="/logo" className={p.link}>Envie o logo</LinkDeRota> para ele aparecer na arte.</p>
      ) : (
        <div className={ed.logos}>
          {logos.map((l) => (
            <button key={l.id} type="button" className={`${ed.logo} ${valor === l.id ? ed.logoAtivo : ''}`}
              aria-pressed={valor === l.id} onClick={() => mudar(c.chave, l.id)} title={l.nome}>
              {/* eslint-disable-next-line @next/next/no-img-element -- URL assinada do Storage */}
              <img src={l.url} alt="" />
              <span>{l.nome}</span>
            </button>
          ))}
          <button type="button" className={`${ed.logo} ${valor === '' ? ed.logoAtivo : ''}`}
            aria-pressed={valor === ''} onClick={() => mudar(c.chave, '')}>
            <span className={ed.semLogo}>—</span>
            <span>Sem logo</span>
          </button>
        </div>
      )}
    </div>
  )
}
