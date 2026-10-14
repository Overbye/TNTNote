import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  AlignLeft, ArchiveRestore, Bold, BookOpen, CheckSquare, ChevronDown, Eye,
  FileText, Folder, Heading2, Image, List, LogOut, Maximize2, Menu,
  PanelLeftClose, Pencil, Phone, Plus, Quote, RefreshCw, Search, Send, SquarePen,
  Star, Trash2, X,
} from 'lucide-react'
import { noteTitle } from './domain/note'
import { useNotes } from './hooks/useNotes'
import './App.css'

type ViewMode = 'write' | 'preview'

const formatDay = (value: string) => new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric' }).format(new Date(value))
const formatClock = (value: string) => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(new Date(value))

function ToolButton({ label, danger, children, onClick }: { label: string; danger?: boolean; children: ReactNode; onClick?: () => void }) {
  return <button className={`tool-button ${danger ? 'danger' : ''}`} aria-label={label} title={label} onClick={onClick}>{children}</button>
}

export default function App() {
  const notes = useNotes()
  const [query, setQuery] = useState('')
  const [view, setView] = useState<ViewMode>('write')
  const [navigationOpen, setNavigationOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<string>()

  const filtered = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase()
    return keyword ? notes.notes.filter((note) => `${noteTitle(note)} ${note.content}`.toLocaleLowerCase().includes(keyword)) : notes.notes
  }, [notes.notes, query])

  if (!notes.ready || !notes.activeNote) return <main className="loading"><span className="app-icon"><Pencil /></span><p>正在打开便签…</p></main>
  const active = notes.activeNote

  const selectNote = (id: string) => { notes.setActiveId(id); setNavigationOpen(false); setView('write') }
  const createNew = () => { notes.addNote(); setNavigationOpen(false); setView('write') }

  return (
    <main className="app-shell">
      <header className="main-toolbar">
        <div className="brand-zone">
          <button className="hamburger" aria-label="打开导航" onClick={() => setNavigationOpen(true)}><Menu /></button>
          <span className="brand-title">TNTNote</span>
        </div>
        <div className="toolbar-group primary-actions">
          <ToolButton label="同步"><RefreshCw /></ToolButton>
          <ToolButton label="新建便签" onClick={createNew}><SquarePen /></ToolButton>
          <ToolButton label="插入图片"><Image /></ToolButton>
          <ToolButton label="导出便签"><LogOut /></ToolButton>
        </div>
        <div className="toolbar-group end-actions">
          <ToolButton label="发送"><Send /></ToolButton>
          <ToolButton label="删除" danger onClick={() => setPendingDelete(active.id)}><Trash2 /></ToolButton>
        </div>
      </header>

      <section className="desktop-workspace">
        {navigationOpen && <button className="navigation-scrim" aria-label="关闭导航" onClick={() => setNavigationOpen(false)} />}
        <div className={`navigation-shell ${navigationOpen ? 'is-open' : ''}`}>
          <aside className="category-pane">
            <div className="mobile-nav-head"><strong>便签导航</strong><button aria-label="关闭导航" onClick={() => setNavigationOpen(false)}><X /></button></div>
            <label className="search-box"><Search /><input aria-label="搜索便签" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="快速搜索关键字" /></label>
            <div className="section-label"><ChevronDown />便签<button aria-label="添加分类"><Plus /></button></div>
            <span className="sr-only">{notes.notes.length} 张便签</span>
            <nav className="category-list" aria-label="便签分类">
              <button className="active"><FileText /><span>全部便签</span><b>{notes.notes.length}</b></button>
              <button><Star /><span>加星便签</span><b>0</b></button>
              <button><Phone /><span>通话便签</span><b>0</b></button>
              <button><Folder /><span>账号信息</span><b>0</b></button>
              <button><Folder /><span>TNTNote</span><b>{notes.notes.length}</b></button>
              <button><ArchiveRestore /><span>回收站</span><b>0</b></button>
            </nav>
            <div className="section-label knowledge"><ChevronDown />知识库</div>
            <div className="local-status"><span className="status-dot" />游客 · 本地</div>
          </aside>

          <aside className="note-pane">
            <div className="note-pane-mobile-title"><BookOpen />全部便签</div>
            <div className="note-list">
              {filtered.map((note) => (
                <article key={note.id} className={`note-row ${note.id === notes.activeId ? 'active' : ''}`}>
                  <button className="note-select" onClick={() => selectNote(note.id)}>
                    <time>{formatDay(note.updatedAt)}</time>
                    <strong>{noteTitle(note)}</strong>
                    <p>{note.content.replace(/[#>*_`-]/g, '').trim() || '开始写点什么吧…'}</p>
                  </button>
                  <button className="row-star" aria-label={`加星${noteTitle(note)}`}><Star /></button>
                </article>
              ))}
              {!filtered.length && <div className="empty-search"><Search /><p>没有找到相关便签</p></div>}
            </div>
            <button className="list-footer" aria-label="切换列表布局"><PanelLeftClose /></button>
          </aside>
        </div>

        <section className="editor-pane">
          <div className="format-toolbar">
            <button className="mobile-back" onClick={() => setNavigationOpen(true)}><Menu />便签</button>
            <button className="mode-menu" onClick={() => setView(view === 'write' ? 'preview' : 'write')}>{view === 'write' ? '富文本模式' : '预览模式'}<ChevronDown /></button>
            <div className="format-actions" aria-label="格式工具">
              <button aria-label="标题"><Heading2 /></button><button aria-label="对齐"><AlignLeft /></button><button aria-label="列表"><List /></button><button aria-label="粗体"><Bold /></button><button aria-label="引用"><Quote /></button><button aria-label="任务"><CheckSquare /></button>
            </div>
            <div className="note-meta"><Folder /><span>全部便签</span><i /> <time>{formatClock(active.updatedAt)}</time><i /><span>共 {active.content.length} 字</span><i /><Star /><i /><Maximize2 /></div>
            <button className="mobile-preview" aria-label={view === 'write' ? '预览' : '编辑'} onClick={() => setView(view === 'write' ? 'preview' : 'write')}>{view === 'write' ? <Eye /> : <Pencil />}</button>
          </div>

          <div className="ruled-paper">
            <input className="title-input" aria-label="便签标题" value={active.title} onChange={(event) => notes.updateActive({ title: event.target.value, content: active.content })} placeholder="无标题便签" />
            {view === 'write' ? (
              <textarea aria-label="便签内容" value={active.content} onChange={(event) => notes.updateActive({ title: active.title, content: event.target.value })} placeholder="写点什么吧…" autoFocus />
            ) : (
              <article className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{active.content || '*这张便签还是空的。*'}</ReactMarkdown></article>
            )}
            <div className="save-indicator">{notes.saveState === 'saving' ? '正在保存…' : '已保存到本机'}</div>
          </div>
        </section>
      </section>

      <button className="mobile-new" aria-label="创建便签" onClick={createNew}><Plus /></button>

      {pendingDelete && <div className="dialog-layer"><section className="dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title"><div className="dialog-icon"><Trash2 /></div><h2 id="delete-title">删除这张便签？</h2><p>删除后将无法从此设备恢复。</p><div className="dialog-actions"><button onClick={() => setPendingDelete(undefined)}>取消</button><button className="danger" onClick={() => { void notes.deleteNote(pendingDelete); setPendingDelete(undefined) }}>删除</button></div></section></div>}
    </main>
  )
}
