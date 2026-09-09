import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Check, ChevronRight, Eye, Pencil, Plus, RefreshCw, Search, ShieldCheck, Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useLocalStorageState } from '../context/useLocalStorageState'

const ACTIONS = [
  { key: 'view', label: 'Xem', icon: Eye },
  { key: 'create', label: 'Thêm mới', icon: Plus },
  { key: 'update', label: 'Cập nhật', icon: Pencil },
  { key: 'delete', label: 'Xóa', icon: Trash2 },
]
const GROUPS = [
  { id: 'admin', name: 'Quản trị bán trú', children: [
    ['/nguoi-phu-trach', 'Thông tin người phụ trách'], ['/cong-ty-suat-an', 'Công ty cung cấp suất ăn'],
    ['/thuc-don', 'Thực đơn'], ['/hoc-sinh', 'Học sinh'], ['/danh-gia-hoc-sinh', 'Đánh giá học sinh'],
  ] },
  { id: 'utilities', name: 'Lối tắt & Tiện ích', children: [
    ['/', 'Tổng quan hệ thống'], ['/bieu-mau-3-buoc', 'Biểu mẫu 3 bước'], ['/bao-cao', 'Báo cáo'],
    ['/bao-cao?tab=diem-danh', 'Báo cáo học sinh'], ['/van-ban-lien-quan', 'Văn bản liên quan'],
  ] },
]
const MENUS = GROUPS.flatMap((group) => group.children.map(([id, name]) => ({ id, name, groupName: group.name })))
const EMPTY = { view: false, create: false, update: false, delete: false }

function defaults(role) {
  const allowed = role === 'admin' || role === 'manager' ? MENUS.map((m) => m.id)
    : role === 'teacher' ? ['/', '/hoc-sinh', '/danh-gia-hoc-sinh', '/thuc-don']
      : ['/', '/thuc-don', '/van-ban-lien-quan']
  return Object.fromEntries(MENUS.map((menu) => [menu.id, {
    view: allowed.includes(menu.id), create: role === 'admin' && allowed.includes(menu.id),
    update: ['admin', 'manager'].includes(role) && allowed.includes(menu.id),
    delete: role === 'admin' && allowed.includes(menu.id),
  }]))
}
function normalize(map, accounts) {
  return Object.fromEntries(accounts.map((account) => {
    const saved = map?.[account.id]
    if (Array.isArray(saved)) return [account.id, Object.fromEntries(MENUS.map((m) => [m.id, { ...EMPTY, view: saved.includes(m.id) }]))]
    if (saved && typeof saved === 'object') return [account.id, Object.fromEntries(MENUS.map((m) => [m.id, { ...EMPTY, ...saved[m.id] }]))]
    return [account.id, defaults(account.roleKey)]
  }))
}
const same = (a, b) => JSON.stringify(a || {}) === JSON.stringify(b || {})

function PermissionCheck({ action, checked, onChange }) {
  const Icon = action.icon
  return <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">
    <input className="sr-only" type="checkbox" checked={checked} onChange={onChange} />
    <span className={`flex h-4 w-4 items-center justify-center rounded border ${checked ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'}`}>{checked && <Check size={11} strokeWidth={3} />}</span>
    <Icon size={13} className={checked ? 'text-teal-600' : 'text-slate-400'} />{action.label}
  </label>
}
function EmptyState({ error, retry }) {
  return <div className={`flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center ${error ? 'border-rose-200 bg-rose-50/40' : 'border-slate-200 bg-slate-50/40'}`}>
    {error ? <AlertCircle size={25} className="text-rose-500" /> : <ShieldCheck size={25} className="text-slate-400" />}
    <h3 className="mt-3 text-sm font-bold text-slate-800">{error ? 'Không thể tải dữ liệu' : 'Chọn tài khoản để hiển thị danh sách menu'}</h3>
    <p className="mt-1 text-xs text-slate-500">{error ? 'Đã xảy ra lỗi khi tải thông tin phân quyền.' : 'Chọn một tài khoản ở danh sách bên trái.'}</p>
    {error && <button onClick={retry} className="mt-3 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700">Thử lại</button>}
  </div>
}

