import type { ServiceCategory, Service, Master, Review, GalleryItem, ContactInfo, Booking } from '@/types';

function gdriveDirectUrl(fileId: string): string {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'manicure',
    name: 'Манікюр',
    slug: 'manicure',
    icon: '💅',
    description: 'Класичний та апаратний манікюр, покриття гель-лаком, nail-art',
    image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800',
    order: 1,
  },
  {
    id: 'pedicure',
    name: 'Педикюр',
    slug: 'pedicure',
    icon: '🦶',
    description: 'Класичний та апаратний педикюр, SPA-педикюр',
    image: 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=800',
    order: 2,
  },
  {
    id: 'eyebrows',
    name: 'Брови',
    slug: 'eyebrows',
    icon: '✨',
    description: 'Архітектура брів, фарбування, ламінування, перманентний макіяж',
    image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=800',
    order: 3,
  },
  {
    id: 'lashes',
    name: 'Вії',
    slug: 'lashes',
    icon: '👁️',
    description: 'Нарощування вій, ламінування, ботокс для вій',
    image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=800',
    order: 4,
  },
  {
    id: 'haircare',
    name: 'Стрижки та укладки',
    slug: 'haircare',
    icon: '✂️',
    description: 'Жіночі та чоловічі стрижки, фарбування, укладання',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
    order: 5,
  },
];

export const services: Service[] = [
  { id: 'man-1', categoryId: 'manicure', name: 'Класичний манікюр', description: 'Обробка кутикули, надання форми нігтям, полірування', duration: 60, price: 400, isActive: true },
  { id: 'man-2', categoryId: 'manicure', name: 'Манікюр + Гель-лак', description: 'Класичний манікюр із покриттям гель-лаком', duration: 90, price: 600, isActive: true },
  { id: 'man-3', categoryId: 'manicure', name: 'Манікюр + Френч', description: 'Класичний манікюр з класичним французьким покриттям', duration: 90, price: 550, isActive: true },
  { id: 'man-4', categoryId: 'manicure', name: 'Манікюр + Дизайн', description: 'Манікюр з художнім дизайном та декором', duration: 120, price: 650, isActive: true },
  { id: 'man-5', categoryId: 'manicure', name: 'Апаратний манікюр', description: 'Безпечна апаратна обробка кутикули та нігтів', duration: 75, price: 480, isActive: true },
  { id: 'man-6', categoryId: 'manicure', name: 'Зміна покриття', description: 'Зняття старого покриття та нанесення нового', duration: 60, price: 350, isActive: true },

  { id: 'ped-1', categoryId: 'pedicure', name: 'Класичний педикюр', description: 'Обробка стоп, нігтів, видалення мозолів', duration: 90, price: 500, isActive: true },
  { id: 'ped-2', categoryId: 'pedicure', name: 'Педикюр + Гель-лак', description: 'Класичний педикюр із покриттям гель-лаком', duration: 120, price: 700, isActive: true },
  { id: 'ped-3', categoryId: 'pedicure', name: 'SPA-педикюр', description: 'Розслаблюючий педикюр з парафінотерапією та масажем', duration: 150, price: 900, isActive: true },
  { id: 'ped-4', categoryId: 'pedicure', name: 'Апаратний педикюр', description: 'Апаратна обробка нігтів та стоп', duration: 90, price: 550, isActive: true },

  { id: 'brow-1', categoryId: 'eyebrows', name: 'Корекція брів', description: 'Надання форми брівам воском або ниткою', duration: 30, price: 200, isActive: true },
  { id: 'brow-2', categoryId: 'eyebrows', name: 'Фарбування брів', description: 'Фарбування брів хною або фарбою', duration: 45, price: 300, isActive: true },
  { id: 'brow-3', categoryId: 'eyebrows', name: 'Архітектура брів', description: 'Повна обробка: форма + фарбування + укладання', duration: 60, price: 450, isActive: true },
  { id: 'brow-4', categoryId: 'eyebrows', name: 'Ламінування брів', description: 'Ламінування для зміцнення та укладання брів', duration: 60, price: 600, isActive: true },
  { id: 'brow-5', categoryId: 'eyebrows', name: 'Перманентний макіяж брів', description: 'Нанесення пігменту технікою пудрових брів', duration: 180, price: 2500, isActive: true },

  { id: 'lash-1', categoryId: 'lashes', name: 'Нарощування (класика)', description: 'Класичне нарощування — по одній вії на кожну', duration: 120, price: 800, isActive: true },
  { id: 'lash-2', categoryId: 'lashes', name: 'Нарощування (2D-3D)', description: 'Об\'ємне нарощування для вираженого ефекту', duration: 150, price: 1100, isActive: true },
  { id: 'lash-3', categoryId: 'lashes', name: 'Нарощування (Мегаоб\'єм)', description: 'Мегаоб\'ємне нарощування для максимального ефекту', duration: 180, price: 1400, isActive: true },
  { id: 'lash-4', categoryId: 'lashes', name: 'Корекція вій', description: 'Підправлення через 3-4 тижні після нарощування', duration: 90, price: 600, isActive: true },
  { id: 'lash-5', categoryId: 'lashes', name: 'Ламінування вій', description: 'Завивання та зміцнення натуральних вій', duration: 90, price: 700, isActive: true },
  { id: 'lash-6', categoryId: 'lashes', name: 'Ботокс для вій', description: 'Відновлення та зміцнення натуральних вій', duration: 60, price: 500, isActive: true },

  { id: 'hair-1', categoryId: 'haircare', name: 'Жіноча стрижка', description: 'Стрижка будь-якої довжини з укладкою', duration: 60, price: 350, isActive: true },
  { id: 'hair-2', categoryId: 'haircare', name: 'Стрижка + Фарбування', description: 'Стрижка та одноколірне фарбування', duration: 180, price: 1200, isActive: true },
  { id: 'hair-3', categoryId: 'haircare', name: 'Укладка (Blow-dry)', description: 'Укладання феном за допомогою брашингу', duration: 45, price: 250, isActive: true },
  { id: 'hair-4', categoryId: 'haircare', name: 'Укладка (Прасування)', description: 'Випрямлення праскою', duration: 60, price: 300, isActive: true },
  { id: 'hair-5', categoryId: 'haircare', name: 'Мелірування', description: 'Класичне або балаяж мелірування', duration: 240, price: 1800, isActive: true },
  { id: 'hair-6', categoryId: 'haircare', name: 'Кератинове випрямлення', description: 'Відновлення та випрямлення структури волосся', duration: 240, price: 2200, isActive: true },
];

