# Penjuri - Online Judge Frontend

Penjuri adalah platform online judge untuk praktik soal-soal kompetitif pemrograman. Frontend ini menyediakan interface yang user-friendly untuk melihat soal, berdiskusi, dan belajar dari solusi.

## Teknologi Stack

- **Framework**: Next.js 16.1.6
- **Runtime**: React 19.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Custom + Shadcn UI
- **Notifications**: React Hot Toast

## Fitur Utama

- ✅ **Problem Listing** - Daftar soal dengan filter berdasarkan kesulitan dan bahasa (C/C++/Java)
- ✅ **Problem Details** - Tampilan lengkap soal dengan deskripsi, batasan, contoh input/output
- ✅ **Hints System** - Sistem hints (hingga 3 hints) untuk membantu tanpa memberikan solusi langsung
- ✅ **Solution Protection** - Confirmation modal sebelum melihat solusi dengan pesan dalam bahasa Indonesia
- ✅ **Video Tutorial** - Integrasi YouTube untuk video penjelasan solusi
- ✅ **Navigation** - Tombol "Soal Berikutnya" untuk navigasi antar soal dengan level sama
- ✅ **Comments System** - Diskusi dan Q&A antar pengguna di setiap soal
- ✅ **Authentication** - Login dengan Clerk untuk personalisasi pengalaman
- ✅ **Responsive Design** - Mobile-friendly interface dengan Tailwind CSS

## Prasyarat

- Node.js v18+
- npm atau yarn
- Environment variables untuk Supabase dan Clerk

## Getting Started

### 1. Setup Environment Variables

Copy file `.env.local.example` ke `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### 4. Build untuk Production

```bash
npm run build
npm run start
```

## Struktur Folder

```
app/
├── page.tsx                    # Home page
├── problems/                   # Problem list page
│   └── [id]/page.tsx          # Problem detail page
├── kalkulator-ipk/             # GPA calculator page
└── layout.tsx                  # Root layout

components/
├── AppSidebar.tsx             # Sidebar navigation
├── ProblemCard.tsx            # Problem list item
├── SolutionConfirmationModal  # Confirmation sebelum lihat solusi
└── ui/                        # Reusable UI components

lib/
├── problems.ts                # Problem CRUD & fetching
├── comments.ts                # Comments management
├── comments-actions.ts        # Server actions untuk comments
├── supabase.ts                # Supabase client
└── utils.ts                   # Helper functions

public/                        # Static assets
```

## Pengembangan

### Menambah Fitur Baru

1. Buat component di `components/` untuk UI
2. Tambah data functions di `lib/` untuk database
3. Update routes di `app/` sesuai kebutuhan
4. Test locally sebelum push

### Database Schema (Supabase)

#### Problems Table

```
id (text, PK)
title (text)
description (text)
constraints (text)
input_desc (text)
output_desc (text)
difficulty (easy | medium | hard)
language (c | cpp | java)
examples (jsonb)
hints (jsonb array)
solution (text)
time_limit (text)
memory_limit (text)
youtube_link (text)
created_at (timestamp)
```

#### Comments Table

```
id (uuid, PK)
problem_id (text, FK)
user_id (text)
user_name (text)
content (text)
created_at (timestamp)
replies (jsonb array)
```

## Styling Guidelines

- **Color Scheme**: Zinc (zinc-900 primary, zinc-700 secondary)
- **Primary Button**: `bg-zinc-900 text-white`
- **Secondary Button**: `bg-white text-zinc-700 border`
- **Warning**: `bg-yellow-600`
- **Success**: `bg-green-600`

## Authentication

Menggunakan Clerk. User perlu login untuk:

- Berkomentar di soal
- Melihat activity history

## Deployment

### Deploy ke Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Atau Netlify / Self-hosted

Environment variables harus tersetting di hosting platform.

## API Endpoints

- `GET /api/visitors` - Track pengunjung
- `GET /problems` - Fetch semua problems
- `GET /problems/:id` - Fetch problem detail
- `POST /comments` - Create comment
- `GET /comments/:problemId` - Fetch comments

## Troubleshooting

### Build Error

```bash
npm install
npm run build
```

### Supabase Connection Error

- Periksa `.env.local` sudah benar
- Verifikasi Supabase URL dan key di Supabase dashboard

### Clerk Auth Error

- Check Clerk dashboard settings dan environment variables

## Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Supabase](https://supabase.io/docs)
- [Clerk](https://clerk.com/docs)

## Contributing

1. Buat feature branch: `git checkout -b feature/nama-fitur`
2. Commit: `git commit -am 'Deskripsi perubahan'`
3. Push: `git push origin feature/nama-fitur`
4. Buat Pull Request

## License

Proprietary - Penggunaan tersedia dengan izin dari pemilik project