export default function MenuPermissions() {
  const { teachers, managerInfo } = useApp()
  const navigate = useNavigate()
  const initialAccounts = useMemo(() => [
    { id: 'acc-admin', name: 'Nam Khang Ha', username: 'namkhang', role: 'Tài khoản hệ thống', roleKey: 'admin', email: 'namkhang@uit.edu.vn', initials: 'NK' },
    { id: 'acc-manager', name: managerInfo?.hoTen || 'Đỗ Thị Thanh Tâm', username: managerInfo?.email, role: managerInfo?.chucVu || 'Quản lý bán trú', roleKey: 'manager', email: managerInfo?.email, initials: 'TT' },
    ...teachers.map((t) => ({ id: `acc-t-${t.id}`, name: t.hoTen, username: t.email, role: `Giáo viên chủ nhiệm (${t.lop})`, roleKey: 'teacher', email: t.email, initials: t.hoTen.split(' ').at(-1)?.slice(0, 2).toUpperCase() || 'GV' })),
    { id: 'acc-caterer', name: 'Công ty TNHH Suất ăn An Lành', username: 'anlanh.catering', role: 'Đối tác cung cấp suất ăn', roleKey: 'caterer', email: 'anlanh.catering@gmail.com', initials: 'AL' },
  ], [teachers, managerInfo])
  const [accounts, setAccounts] = useLocalStorageState('app_accounts_list', initialAccounts)
  const [stored, setStored] = useLocalStorageState('menu_permissions_map', {})
  const permissionMap = useMemo(() => normalize(stored, accounts), [stored, accounts])
  const [selectedId, setSelectedId] = useState(null)
  const [draft, setDraft] = useState({})
  const [query, setQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [toast, setToast] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [newAccount, setNewAccount] = useState({ name: '', email: '', roleKey: 'teacher' })
  const selected = accounts.find((a) => a.id === selectedId)
  const saved = selectedId ? permissionMap[selectedId] : {}
  const dirty = Boolean(selected) && !same(draft, saved)
  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase('vi')
    return accounts.filter((a) => !term || [a.name, a.username, a.email, a.role].join(' ').toLocaleLowerCase('vi').includes(term))
  }, [accounts, query])
  const summary = useMemo(() => Object.fromEntries(ACTIONS.map((a) => [a.key, MENUS.filter((m) => draft[m.id]?.[a.key]).length])), [draft])
  const enabledMenus = MENUS.filter((m) => ACTIONS.some((a) => draft[m.id]?.[a.key])).length

  useEffect(() => {
    const unload = (event) => { if (dirty) { event.preventDefault(); event.returnValue = '' } }
    const links = (event) => {
      if (!dirty) return
      const anchor = event.target.closest('a[href]')
      if (!anchor || anchor.target === '_blank') return
      const url = new URL(anchor.href, location.href)
      if (url.pathname === location.pathname && url.search === location.search) return
      event.preventDefault()
      if (window.confirm('Bạn có thay đổi chưa được lưu.\nTiếp tục rời trang?')) navigate(url.pathname + url.search)
    }
    window.addEventListener('beforeunload', unload); document.addEventListener('click', links, true)
    return () => { window.removeEventListener('beforeunload', unload); document.removeEventListener('click', links, true) }
  }, [dirty, navigate])

  function selectAccount(id) {
    if (dirty && !window.confirm('Bạn có thay đổi chưa được lưu.\nTiếp tục rời trang?')) return
    setSelectedId(id); setLoading(true); setError(false)
    setTimeout(() => { try { setDraft(structuredClone(permissionMap[id] || {})); setLoading(false) } catch { setLoading(false); setError(true) } }, 180)
  }
  function toggle(menuId, action, checked) {
    setDraft((current) => {
      const next = { ...current, [menuId]: { ...EMPTY, ...current[menuId] } }
      if (action === 'view' && !checked) next[menuId] = { ...EMPTY }
      else { next[menuId][action] = checked; if (action !== 'view' && checked) next[menuId].view = true }
      return next
    })
  }
  function save() {
    if (!dirty) return
    setSaving(true)
    setTimeout(() => {
      try {
        setStored((current) => ({ ...normalize(current, accounts), [selectedId]: draft }))
        setSaving(false); setToast({ ok: true, text: 'Cập nhật phân quyền thành công' })
        setTimeout(() => setToast(null), 3000)
      } catch { setSaving(false); setToast({ ok: false, text: 'Không thể cập nhật phân quyền. Vui lòng thử lại.' }) }
    }, 350)
  }
  function addAccount(event) {
    event.preventDefault()
    const name = newAccount.name.trim()
    if (!name) return
    const id = `acc-${Date.now()}`, roles = { admin: 'Tài khoản hệ thống', manager: 'Quản lý bán trú', teacher: 'Giáo viên chủ nhiệm', caterer: 'Đối tác cung cấp suất ăn' }
    const account = { id, name, username: newAccount.email, email: newAccount.email, roleKey: newAccount.roleKey, role: roles[newAccount.roleKey], initials: name.split(' ').at(-1).slice(0, 2).toUpperCase() }
    setAccounts((value) => [account, ...value]); setStored((value) => ({ ...normalize(value, accounts), [id]: defaults(account.roleKey) }))
    setSelectedId(id); setDraft(defaults(account.roleKey)); setAddOpen(false); setNewAccount({ name: '', email: '', roleKey: 'teacher' })
  }

  return <div className="space-y-5 pb-24">
    {toast && <div className={`fixed bottom-6 right-6 z-50 rounded-xl px-4 py-3 text-xs font-semibold text-white shadow-xl ${toast.ok ? 'bg-teal-700' : 'bg-rose-700'}`}>{toast.text}</div>}
    <header><div className="flex items-center gap-2"><h1 className="font-display text-3xl font-bold text-slate-900">Phân quyền menu</h1><span className="rounded-full border border-teal-200 bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">Quản trị bảo mật</span></div><p className="mt-1 text-sm text-slate-500">Thiết lập quyền thao tác trên từng module cho tài khoản trong hệ thống bán trú.</p></header>
    <div className="grid items-start gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 p-4"><div><h2 className="text-sm font-bold">Tài khoản</h2><p className="text-xs text-slate-500">Chọn tài khoản để cấu hình quyền</p></div><button onClick={() => setAddOpen(true)} className="flex items-center gap-1 rounded-lg bg-teal-600 px-2.5 py-1.5 text-xs font-semibold text-white"><Plus size={13} /> Thêm mới</button></div>
        <div className="p-3"><div className="relative"><Search className="absolute left-3 top-2.5 text-slate-400" size={14} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm tên, username, vai trò..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-8 pr-3 text-xs outline-none focus:border-teal-500" /></div>
          <div className="mt-3 max-h-[590px] space-y-1 overflow-y-auto">{accounts.length === 0 && <p className="py-10 text-center text-xs text-slate-400">Chưa có tài khoản</p>}{accounts.length > 0 && filtered.length === 0 && <p className="py-10 text-center text-xs text-slate-400">Không tìm thấy tài khoản phù hợp</p>}
            {filtered.map((a) => <button key={a.id} onClick={() => selectAccount(a.id)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${selectedId === a.id ? 'border-teal-400 bg-teal-50' : 'border-transparent hover:border-slate-200 hover:bg-slate-50'}`}><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${selectedId === a.id ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{a.initials}</span><span className="min-w-0 flex-1"><b className="block truncate text-xs">{a.name}</b><span className="block truncate text-xs text-slate-500">{a.role}</span></span><ChevronRight size={14} className="text-slate-300" /></button>)}
          </div></div>
      </section>
      <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 xl:flex-row xl:items-center xl:justify-between"><div><h2 className="text-lg font-bold">{selected?.name || 'Chưa chọn tài khoản'}</h2><p className="text-xs text-slate-500">{selected ? `${enabledMenus} menu đang được thiết lập quyền` : 'Chọn một tài khoản ở danh sách bên trái'}</p></div>{selected && <div className="flex flex-wrap gap-1.5">{ACTIONS.map((a) => <span key={a.key} className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs">{a.label}: <b className="text-teal-700">{summary[a.key]}</b></span>)}</div>}</div>
        <div className="p-5">{!selected && <EmptyState />}{selected && error && <EmptyState error retry={() => selectAccount(selectedId)} />}{selected && loading && <div className="grid gap-3 sm:grid-cols-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-100" />)}</div>}
          {selected && !loading && !error && MENUS.length === 0 && <p className="py-16 text-center text-xs text-slate-400">Chưa có module để phân quyền</p>}
          {selected && !loading && !error && <div className="grid gap-3 sm:grid-cols-2">{MENUS.map((menu) => { const active = ACTIONS.some((a) => draft[menu.id]?.[a.key]); return <article key={menu.id} className={`rounded-xl border p-4 ${active ? 'border-teal-200 bg-teal-50/20' : 'border-slate-200'}`}><div className="flex justify-between"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wide text-slate-400">{menu.groupName}</p><h3 className="mt-1 text-sm font-bold">{menu.name}</h3><p className="truncate font-mono text-xs text-slate-400">{menu.id}</p></div>{active && <span className="mt-1 h-2 w-2 rounded-full bg-teal-500" />}</div><div className="mt-3 grid grid-cols-2 gap-1">{ACTIONS.map((action) => <PermissionCheck key={action.key} action={action} checked={Boolean(draft[menu.id]?.[action.key])} onChange={(e) => toggle(menu.id, action.key, e.target.checked)} />)}</div></article> })}</div>}
        </div>
      </section>
    </div>
    <div className="fixed bottom-0 right-0 z-20 flex w-full items-center justify-between border-t border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm lg:w-[calc(100%-16rem)] lg:px-8"><span className="text-xs text-slate-500">{dirty ? 'Bạn có thay đổi chưa được lưu' : selected ? 'Mọi thay đổi đã được lưu' : 'Chưa có tài khoản nào được chọn'}</span><button onClick={save} disabled={!selected || !dirty || saving} className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">{saving && <RefreshCw size={14} className="animate-spin" />}{saving ? 'Đang lưu...' : 'Lưu cập nhật'}</button></div>
    {addOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"><form onSubmit={addAccount} className="w-full max-w-md rounded-2xl bg-white shadow-xl"><div className="flex justify-between border-b p-5"><h3 className="font-bold">Thêm tài khoản mới</h3><button type="button" onClick={() => setAddOpen(false)}><X size={18} /></button></div><div className="space-y-4 p-5">{[['Họ và tên', 'name'], ['Email / username', 'email']].map(([label, key]) => <label key={key} className="block text-xs font-medium text-slate-600">{label}<input required type={key === 'email' ? 'email' : 'text'} value={newAccount[key]} onChange={(e) => setNewAccount({ ...newAccount, [key]: e.target.value })} className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500" /></label>)}<label className="block text-xs font-medium text-slate-600">Vai trò<select value={newAccount.roleKey} onChange={(e) => setNewAccount({ ...newAccount, roleKey: e.target.value })} className="mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"><option value="teacher">Giáo viên chủ nhiệm</option><option value="manager">Quản lý bán trú</option><option value="admin">Tài khoản hệ thống</option><option value="caterer">Đối tác cung cấp suất ăn</option></select></label></div><div className="flex justify-end gap-2 border-t p-5"><button type="button" onClick={() => setAddOpen(false)} className="rounded-xl border px-4 py-2 text-xs font-semibold">Hủy</button><button className="rounded-xl bg-teal-600 px-4 py-2 text-xs font-semibold text-white">Tạo tài khoản</button></div></form></div>}
  </div>
}