export const masters: Master[] = [
  {
    id: 'master-1',
    userId: 'user-master-1',
    name: 'Олена Ковальчук',
    specializations: ['Манікюр', 'Педикюр'],
    bio: 'Сертифікований майстер манікюру з 7-річним досвідом. Спеціалізується на nail-art та дизайні нігтів. Постійно навчається та вдосконалює свою майстерність.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    experience: 7,
    rating: 4.9,
    reviewsCount: 124,
    isActive: true,
    workingDays: [1, 2, 3, 4, 5],
    workingHours: { start: '09:00', end: '19:00' },
  },
  {
    id: 'master-2',
    userId: 'user-master-2',
    name: 'Марина Бондаренко',
    specializations: ['Брови', 'Вії'],
    bio: 'Майстер з брів та вій з 5-річним досвідом. Кваліфікована у техніках нарощування вій та перманентного макіяжу. Член Асоціації бьюті-майстрів України.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    experience: 5,
    rating: 4.8,
    reviewsCount: 98,
    isActive: true,
    workingDays: [1, 2, 4, 5, 6],
    workingHours: { start: '10:00', end: '20:00' },
  },
  {
    id: 'master-3',
    userId: 'user-master-3',
    name: 'Соломія Петренко',
    specializations: ['Стрижки та укладки'],
    bio: 'Перукар-стиліст з 9-річним досвідом. Спеціалізується на жіночих стрижках, фарбуванні та кератиновому випрямленні. Навчалась у школах Мілана та Парижа.',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400',
    experience: 9,
    rating: 5.0,
    reviewsCount: 156,
    isActive: true,
    workingDays: [2, 3, 4, 5, 6],
    workingHours: { start: '09:00', end: '18:00' },
  },
  {
    id: 'master-4',
    userId: 'user-master-4',
    name: 'Вікторія Лисенко',
    specializations: ['Манікюр', 'Брови'],
    bio: 'Молодий та талановитий майстер з 3-річним досвідом. Вміє поєднати класику та сучасні тренди. Спеціалізується на мінімалістичному дизайні та архітектурі брів.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    experience: 3,
    rating: 4.7,
    reviewsCount: 67,
    isActive: true,
    workingDays: [1, 3, 5, 6],
    workingHours: { start: '11:00', end: '20:00' },
  },
];

