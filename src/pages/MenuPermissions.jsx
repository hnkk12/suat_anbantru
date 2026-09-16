import { useMemo, useState } from 'react'
import { AlertCircle, Check, ChevronRight, Eye, Pencil, Plus, RefreshCw, Search, ShieldCheck, Trash2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLocalStorageState } from '../context/useLocalStorageState'
import Button from '../components/ui/Button'


const ACTIONS = [
  { key: 'view', label: 'Xem', icon: Eye },
  { key: 'create', label: 'Thêm mới', icon: Plus },
  { key: 'update', label: 'Cập nhật', icon: Pencil },
  { key: 'delete', label: 'Xóa', icon: Trash2 },
]

const GROUPS = [
  {
    id: 'admin',
    name: 'Quản lý bán trú',
    children: [
      ['/nguoi-phu-trach', 'Người phụ trách'],
      ['/cong-ty-suat-an', 'Công ty cung cấp suất ăn'],
      ['/thuc-don', 'Thực đơn'],
      ['/hoc-sinh', 'Học sinh'],
      ['/danh-gia-hoc-sinh', 'Đánh giá học sinh'],
    ],
  },
  {
    id: 'utilities',
    name: 'Lối tắt & Tiện ích',
    children: [
      ['/', 'Tổng quan hệ thống'],
      ['/bieu-mau-3-buoc', 'Biểu mẫu 3 bước'],
      ['/bao-cao', 'Báo cáo thống kê'],
      ['/van-ban-lien-quan', 'Văn bản liên quan'],
      ['/cai-dat', 'Cài đặt'],
    ],
  },
]

const MENUS = GROUPS.flatMap((group) => group.children.map(([id, name]) => ({ id, name, groupName: group.name })))
const EMPTY = { view: false, create: false, update: false, delete: false }

function defaults(role) {
  const allowed =
    role === 'admin' || role === 'manager'
      ? MENUS.map((m) => m.id)
      : role === 'teacher'
      ? ['/', '/hoc-sinh', '/danh-gia-hoc-sinh', '/thuc-don']
      : ['/', '/thuc-don', '/van-ban-lien-quan']
  return Object.fromEntries(
    MENUS.map((menu) => [
      menu.id,
      {
        view: allowed.includes(menu.id),
        create: role === 'admin' && allowed.includes(menu.id),
        update: ['admin', 'manager'].includes(role) && allowed.includes(menu.id),
        delete: role === 'admin' && allowed.includes(menu.id),
      },
    ])
  )
}

function normalize(map, accounts) {
  return Object.fromEntries(
    accounts.map((account) => {
      const saved = map?.[account.id]
      if (Array.isArray(saved)) {
        return [account.id, Object.fromEntries(MENUS.map((m) => [m.id, { ...EMPTY, view: saved.includes(m.id) }]))]
      }
      if (saved && typeof saved === 'object') {
        return [account.id, Object.fromEntries(MENUS.map((m) => [m.id, { ...EMPTY, ...saved[m.id] }]))]
      }
      return [account.id, defaults(account.roleKey)]
    })
  )
}

const same = (a, b) => JSON.stringify(a || {}) === JSON.stringify(b || {})

