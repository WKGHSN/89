'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Calendar, Users, BarChart3, Settings, LogOut, Plus, Search, ChevronRight, Clock, Upload, X, GripVertical, Pencil } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useBookingsStore } from '@/store/bookingsStore';
import { useDataStore } from '@/store/dataStore';
import { formatDate, formatPrice, getStatusLabel, getStatusBadgeClass, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Booking } from '@/types';

type AdminTab = 'dashboard' | 'bookings' | 'services' | 'masters' | 'gallery' | 'clients';

interface DashboardTabProps {
  allBookings: Booking[];
  todayBookings: Booking[];
  pendingCount: number;
  totalRevenue: number;
  updateStatus: (id: string, status: 'confirmed' | 'completed' | 'cancelled' | 'pending') => void;
}

interface BookingsTabProps {
  bookings: Booking[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  updateStatus: (id: string, status: 'confirmed' | 'completed' | 'cancelled' | 'pending') => void;
  cancelBooking: (id: string) => void;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const allBookings = useBookingsStore(s => s.bookings);
  const updateStatus = useBookingsStore(s => s.updateStatus);
  const cancelBooking = useBookingsStore(s => s.cancelBooking);
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && (!user || user.role !== 'admin')) {
      router.push('/auth/login');
    }
  }, [mounted, user, router]);

  if (!mounted) return <div className="min-h-screen bg-lumi-milk" />;
  if (!user || user.role !== 'admin') return <div className="min-h-screen bg-lumi-milk" />;

  const today = new Date().toISOString().split('T')[0];
  const todayBookings = allBookings.filter(b => b.date === today);
  const pendingCount = allBookings.filter(b => b.status === 'pending').length;
  const totalRevenue = allBookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.price, 0);

  const filteredBookings = allBookings.filter(b =>
    !searchQuery ||
    b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.masterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const navItems: { id: AdminTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Дашборд', icon: BarChart3 },
    { id: 'bookings', label: 'Записи', icon: Calendar, badge: pendingCount },
    { id: 'services', label: 'Послуги', icon: Settings },
    { id: 'masters', label: 'Майстри', icon: Users },
    { id: 'gallery', label: 'Галерея', icon: BarChart3 },
    { id: 'clients', label: 'Клієнти', icon: Users },
  ];

  return (
    <div className="bg-lumi-milk min-h-screen">
      <div className="bg-lumi-text text-white sticky top-0 z-40">
        <div className="page-container">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-lumi-rose flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <ellipse cx="12" cy="5" rx="2" ry="3.5" />
                  <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(60 12 12)" />
                  <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(120 12 12)" />
                  <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(180 12 12)" />
                  <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(240 12 12)" />
                  <ellipse cx="12" cy="5" rx="2" ry="3.5" transform="rotate(300 12 12)" />
                  <circle cx="12" cy="12" r="2.5" fill="white" />
                </svg>
              </div>
              <span className="font-serif text-white font-semibold">LumiBeauty</span>
              <span className="text-white/40 text-sm hidden sm:block">· Адмін-панель</span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-white/60 hover:text-white text-sm transition-colors hidden sm:block">Сайт ↗</Link>
              <button onClick={() => { logout(); router.push('/'); }} className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-3xl shadow-soft p-4">
              <nav className="flex flex-col gap-1">
                {navItems.map(item => (
                  <button key={item.id} onClick={() => setActiveTab(item.id)} className={cn('sidebar-nav-item text-left w-full', activeTab === item.id && 'active')}>
                    <item.icon className="w-4 h-4" />
                    {item.label}
                    {item.badge && item.badge > 0 && (
                      <span className="ml-auto text-xs bg-lumi-rose text-white rounded-full w-5 h-5 flex items-center justify-center">{item.badge}</span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {activeTab === 'dashboard' && <DashboardTab allBookings={allBookings} todayBookings={todayBookings} pendingCount={pendingCount} totalRevenue={totalRevenue} updateStatus={updateStatus} />}
            {activeTab === 'bookings' && <BookingsTab bookings={filteredBookings} searchQuery={searchQuery} setSearchQuery={setSearchQuery} updateStatus={updateStatus} cancelBooking={cancelBooking} />}
            {activeTab === 'services' && <ServicesTab />}
            {activeTab === 'masters' && <MastersTab />}
            {activeTab === 'gallery' && <GalleryTab />}
            {activeTab === 'clients' && <ClientsTab bookings={allBookings} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardTab({ allBookings, todayBookings, pendingCount, totalRevenue, updateStatus }: DashboardTabProps) {
  const categories = useDataStore(s => s.serviceCategories);
  const statsCards = [
    { label: 'Записів сьогодні', value: todayBookings.length, icon: Calendar, color: 'bg-blue-50 text-blue-600' },
    { label: 'Очікують підтвердження', value: pendingCount, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Всього записів', value: allBookings.length, icon: BarChart3, color: 'bg-lumi-blush/40 text-lumi-rose' },
    { label: 'Дохід (завершені)', value: formatPrice(totalRevenue), icon: ChevronRight, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-serif font-medium text-lumi-text text-2xl">Дашборд</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map(card => (
          <div key={card.label} className="bg-white rounded-2xl shadow-soft p-5">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', card.color)}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-xl font-bold text-lumi-text">{card.value}</p>
            <p className="text-xs text-lumi-muted mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-soft p-5">
        <h3 className="font-medium text-lumi-text mb-4">Записи на сьогодні ({todayBookings.length})</h3>
        {todayBookings.length === 0 ? (
          <p className="text-lumi-muted text-sm text-center py-4">Сьогодні записів немає</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr><th>Час</th><th>Клієнт</th><th>Послуга</th><th>Майстер</th><th>Статус</th><th>Дії</th></tr>
              </thead>
              <tbody>
                {todayBookings.map((b: Booking) => (
                  <tr key={b.id}>
                    <td className="font-medium">{b.time}</td>
                    <td>{b.clientName}</td>
                    <td className="text-lumi-muted">{b.serviceName}</td>
                    <td className="text-lumi-muted">{b.masterName}</td>
                    <td><span className={getStatusBadgeClass(b.status)}>{getStatusLabel(b.status)}</span></td>
                    <td>
                      {b.status === 'pending' && (
                        <button onClick={() => { updateStatus(b.id, 'confirmed'); toast.success('Підтверджено'); }} className="text-xs text-emerald-600 hover:text-emerald-800 font-medium">Підтвердити</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-soft p-5">
        <h3 className="font-medium text-lumi-text mb-4">Записи по категоріях</h3>
        <div className="space-y-3">
          {categories.map(cat => {
            const count = allBookings.filter((b: Booking) => b.categoryName === cat.name).length;
            const pct = allBookings.length > 0 ? Math.round((count / allBookings.length) * 100) : 0;
            return (
              <div key={cat.id} className="flex items-center gap-3">
                <span className="text-lg w-7">{cat.icon}</span>
                <span className="text-sm text-lumi-text w-32 flex-shrink-0">{cat.name}</span>
                <div className="flex-1 bg-lumi-cream rounded-full h-2">
                  <div className="h-full bg-lumi-rose rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-sm text-lumi-muted w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function BookingsTab({ bookings, searchQuery, setSearchQuery, updateStatus, cancelBooking }: BookingsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-medium text-lumi-text text-2xl">Всі записи</h2>
        <Link href="/booking" className="btn-primary text-sm"><Plus className="w-4 h-4" /> Новий запис</Link>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-lumi-muted" />
        <input className="input-field pl-11" placeholder="Пошук по клієнту, майстру, послузі..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
      </div>
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr><th>Дата/Час</th><th>Клієнт</th><th>Послуга</th><th>Майстер</th><th>Ціна</th><th>Статус</th><th>Дії</th></tr>
            </thead>
            <tbody>
              {bookings.map((b: Booking) => (
                <tr key={b.id}>
                  <td>
                    <p className="font-medium text-lumi-text">{b.time}</p>
                    <p className="text-xs text-lumi-muted">{formatDate(b.date)}</p>
                  </td>
                  <td>
                    <p className="font-medium">{b.clientName}</p>
                    <p className="text-xs text-lumi-muted">{b.clientPhone}</p>
                  </td>
                  <td className="text-lumi-muted">{b.serviceName}</td>
                  <td className="text-lumi-muted">{b.masterName}</td>
                  <td className="font-semibold">{formatPrice(b.price)}</td>
                  <td><span className={getStatusBadgeClass(b.status)}>{getStatusLabel(b.status)}</span></td>
                  <td>
                    <div className="flex gap-2">
                      {b.status === 'pending' && (
                        <button onClick={() => { updateStatus(b.id, 'confirmed'); toast.success('Підтверджено'); }} className="text-xs text-emerald-600 hover:text-emerald-800 font-medium">✓ Підтвердити</button>
                      )}
                      {b.status === 'confirmed' && (
                        <button onClick={() => { updateStatus(b.id, 'completed'); toast.success('Позначено як завершене'); }} className="text-xs text-blue-600 hover:text-blue-800 font-medium">✓ Завершити</button>
                      )}
                      {(b.status === 'pending' || b.status === 'confirmed') && (
                        <button onClick={() => { cancelBooking(b.id); toast.success('Скасовано'); }} className="text-xs text-red-400 hover:text-red-600 font-medium">✗ Скасувати</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {bookings.length === 0 && <p className="text-center text-lumi-muted py-10">Записів не знайдено</p>}
      </div>
    </div>
  );
}

function ServicesTab() {
  const { services: storeServices, addService, updateService, toggleServiceActive } = useDataStore();
  const categories = useDataStore(s => s.serviceCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ name: string; price: number; duration: number }>({ name: '', price: 0, duration: 0 });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '', duration: '', categoryId: categories[0]?.id || '', description: '' });

  const startEdit = (s: typeof storeServices[0]) => {
    setEditingId(s.id);
    setEditData({ name: s.name, price: s.price, duration: s.duration });
  };

  const saveEdit = (id: string) => {
    updateService(id, editData);
    setEditingId(null);
    toast.success('Послугу оновлено');
  };

  const handleAddService = () => {
    if (!newService.name || !newService.price) { toast.error('Заповніть назву та ціну'); return; }
    addService({
      categoryId: newService.categoryId,
      name: newService.name,
      description: newService.description,
      duration: parseInt(newService.duration) || 60,
      price: parseInt(newService.price) || 0,
      isActive: true,
    });
    setNewService({ name: '', price: '', duration: '', categoryId: categories[0]?.id || '', description: '' });
    setShowAddForm(false);
    toast.success('Послугу додано');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-medium text-lumi-text text-2xl">Послуги</h2>
        <button className="btn-primary text-sm" onClick={() => setShowAddForm(true)}><Plus className="w-4 h-4" /> Додати послугу</button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-soft p-5 border-2 border-lumi-blush">
          <h3 className="font-medium text-lumi-text mb-4">Нова послуга</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-lumi-muted block mb-1">Назва *</label>
              <input className="input-field" value={newService.name} onChange={e => setNewService(p => ({ ...p, name: e.target.value }))} placeholder="Назва послуги" />
            </div>
            <div>
              <label className="text-xs text-lumi-muted block mb-1">Категорія</label>
              <select className="input-field" value={newService.categoryId} onChange={e => setNewService(p => ({ ...p, categoryId: e.target.value }))}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-lumi-muted block mb-1">Ціна (грн) *</label>
              <input className="input-field" type="number" value={newService.price} onChange={e => setNewService(p => ({ ...p, price: e.target.value }))} placeholder="500" />
            </div>
            <div>
              <label className="text-xs text-lumi-muted block mb-1">Тривалість (хв)</label>
              <input className="input-field" type="number" value={newService.duration} onChange={e => setNewService(p => ({ ...p, duration: e.target.value }))} placeholder="60" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-lumi-muted block mb-1">Опис</label>
              <input className="input-field" value={newService.description} onChange={e => setNewService(p => ({ ...p, description: e.target.value }))} placeholder="Опис послуги..." />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAddService} className="btn-primary text-sm">Додати</button>
            <button onClick={() => setShowAddForm(false)} className="btn-outline text-sm">Скасувати</button>
          </div>
        </div>
      )}

      {categories.map(cat => {
        const catServices = storeServices.filter(s => s.categoryId === cat.id);
        return (
          <div key={cat.id} className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-lumi-border bg-lumi-milk">
              <span className="text-xl">{cat.icon}</span>
              <h3 className="font-medium text-lumi-text">{cat.name}</h3>
              <span className="text-xs text-lumi-muted ml-auto">{catServices.length} послуг</span>
            </div>
            <table className="admin-table">
              <tbody>
                {catServices.map(s => (
                  <tr key={s.id} className={!s.isActive ? 'opacity-50' : ''}>
                    <td>
                      {editingId === s.id
                        ? <input className="input-field text-xs py-1 px-2" value={editData.name} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} />
                        : <span className="font-medium text-lumi-text">{s.name}</span>}
                    </td>
                    <td>
                      {editingId === s.id
                        ? <input className="input-field text-xs py-1 px-2 w-20" type="number" value={editData.duration} onChange={e => setEditData(p => ({ ...p, duration: +e.target.value }))} />
                        : <span className="text-lumi-muted">{s.duration} хв</span>}
                    </td>
                    <td>
                      {editingId === s.id
                        ? <input className="input-field text-xs py-1 px-2 w-24" type="number" value={editData.price} onChange={e => setEditData(p => ({ ...p, price: +e.target.value }))} />
                        : <span className="font-semibold">{formatPrice(s.price)}</span>}
                    </td>
                    <td>
                      <span className={cn('badge', s.isActive ? 'badge-confirmed' : 'badge-cancelled')}>{s.isActive ? 'Активна' : 'Неактивна'}</span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {editingId === s.id ? (
                          <>
                            <button onClick={() => saveEdit(s.id)} className="text-xs text-emerald-600 font-medium">Зберегти</button>
                            <button onClick={() => setEditingId(null)} className="text-xs text-lumi-muted font-medium">Скасувати</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(s)} className="text-xs text-lumi-rose font-medium">Редагувати</button>
                            <button onClick={() => { toggleServiceActive(s.id); toast.success('Статус змінено'); }} className="text-xs text-lumi-muted font-medium">{s.isActive ? 'Вимкнути' : 'Увімкнути'}</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </div>
  );
}

function MastersTab() {
  const { masters: storeMasters, updateMaster, toggleMasterActive, updateMasterAvatar } = useDataStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBio, setEditBio] = useState('');
  const [editSpecs, setEditSpecs] = useState('');
  const [editName, setEditName] = useState('');
  const [editExp, setEditExp] = useState<number>(0);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  const startEdit = (m: typeof storeMasters[0]) => {
    setEditingId(m.id);
    setEditBio(m.bio);
    setEditSpecs(m.specializations.join(', '));
    setEditName(m.name);
    setEditExp(m.experience);
  };

  const saveEdit = (id: string) => {
    updateMaster(id, {
      bio: editBio,
      specializations: editSpecs.split(',').map(s => s.trim()).filter(Boolean),
      name: editName,
      experience: editExp,
    });
    setEditingId(null);
    toast.success('Профіль оновлено');
  };

  const handleAvatarUpload = (masterId: string, file: File) => {
    if (!file.type.startsWith('image/')) { toast.error('Оберіть файл зображення'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Файл занадто великий (максимум 5 МБ)'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 400;
        let { width, height } = img;
        if (width > height) { if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; } }
        else { if (height > MAX) { width = Math.round(width * MAX / height); height = MAX; } }
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        updateMasterAvatar(masterId, canvas.toDataURL('image/webp', 0.85));
        toast.success('Аватар оновлено');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-medium text-lumi-text text-2xl">Майстри</h2>
        <button className="btn-outline text-sm" onClick={() => toast('Для додавання майстра зверніться до розробника')}><Plus className="w-4 h-4" /> Додати майстра</button>
      </div>
      <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={e => {
        if (uploadingFor && e.target.files?.[0]) handleAvatarUpload(uploadingFor, e.target.files[0]);
        e.target.value = '';
      }} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {storeMasters.map(master => (
          <div key={master.id} className={cn('bg-white rounded-2xl shadow-soft p-5', !master.isActive && 'opacity-60')}>
            <div className="flex gap-4 mb-3">
              <div className="relative group flex-shrink-0">
                <Image src={master.avatar} alt={master.name} width={64} height={64} className="rounded-2xl object-cover" />
                <button onClick={() => { setUploadingFor(master.id); avatarInputRef.current?.click(); }} className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-5 h-5 text-white" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {editingId === master.id
                      ? <input className="input-field text-sm py-1 px-2 mb-1" value={editName} onChange={e => setEditName(e.target.value)} />
                      : <p className="font-medium text-lumi-text">{master.name}</p>}
                    {editingId === master.id ? (
                      <div className="flex items-center gap-1 mt-1">
                        <input className="input-field text-xs py-1 px-2 w-16" type="number" value={editExp} onChange={e => setEditExp(+e.target.value)} />
                        <span className="text-xs text-lumi-muted">р. досвіду</span>
                      </div>
                    ) : (
                      <p className="text-xs text-lumi-muted mt-0.5">{master.experience} р. досвіду · {master.reviewsCount} відгуків</p>
                    )}
                  </div>
                  <span className={cn('badge flex-shrink-0', master.isActive ? 'badge-confirmed' : 'badge-cancelled')}>{master.isActive ? 'Активний' : 'Неактивний'}</span>
                </div>
              </div>
            </div>
            {editingId === master.id ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-lumi-muted block mb-1">Спеціалізація (через кому)</label>
                  <input className="input-field text-sm" value={editSpecs} onChange={e => setEditSpecs(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-lumi-muted block mb-1">Біографія</label>
                  <textarea className="input-field text-sm resize-none" rows={3} value={editBio} onChange={e => setEditBio(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => saveEdit(master.id)} className="btn-primary text-xs py-2">Зберегти</button>
                  <button onClick={() => setEditingId(null)} className="btn-outline text-xs py-2">Скасувати</button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-lumi-muted line-clamp-2 mb-3">{master.bio}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {master.specializations.map(s => (
                    <span key={s} className="text-xs bg-lumi-blush/20 text-lumi-rose rounded-full px-2 py-0.5">{s}</span>
                  ))}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => startEdit(master)} className="text-xs text-lumi-rose font-medium"><Pencil className="w-3 h-3 inline mr-1" />Редагувати</button>
                  <button onClick={() => { setUploadingFor(master.id); avatarInputRef.current?.click(); }} className="text-xs text-blue-500 font-medium"><Upload className="w-3 h-3 inline mr-1" />Фото</button>
                  <button onClick={() => { toggleMasterActive(master.id); toast.success('Статус змінено'); }} className="text-xs text-lumi-muted font-medium">{master.isActive ? 'Деактивувати' : 'Активувати'}</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function GalleryTab() {
  const { gallery, addGalleryItem, removeGalleryItem, updateGalleryItem, reorderGallery, masters: storeMasters } = useDataStore();
  const categories = useDataStore(s => s.serviceCategories);
  const [showUpload, setShowUpload] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [editMaster, setEditMaster] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newPhoto, setNewPhoto] = useState({
    imageUrl: '',
    description: '',
    masterName: '',
    categoryId: categories[0]?.id || '',
  });

  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) { reject('Не є зображенням'); return; }
      if (file.size > 10 * 1024 * 1024) { reject('Файл занадто великий (максимум 10 МБ)'); return; }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX = 1200;
          let { width, height } = img;
          if (width > MAX || height > MAX) {
            if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
            else { width = Math.round(width * MAX / height); height = MAX; }
          }
          canvas.width = width; canvas.height = height;
          canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/webp', 0.85));
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    try {
      const dataUrl = await processImageFile(files[0]);
      setNewPhoto(p => ({ ...p, imageUrl: dataUrl }));
    } catch (err) {
      toast.error(typeof err === 'string' ? err : 'Помилка обробки файлу');
    }
  };

  const handleAddPhoto = () => {
    if (!newPhoto.imageUrl) { toast.error('Оберіть фото'); return; }
    const cat = categories.find(c => c.id === newPhoto.categoryId)!;
    addGalleryItem({
      imageUrl: newPhoto.imageUrl,
      categoryId: newPhoto.categoryId,
      categoryName: cat.name,
      masterName: newPhoto.masterName || undefined,
      description: newPhoto.description,
    });
    setNewPhoto({ imageUrl: '', description: '', masterName: '', categoryId: categories[0]?.id || '' });
    setShowUpload(false);
    toast.success('Фото додано до галереї');
  };

  const handleDragStart = (id: string) => setDragId(id);
  const handleDragEnd = () => {
    if (dragId && dragOverId && dragId !== dragOverId) {
      const items = [...gallery];
      const fromIdx = items.findIndex(g => g.id === dragId);
      const toIdx = items.findIndex(g => g.id === dragOverId);
      const [moved] = items.splice(fromIdx, 1);
      items.splice(toIdx, 0, moved);
      reorderGallery(items);
    }
    setDragId(null);
    setDragOverId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif font-medium text-lumi-text text-2xl">Галерея ({gallery.length} фото)</h2>
        <button className="btn-primary text-sm" onClick={() => setShowUpload(!showUpload)}><Upload className="w-4 h-4" /> Завантажити фото</button>
      </div>

      {showUpload && (
        <div className="bg-white rounded-2xl shadow-soft p-5 border-2 border-lumi-blush">
          <h3 className="font-medium text-lumi-text mb-4">Нове фото</h3>
          {!newPhoto.imageUrl ? (
            <div
              className={cn('border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors mb-4',
                dragOver ? 'border-lumi-rose bg-lumi-blush/20' : 'border-lumi-border hover:border-lumi-rose hover:bg-lumi-milk'
              )}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={async e => { e.preventDefault(); setDragOver(false); await handleFileSelect(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
            >
              <p className="text-lumi-muted text-sm">Перетягніть фото або <span className="text-lumi-rose font-medium">оберіть файл</span></p>
              <p className="text-xs text-lumi-muted mt-1">JPEG, PNG, WebP · Максимум 10 МБ</p>
            </div>
          ) : (
            <div className="relative mb-4 inline-block">
              <Image src={newPhoto.imageUrl} alt="preview" width={160} height={160} className="object-cover rounded-2xl" />
              <button onClick={() => setNewPhoto(p => ({ ...p, imageUrl: '' }))} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileSelect(e.target.files)} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-lumi-muted block mb-1">Категорія</label>
              <select className="input-field" value={newPhoto.categoryId} onChange={e => setNewPhoto(p => ({ ...p, categoryId: e.target.value }))}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-lumi-muted block mb-1">Майстер</label>
              <select className="input-field" value={newPhoto.masterName} onChange={e => setNewPhoto(p => ({ ...p, masterName: e.target.value }))}>
                <option value="">— Оберіть майстра —</option>
                {storeMasters.filter(m => m.isActive).map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs text-lumi-muted block mb-1">Опис фото</label>
              <input className="input-field" placeholder="Наприклад: Французький манікюр" value={newPhoto.description} onChange={e => setNewPhoto(p => ({ ...p, description: e.target.value }))} />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAddPhoto} className="btn-primary text-sm">Опублікувати</button>
            <button onClick={() => { setShowUpload(false); setNewPhoto({ imageUrl: '', description: '', masterName: '', categoryId: categories[0]?.id || '' }); }} className="btn-outline text-sm">Скасувати</button>
          </div>
        </div>
      )}

      <p className="text-xs text-lumi-muted">Перетягніть картки для зміни порядку в галереї</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map(photo => (
          <div
            key={photo.id}
            draggable
            onDragStart={() => handleDragStart(photo.id)}
            onDragOver={e => { e.preventDefault(); setDragOverId(photo.id); }}
            onDragEnd={handleDragEnd}
            className={cn('group relative bg-white rounded-2xl shadow-soft overflow-hidden cursor-grab active:cursor-grabbing transition-all',
              dragOverId === photo.id && dragId !== photo.id && 'ring-2 ring-lumi-rose'
            )}
          >
            <div className="absolute top-2 left-2 z-10 w-6 h-6 bg-white/80 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <GripVertical className="w-3 h-3 text-lumi-muted" />
            </div>
            <div className="aspect-square overflow-hidden">
              <img src={photo.imageUrl} alt={photo.description || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="p-3">
              {editingId === photo.id ? (
                <div className="space-y-2">
                  <input className="input-field text-xs py-1 px-2" value={editDesc} onChange={e => setEditDesc(e.target.value)} placeholder="Опис..." autoFocus />
                  <select className="input-field text-xs py-1 px-2" value={editMaster} onChange={e => setEditMaster(e.target.value)}>
                    <option value="">— Майстер —</option>
                    {storeMasters.filter(m => m.isActive).map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                  </select>
                  <div className="flex gap-1">
                    <button onClick={() => { updateGalleryItem(photo.id, { description: editDesc, masterName: editMaster || undefined }); setEditingId(null); toast.success('Опис оновлено'); }} className="text-xs text-emerald-600 font-medium">Зберегти</button>
                    <button onClick={() => setEditingId(null)} className="text-xs text-lumi-muted font-medium">✕</button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-xs bg-lumi-cream text-lumi-muted rounded-full px-2 py-0.5">{photo.categoryName}</span>
                  <p className="text-xs text-lumi-muted mt-1 truncate">{photo.description || '—'}</p>
                  {photo.masterName && <p className="text-xs text-lumi-rose mt-0.5 truncate">👩‍🎨 {photo.masterName}</p>}
                </>
              )}
            </div>
            {editingId !== photo.id && (
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditingId(photo.id); setEditDesc(photo.description || ''); setEditMaster(photo.masterName || ''); }} className="w-7 h-7 bg-white text-lumi-rose rounded-full flex items-center justify-center shadow-soft">
                  <Pencil className="w-3 h-3" />
                </button>
                <button onClick={() => { removeGalleryItem(photo.id); toast.success('Фото видалено'); }} className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {gallery.length === 0 && (
        <div className="text-center py-16 text-lumi-muted"><p>Галерея порожня. Завантажте перше фото!</p></div>
      )}
    </div>
  );
}

function ClientsTab({ bookings }: { bookings: Booking[] }) {
  const uniqueClients = Array.from(
    new Map(bookings.map(b => [b.clientId, { id: b.clientId, name: b.clientName, phone: b.clientPhone }])).values()
  );
  return (
    <div className="space-y-4">
      <h2 className="font-serif font-medium text-lumi-text text-2xl">Клієнти ({uniqueClients.length})</h2>
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <table className="admin-table">
          <thead><tr><th>Клієнт</th><th>Телефон</th><th>Записів</th><th>Витрачено</th></tr></thead>
          <tbody>
            {uniqueClients.map(client => {
              const clientBookings = bookings.filter(b => b.clientId === client.id);
              const spent = clientBookings.filter(b => b.status === 'completed').reduce((s, b) => s + b.price, 0);
              return (
                <tr key={client.id}>
                  <td className="font-medium text-lumi-text">{client.name}</td>
                  <td className="text-lumi-muted">{client.phone}</td>
                  <td>{clientBookings.length}</td>
                  <td className="font-semibold">{formatPrice(spent)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