export const reviews: Review[] = [
  {
    id: 'rev-1',
    clientId: 'client-1',
    clientName: 'Анна Мороз',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    masterId: 'master-1',
    masterName: 'Олена Ковальчук',
    serviceName: 'Манікюр + Дизайн',
    rating: 5,
    text: 'Просто захоплена роботою Олени! Дизайн вийшов навіть кращим, ніж я уявляла. Майстриня дуже уважна до деталей, а атмосфера в салоні просто неймовірна. Повернусь обов\'язково!',
    createdAt: '2024-07-15',
  },
  {
    id: 'rev-2',
    clientId: 'client-2',
    clientName: 'Ірина Захаренко',
    clientAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100',
    masterId: 'master-2',
    masterName: 'Марина Бондаренко',
    serviceName: 'Нарощування вій (2D)',
    rating: 5,
    text: 'Марина — справжній профі у своїй справі! Вії тримаються вже 4 тижні, жодна не відпала. Результат дуже природній і доглянутий. Рекомендую всім своїм подругам!',
    createdAt: '2024-07-10',
  },
  {
    id: 'rev-3',
    clientId: 'client-3',
    clientName: 'Олеся Тимченко',
    masterName: 'Соломія Петренко',
    serviceName: 'Стрижка + Фарбування',
    rating: 5,
    text: 'Соломія — чарівниця! Зробила мені абсолютно нову зачіску і підібрала ідеальний колір. Вже кілька разів до неї ходила і кожен раз в захваті. Дуже приємна та уважна людина.',
    createdAt: '2024-07-05',
  },
  {
    id: 'rev-4',
    clientId: 'client-4',
    clientName: 'Катерина Дмитренко',
    clientAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100',
    masterId: 'master-2',
    masterName: 'Марина Бондаренко',
    serviceName: 'Архітектура брів',
    rating: 5,
    text: 'Нарешті знайшла свого майстра з брів! Марина ідеально підібрала форму під мій тип обличчя. Брови виглядають природно та акуратно. Дякую за чудову роботу!',
    createdAt: '2024-06-28',
  },
  {
    id: 'rev-5',
    clientId: 'client-5',
    clientName: 'Наталія Серпа',
    masterId: 'master-4',
    masterName: 'Вікторія Лисенко',
    serviceName: 'Манікюр + Гель-лак',
    rating: 4,
    text: 'Дуже задоволена відвідуванням! Вікторія — чудовий майстер. Манікюр вийшов акуратним, покриття тримається довго. Заклад дуже стильний і чистий. Буду повертатись!',
    createdAt: '2024-06-20',
  },
  {
    id: 'rev-6',
    clientId: 'client-6',
    clientName: 'Марія Коваленко',
    clientAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100',
    masterId: 'master-3',
    masterName: 'Соломія Петренко',
    serviceName: 'Кератинове випрямлення',
    rating: 5,
    text: 'Кератин у Соломії — це просто рятівник для мого волосся! Воно стало таким шовковистим і слухняним. Майстриня дуже фахова, пояснила весь догляд після процедури. Топ!',
    createdAt: '2024-06-15',
  },
];

