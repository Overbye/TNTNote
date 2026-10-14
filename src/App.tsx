import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Check, ChevronLeft, Eye, FileText, Menu, Plus, Search, Trash2, X } from 'lucide-react'
import { noteTitle } from './domain/note'
import { useNotes } from './hooks/useNotes'
import './App.css'

type ViewMode = 'write' | 'preview'
const formatTime = (value: string) => new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value))

function App() {
  const notes = useNotes()
  const [query, setQuery] = useState('')
  const [view, setView] = useState<ViewMode>('write')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<string>()
  const filtered = useMemo(() => {
    const keyword = query.trim().toLocaleLowerCase()
    return keyword ? notes.notes.filter((note) => `${noteTitle(note)} ${note.content}`.toLocaleLowerCase().includes(keyword)) : notes.notes
  }, [notes.notes, query])
  if (!notes.ready || !notes.activeNote) return <main className="loading"><span className="brand-mark">T</span><p>正在打开便签…</p></main>
  const active = notes.activeNote

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="icon-button mobile-only" aria-label="打开便签列表" onClick={() => setSidebarOpen(true)}><Menu /></button>
        <div className="brand"><span className="brand-mark">T</span><strong>TNTNote</strong></div>
        <div className="save-state" aria-live="polite"><Check size={14} />{notes.saveState === 'saving' ? '正在保存' : '已保存到本机'}</div>
        <span className="local-pill">游客 · 本地</span>
      </header>
      <section className="workspace">
        {sidebarOpen && <button className="sidebar-scrim" aria-label="关闭便签列表" onClick={() => setSidebarOpen(false)} />}
        <aside className={`sidebar ${sidebarOpen ? 'is-open' : ''}`}>
          <div className="sidebar-heading">
            <button className="icon-button mobile-only" aria-label="关闭便签列表" onClick={() => setSidebarOpen(false)}><X /></button>
            <div><p className="eyebrow">我的便签</p><h1>{notes.notes.length} 张便签</h1></div>
            <button className="new-note" onClick={notes.addNote}><Plus size={18} />新建</button>
          </div>
          <label className="search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索便签" /></label>
          <div className="note-list">
            {filtered.map((note, index) => <article key={note.id} className={`note-card color-${['gold', 'mint', 'rose', 'sky'][index % 4]} ${note.id === notes.activeId ? 'active' : ''}`}>
              <button className="note-select" onClick={() => { notes.setActiveId(note.id); setSidebarOpen(false) }}><h2>{noteTitle(note)}</h2><p>{note.content.replace(/[#>*_`-]/g, '').trim() || '开始写点什么吧…'}</p><time>{formatTime(note.updatedAt)}</time></button>
              <button className="card-delete" aria-label={`删除${noteTitle(note)}`} onClick={() => setPendingDelete(note.id)}><Trash2 size={15} /></button>
            </article>)}
            {!filtered.length && <div className="empty-search"><Search /><p>没有找到相关便签</p></div>}
          </div>
          <footer className="sidebar-footer"><span className="status-dot" />数据仅保存在此设备</footer>
        </aside>
        <section className="editor-panel">
          <div className="editor-toolbar">
            <button className="back-button mobile-only" onClick={() => setSidebarOpen(true)}><ChevronLeft size={18} />全部便签</button>
            <div className="segmented" aria-label="编辑模式"><button className={view === 'write' ? 'active' : ''} onClick={() => setView('write')}><FileText size={16} />编辑</button><button className={view === 'preview' ? 'active' : ''} onClick={() => setView('preview')}><Eye size={16} />预览</button></div>
            <button className="delete-button" onClick={() => setPendingDelete(active.id)}><Trash2 size={17} /><span>删除</span></button>
          </div>
          <div className="paper-wrap"><div className="paper">
            <input className="title-input" aria-label="便签标题" value={active.title} onChange={(event) => notes.updateActive({ title: event.target.value, content: active.content })} placeholder="无标题便签" />
            <div className="paper-meta"><time>最后编辑于 {formatTime(active.updatedAt)}</time><span>Markdown</span></div>
            {view === 'write' ? <textarea aria-label="便签内容" value={active.content} onChange={(event) => notes.updateActive({ title: active.title, content: event.target.value })} placeholder={'写下你的想法…\n\n支持 # 标题、**加粗**、- 列表、[链接](https://example.com)'} autoFocus /> : <article className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{active.content || '*这张便签还是空的。*'}</ReactMarkdown></article>}
            <div className="paper-bottom"><span>{active.content.length} 字符</span><span>v{active.version}</span></div>
          </div></div>
        </section>
      </section>
      {pendingDelete && <div className="dialog-layer"><section className="dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title"><div className="dialog-icon"><Trash2 /></div><h2 id="delete-title">删除这张便签？</h2><p>删除后将无法从此设备恢复。</p><div className="dialog-actions"><button onClick={() => setPendingDelete(undefined)}>取消</button><button className="danger" onClick={() => { void notes.deleteNote(pendingDelete); setPendingDelete(undefined) }}>删除</button></div></section></div>}
    </main>
  )
}

export default App