function PermissionCheck({ action, checked, onChange }) {
  const Icon = action.icon
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-[8px] px-2 py-1.5 text-[12px] font-medium text-[#57605a] hover:bg-[#fafaf8]">
      <input className="sr-only" type="checkbox" checked={checked} onChange={onChange} />
      <span
        className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
          checked ? 'border-[#c84b26] bg-[#c84b26] text-white' : 'border-[#d5d7d0] bg-white'
        }`}
      >
        {checked && <Check size={11} strokeWidth={3} />}
      </span>
      <Icon size={13} className={checked ? 'text-[#c84b26]' : 'text-[#9a9d96]'} />
      {action.label}
    </label>
  )
}

function EmptyState({ error, retry }) {
  return (
    <div
      className={`flex min-h-64 flex-col items-center justify-center rounded-[16px] border border-dashed p-6 text-center ${
        error ? 'border-rose-200 bg-rose-50/40' : 'border-[#dcdedb] bg-[#fafaf8]'
      }`}
    >
      {error ? <AlertCircle size={25} className="text-rose-500" /> : <ShieldCheck size={25} className="text-[#9a9d96]" />}
      <h3 className="mt-3 text-[14px] font-semibold text-[#1c1d1b]">
        {error ? 'Không thể tải dữ liệu' : 'Chọn tài khoản để phân quyền'}
      </h3>
      <p className="mt-1 text-[12.5px] text-[#6b6f68]">
        {error ? 'Đã xảy ra lỗi khi tải thông tin phân quyền.' : 'Chọn một tài khoản ở danh sách bên trái.'}
      </p>
      {error && (
        <button
          onClick={retry}
          className="mt-3 rounded-[8px] border border-rose-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-rose-700"
        >
          Thử lại
        </button>
      )}
    </div>
  )
}

export default function MenuPermissions() {
  const { teachers, managerInfo } = useApp()
  const initialAccounts = useMemo(
    () => [
      {
        id: 'acc-admin',
        name: 'Admin',
        username: 'admin',
        role: 'Quản trị viên hệ thống',
        roleKey: 'admin',
        email: 'admin@truongtest.edu.vn',
        initials: 'AD',
      },
      {
        id: 'acc-manager',
        name: managerInfo?.hoTen || 'Đỗ Thị Thanh Tâm',
        username: managerInfo?.email || 'tam.do@truongtest.edu.vn',
        role: managerInfo?.chucVu || 'Quản lý bán trú',
        roleKey: 'manager',
        email: managerInfo?.email,
        initials: 'TT',
      },
      ...teachers.map((t) => ({
        id: `acc-t-${t.id}`,
        name: t.hoTen,
        username: t.email,
        role: `Giáo viên chủ nhiệm (${t.lop || '—'})`,
        roleKey: 'teacher',
        email: t.email,
        initials: t.hoTen.split(' ').at(-1)?.slice(0, 2).toUpperCase() || 'GV',
      })),
      {
        id: 'acc-caterer',
        name: 'Công ty TNHH Suất ăn An Lành',
        username: 'anlanh.catering',
        role: 'Đối tác cung cấp suất ăn',
        roleKey: 'caterer',
        email: 'anlanh.catering@gmail.com',
        initials: 'AL',
      },
    ],
    [teachers, managerInfo]
  )

  const [accounts, setAccounts] = useLocalStorageState('app_accounts_list', initialAccounts)
  const [stored, setStored] = useLocalStorageState('menu_permissions_map', {})
  const permissionMap = useMemo(() => normalize(stored, accounts), [stored, accounts])
  const [selectedId, setSelectedId] = useState('acc-admin')
  const [draft, setDraft] = useState(() => structuredClone(permissionMap['acc-admin'] || {}))
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
    return accounts.filter(
      (a) => !term || [a.name, a.username, a.email, a.role].join(' ').toLocaleLowerCase('vi').includes(term)
    )
  }, [accounts, query])

  const summary = useMemo(
    () => Object.fromEntries(ACTIONS.map((a) => [a.key, MENUS.filter((m) => draft[m.id]?.[a.key]).length])),
    [draft]
  )

  function selectAccount(id) {
    if (dirty && !window.confirm('Bạn có thay đổi chưa được lưu.\nTiếp tục chuyển tài khoản?')) return
    setSelectedId(id)
    setLoading(true)
    setError(false)
    setTimeout(() => {
      try {
        setDraft(structuredClone(permissionMap[id] || {}))
        setLoading(false)
      } catch {
        setLoading(false)
        setError(true)
      }
    }, 120)
  }

  function toggle(menuId, action, checked) {
    setDraft((current) => {
      const next = { ...current, [menuId]: { ...EMPTY, ...current[menuId] } }
      if (action === 'view' && !checked) next[menuId] = { ...EMPTY }
      else {
        next[menuId][action] = checked
        if (action !== 'view' && checked) next[menuId].view = true
      }
      return next
    })
  }

  function save() {
    if (!dirty) return
    setSaving(true)
    setTimeout(() => {
      try {
        setStored((current) => ({ ...normalize(current, accounts), [selectedId]: draft }))
        setSaving(false)
        setToast({ ok: true, text: 'Cập nhật phân quyền thành công' })
        setTimeout(() => setToast(null), 3000)
      } catch {
        setSaving(false)
        setToast({ ok: false, text: 'Không thể cập nhật phân quyền.' })
      }
    }, 250)
  }

  function addAccount(e) {
    e.preventDefault()
    const name = newAccount.name.trim()
    if (!name) return
    const id = `acc-${Date.now()}`
    const roles = {
      admin: 'Quản trị viên hệ thống',
      manager: 'Quản lý bán trú',
      teacher: 'Giáo viên chủ nhiệm',
      caterer: 'Đối tác cung cấp suất ăn',
    }
    const acc = {
      id,
      name,
      username: newAccount.email,
      email: newAccount.email,
      roleKey: newAccount.roleKey,
      role: roles[newAccount.roleKey],
      initials: name.split(' ').at(-1)?.slice(0, 2).toUpperCase() || 'TK',
    }
    setAccounts((prev) => [acc, ...prev])
    setStored((prev) => ({ ...normalize(prev, accounts), [id]: defaults(acc.roleKey) }))
    setSelectedId(id)
    setDraft(defaults(acc.roleKey))
    setAddOpen(false)
    setNewAccount({ name: '', email: '', roleKey: 'teacher' })
  }

  return (
    <div className="flex flex-col gap-5.5 pb-24">
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-[12px] px-4 py-3 text-[13px] font-medium text-white shadow-xl ${
            toast.ok ? 'bg-[#c84b26]' : 'bg-rose-700'
          }`}
        >
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#1c1d1b]">
            Phân quyền menu
          </h1>
          <span className="rounded-[6px] bg-[#fdf2ee] px-2 py-0.5 text-[11.5px] font-semibold text-[#c84b26]">
            Bảo mật
          </span>
        </div>
        <p className="mt-1.5 max-w-[480px] text-[13.5px] leading-relaxed text-[#6b6f68]">
          Thiết lập quyền xem, thêm, sửa, xóa trên từng module của hệ thống.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Left: Accounts List */}
        <section className="overflow-hidden rounded-[16px] border border-[#e3e4df] bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-[#eceeea] p-4">
            <div>
              <h2 className="text-[14px] font-semibold text-[#1c1d1b]">Tài khoản</h2>
              <p className="text-[11.5px] text-[#9a9d96]">Chọn để cấu hình</p>
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-1 rounded-[8px] bg-[#c84b26] px-2.5 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#b03816] cursor-pointer"
            >
              <Plus size={13} /> Thêm
            </button>
          </div>
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-[#9a9d96]" size={14} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm tài khoản..."
                className="w-full rounded-[10px] border border-[#d5d7d0] bg-[#fafaf8] py-2 pl-8 pr-3 text-[12.5px] outline-none focus:border-[#c84b26]"
              />
            </div>
            <div className="mt-3 max-h-[520px] space-y-1 overflow-y-auto pr-1">
              {filtered.map((a) => {
                const isSelected = selectedId === a.id
                return (
                  <button
                    key={a.id}
                    onClick={() => selectAccount(a.id)}
                    className={`flex w-full items-center gap-2.5 rounded-[10px] border p-2.5 text-left transition-colors ${
                      isSelected
                        ? 'border-[#c84b26] bg-[#fdf2ee]'
                        : 'border-transparent hover:border-[#e3e4df] hover:bg-[#fafaf8]'
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-[11px] font-bold ${
                        isSelected ? 'bg-[#c84b26] text-white' : 'border border-[#e3e4df] bg-[#f0f1ec] text-[#5d605a]'
                      }`}
                    >
                      {a.initials}
                    </span>
                    <span className="min-w-0 flex-1">
                      <b className={`block truncate text-[12.5px] ${isSelected ? 'text-[#c84b26]' : 'text-[#1c1d1b]'}`}>
                        {a.name}
                      </b>
                      <span className="block truncate text-[11.5px] text-[#6b6f68]">{a.role}</span>
                    </span>
                    <ChevronRight
                      size={14}
                      className={isSelected ? 'text-[#c84b26]' : 'text-[#9a9d96]'}
                    />
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Right: Modules Matrix */}
        <section className="min-w-0 overflow-hidden rounded-[16px] border border-[#e3e4df] bg-white shadow-xs">
          <div className="flex flex-col gap-3 border-b border-[#eceeea] p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-[16px] font-semibold text-[#1c1d1b]">
                {selected?.name || 'Chưa chọn tài khoản'}
              </h2>
              <p className="text-[12px] text-[#9a9d96]">
                {selected ? `${selected.role} · ${selected.email || selected.username}` : 'Chọn tài khoản để phân quyền'}
              </p>
            </div>
            {selected && (
              <div className="flex flex-wrap gap-1.5">
                {ACTIONS.map((a) => (
                  <span
                    key={a.key}
                    className="rounded-[6px] border border-[#e3e4df] bg-[#fafaf8] px-2 py-0.5 text-[11.5px] text-[#57605a]"
                  >
                    {a.label}: <b className="text-[#c84b26]">{summary[a.key]}</b>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-5">
            {!selected && <EmptyState />}
            {selected && error && <EmptyState error retry={() => selectAccount(selectedId)} />}
            {selected && loading && (
              <div className="grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-28 animate-pulse rounded-[12px] bg-[#fafaf8]" />
                ))}
              </div>
            )}
            {selected && !loading && !error && (
              <div className="grid gap-3 sm:grid-cols-2">
                {MENUS.map((menu) => {
                  const active = ACTIONS.some((a) => draft[menu.id]?.[a.key])
                  return (
                    <div
                      key={menu.id}
                      className={`rounded-[12px] border p-3.5 transition-colors ${
                        active ? 'border-[#c84b26]/30 bg-[#fdf2ee]/20' : 'border-[#e3e4df] bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <p className="text-[10.5px] font-semibold uppercase tracking-[0.03em] text-[#9a9d96]">
                            {menu.groupName}
                          </p>
                          <h3 className="mt-0.5 text-[13.5px] font-semibold text-[#1c1d1b]">{menu.name}</h3>
                          <p className="font-mono text-[11px] text-[#9a9d96]">{menu.id}</p>
                        </div>
                        {active && <span className="mt-1 h-2 w-2 rounded-full bg-[#c84b26]" />}
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-1 border-t border-[#f1f2ee] pt-2">
                        {ACTIONS.map((action) => (
                          <PermissionCheck
                            key={action.key}
                            action={action}
                            checked={Boolean(draft[menu.id]?.[action.key])}
                            onChange={(e) => toggle(menu.id, action.key, e.target.checked)}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Sticky Bottom Save Bar */}
      <div className="fixed bottom-0 right-0 z-20 flex w-full items-center justify-between border-t border-[#eceeea] bg-white/95 px-6 py-3 shadow-lg backdrop-blur-xs lg:w-[calc(100%-264px)]">
        <span className="text-[12.5px] text-[#6b6f68]">
          {dirty ? 'Bạn có thay đổi phân quyền chưa lưu' : 'Mọi thay đổi đã được cập nhật'}
        </span>
        <Button onClick={save} disabled={!selected || !dirty || saving} size="sm">
          {saving && <RefreshCw size={13} className="animate-spin" />}
          {saving ? 'Đang lưu...' : 'Lưu cập nhật'}
        </Button>
      </div>

      {/* Add Account Modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-xs">
          <form
            onSubmit={addAccount}
            className="w-full max-w-md overflow-hidden rounded-[16px] border border-[#e3e4df] bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-[#eceeea] px-6 py-4">
              <h3 className="text-[15px] font-semibold text-[#1c1d1b]">Thêm tài khoản mới</h3>
              <button
                type="button"
                onClick={() => setAddOpen(false)}
                className="rounded-[6px] p-1 text-[#8a8d86] hover:bg-[#f2f3ee]"
              >
                <X size={17} />
              </button>
            </div>
            <div className="space-y-4 p-6">
              <label className="block text-[12px] font-semibold text-[#57605a]">
                Họ và tên *
                <input
                  required
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  placeholder="Ví dụ: Hoàng Văn An"
                  className="mt-1 block w-full rounded-[10px] border border-[#d5d7d0] px-3 py-2 text-[13px] outline-none focus:border-[#c84b26]"
                />
              </label>
              <label className="block text-[12px] font-semibold text-[#57605a]">
                Email / Tên đăng nhập *
                <input
                  required
                  type="email"
                  value={newAccount.email}
                  onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                  placeholder="an.hoang@truongtest.edu.vn"
                  className="mt-1 block w-full rounded-[10px] border border-[#d5d7d0] px-3 py-2 text-[13px] outline-none focus:border-[#c84b26]"
                />
              </label>
              <label className="block text-[12px] font-semibold text-[#57605a]">
                Vai trò
                <select
                  value={newAccount.roleKey}
                  onChange={(e) => setNewAccount({ ...newAccount, roleKey: e.target.value })}
                  className="mt-1 block w-full rounded-[10px] border border-[#d5d7d0] bg-white px-3 py-2 text-[13px] outline-none"
                >
                  <option value="teacher">Giáo viên chủ nhiệm</option>
                  <option value="manager">Quản lý bán trú</option>
                  <option value="admin">Quản trị viên hệ thống</option>
                  <option value="caterer">Đối tác cung cấp suất ăn</option>
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-2.5 border-t border-[#eceeea] bg-[#fafaf8] px-6 py-3.5">
              <Button variant="neutral" onClick={() => setAddOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">Tạo tài khoản</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