export const galleryItems: GalleryItem[] = [
  { id: 'g-m1', imageUrl: gdriveDirectUrl('1jj70aun_WMVjteCp1ZS0gaP6U1sbZ6g8'), categoryId: 'manicure', categoryName: 'Манікюр', masterName: 'Олена Ковальчук', description: 'Ніжний манікюр з натуральним покриттям', createdAt: '2024-08-01' },
  { id: 'g-m2', imageUrl: gdriveDirectUrl('1DTRg8xw19nneOVeMwcGGBhZY1zKt9BOP'), categoryId: 'manicure', categoryName: 'Манікюр', masterName: 'Олена Ковальчук', description: 'Стильний дизайн нігтів', createdAt: '2024-08-02' },
  { id: 'g-m3', imageUrl: gdriveDirectUrl('1rXX11l5yA6cbDrB_8vVBZNEL1oWcB6kj'), categoryId: 'manicure', categoryName: 'Манікюр', masterName: 'Вікторія Лисенко', description: 'Класичний манікюр з гель-лаком', createdAt: '2024-08-03' },
  { id: 'g-m4', imageUrl: gdriveDirectUrl('1Zv3oTva2KyuKaQ6YnuHwn6aQMMpSyN8b'), categoryId: 'manicure', categoryName: 'Манікюр', masterName: 'Вікторія Лисенко', description: 'Мінімалістичний nail-art', createdAt: '2024-08-04' },
  { id: 'g-m5', imageUrl: gdriveDirectUrl('1vnAuHTqfqkGfFZNbFyIadi8cwaGuAbGc'), categoryId: 'manicure', categoryName: 'Манікюр', masterName: 'Олена Ковальчук', description: 'Французький манікюр', createdAt: '2024-08-05' },

  { id: 'g-b1', imageUrl: gdriveDirectUrl('1S--USWmtQVghIKEYVclnPQpU8sl1lZN1'), categoryId: 'eyebrows', categoryName: 'Брови', masterName: 'Марина Бондаренко', description: 'Архітектура брів з фарбуванням', createdAt: '2024-08-06' },
  { id: 'g-b2', imageUrl: gdriveDirectUrl('1IeLIDukomeno4Hk3UrHbJ8fA15SBon2j'), categoryId: 'eyebrows', categoryName: 'Брови', masterName: 'Марина Бондаренко', description: 'Корекція та ламінування брів', createdAt: '2024-08-07' },
  { id: 'g-b3', imageUrl: gdriveDirectUrl('1OGUpmRGOD97Z4I4p-ILCURv-SQc3BPig'), categoryId: 'eyebrows', categoryName: 'Брови', masterName: 'Вікторія Лисенко', description: 'Природна форма брів', createdAt: '2024-08-08' },

  { id: 'g-l1', imageUrl: gdriveDirectUrl('18FkNpOCvubKgYoAmRA_TR5-gotqndZU_'), categoryId: 'lashes', categoryName: 'Вії', masterName: 'Марина Бондаренко', description: 'Класичне нарощування вій', createdAt: '2024-08-09' },
  { id: 'g-l2', imageUrl: gdriveDirectUrl('1wLCGTFFaqlYA5eRwnd3a-liGVc-8jZPk'), categoryId: 'lashes', categoryName: 'Вії', masterName: 'Марина Бондаренко', description: 'Об\'ємне нарощування 2D', createdAt: '2024-08-10' },
  { id: 'g-l3', imageUrl: gdriveDirectUrl('1e4sCZmuiyaqQXenFKBztGzR6OV-KSoV_'), categoryId: 'lashes', categoryName: 'Вії', masterName: 'Марина Бондаренко', description: 'Ламінування та ботокс вій', createdAt: '2024-08-11' },
  { id: 'g-l4', imageUrl: gdriveDirectUrl('1_5vjHIJcx68H_CsNBdOqUNWb8iz7VSj4'), categoryId: 'lashes', categoryName: 'Вії', masterName: 'Марина Бондаренко', description: 'Мегаоб\'ємне нарощування', createdAt: '2024-08-12' },

  { id: 'g-h1', imageUrl: gdriveDirectUrl('14QuDhiHwrk-xXbgEBiBOpKV5YcXGdnS-'), categoryId: 'haircare', categoryName: 'Стрижки', masterName: 'Соломія Петренко', description: 'Жіноча стрижка з укладкою', createdAt: '2024-08-13' },
  { id: 'g-h2', imageUrl: gdriveDirectUrl('1tZCrAVE3SGfyr8uxQJT5Dmgotp7i905c'), categoryId: 'haircare', categoryName: 'Стрижки', masterName: 'Соломія Петренко', description: 'Каскадна стрижка', createdAt: '2024-08-14' },
  { id: 'g-h3', imageUrl: gdriveDirectUrl('1gsGm15JgNS5U8Vzp89yT5nSAaQjsiRO0'), categoryId: 'haircare', categoryName: 'Стрижки', masterName: 'Соломія Петренко', description: 'Фарбування та мелірування', createdAt: '2024-08-15' },
  { id: 'g-h4', imageUrl: gdriveDirectUrl('1XaKWGINtAbwFgVKyK2V0c9WvR8WY7tVp'), categoryId: 'haircare', categoryName: 'Стрижки', masterName: 'Соломія Петренко', description: 'Укладка та стайлінг', createdAt: '2024-08-16' },
  { id: 'g-h5', imageUrl: gdriveDirectUrl('1P8ailYhBkrsRfgLhOJ6TlpTpxqnFegXM'), categoryId: 'haircare', categoryName: 'Стрижки', masterName: 'Соломія Петренко', description: 'Кератинове випрямлення', createdAt: '2024-08-17' },
];

export const contactInfo: ContactInfo = {
  address: 'вул. Хрещатик, 22, офіс 5, Київ, 01001',
  phone: '+38 (096) 123-45-67',
  email: 'hello@lumibeauty.com.ua',
  instagram: '@lumibeauty_ua',
  telegram: '@lumibeauty',
  workingHours: {
    weekdays: 'Пн–Пт: 09:00–20:00',
    saturday: 'Сб: 10:00–18:00',
    sunday: 'Нд: 11:00–16:00',
  },
  coordinates: { lat: 50.4501, lng: 30.5234 },
};

const futureDate = (daysFromNow: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};
const pastDate = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const mockBookings: Booking[] = [
  {
    id: 'book-1',
    clientId: 'client-demo',
    clientName: 'Тетяна Іваненко',
    clientPhone: '+380961234567',
    masterId: 'master-1',
    masterName: 'Олена Ковальчук',
    serviceId: 'man-2',
    serviceName: 'Манікюр + Гель-лак',
    categoryName: 'Манікюр',
    date: futureDate(3),
    time: '14:00',
    duration: 90,
    price: 600,
    status: 'confirmed',
    createdAt: pastDate(5),
  },
  {
    id: 'book-2',
    clientId: 'client-demo',
    clientName: 'Тетяна Іваненко',
    clientPhone: '+380961234567',
    masterId: 'master-2',
    masterName: 'Марина Бондаренко',
    serviceId: 'lash-1',
    serviceName: 'Нарощування вій (класика)',
    categoryName: 'Вії',
    date: futureDate(10),
    time: '11:00',
    duration: 120,
    price: 800,
    status: 'pending',
    createdAt: pastDate(3),
  },
  {
    id: 'book-3',
    clientId: 'client-demo',
    clientName: 'Тетяна Іваненко',
    clientPhone: '+380961234567',
    masterId: 'master-1',
    masterName: 'Олена Ковальчук',
    serviceId: 'man-4',
    serviceName: 'Манікюр + Дизайн',
    categoryName: 'Манікюр',
    date: pastDate(15),
    time: '16:00',
    duration: 120,
    price: 650,
    status: 'completed',
    createdAt: pastDate(20),
  },
];

export function generateTimeSlots(
  date: string,
  masterId: string,
  existingBookings: Booking[],
  serviceDuration: number = 60
) {
  const slots: { time: string; available: boolean }[] = [];
  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

  const activeBookings = existingBookings.filter(
    (b) => b.date === date && b.masterId === masterId && b.status !== 'cancelled'
  );

  for (const hour of hours) {
    for (const min of [0, 30]) {
      const time = `${hour.toString().padStart(2, '0')}:${min === 0 ? '00' : '30'}`;
      const slotStart = hour * 60 + min;
      const slotEnd = slotStart + serviceDuration;

      const hasConflict = activeBookings.some((b) => {
        const [bh, bm] = b.time.split(':').map(Number);
        const bookingStart = bh * 60 + bm;
        const bookingEnd = bookingStart + b.duration;
        return slotStart < bookingEnd && slotEnd > bookingStart;
      });

      slots.push({ time, available: !hasConflict });
    }
  }
  return slots;
}

export const mockUsers = [
  { id: 'admin-1', name: 'Адміністратор', email: 'admin@lumibeauty.com', password: 'admin123', role: 'admin' as const },
  { id: 'master-user-1', name: 'Олена Ковальчук', email: 'olena@lumibeauty.com', password: 'master123', role: 'master' as const, masterId: 'master-1' },
  { id: 'master-user-2', name: 'Марина Бондаренко', email: 'marina@lumibeauty.com', password: 'master123', role: 'master' as const, masterId: 'master-2' },
  { id: 'master-user-3', name: 'Соломія Петренко', email: 'solomiya@lumibeauty.com', password: 'master123', role: 'master' as const, masterId: 'master-3' },
  { id: 'client-demo', name: 'Тетяна Іваненко', email: 'client@test.com', password: 'client123', role: 'client' as const },
];
