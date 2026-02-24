# Migrasi Data Problems ke Supabase

## Daftar Lengkap Problem Data

Total **9 problem** sudah siap untuk dimigrasikan ke Supabase:

1. **01a-input-output** - Input dan Output pada C++ (easy)
2. **01b-vector** - Vector C++ (medium)
3. **01c-counter** - Counter (easy)
4. **02a-bobot-ikan** - Bobot Ikan (medium)
5. **02b-hitung-usia** - Hitung Usia (hard)
6. **02c-ipk-mahasiswa** - IPK Mahasiswa (hard)
7. **03a-class-orang** - Class Orang (easy)
8. **03b-akun-bank** - Akun Bank (medium)
9. **03c-batu-alam** - Batu Alam (easy)

## Cara Migrasi Data

### Step 1: Setup Table Supabase

1. Buka [Supabase Dashboard](https://app.supabase.com)
2. Pilih project Anda
3. Buka **SQL Editor** (ikon di sidebar)
4. Buat query baru dan copy-paste konten dari file `sql/insert_problems.sql`
5. Jalankan query dengan tombol **Run**

### Step 2: Verifikasi Data

Setelah query berhasil, check data dengan query:

```sql
SELECT id, title, difficulty FROM public.problems ORDER BY id;
```

Harus tampil 9 problems.

### Step 3: Update YouTube Links (Opsional)

Nanti Anda bisa menambah YouTube links untuk setiap problem dengan update:

```sql
UPDATE public.problems
SET youtube_link = 'https://youtube.com/...'
WHERE id = '01a-input-output';
```

## Struktur Table Problems

```
Column Name    | Type     | Nullable | Default
---------------+----------+----------+--------
id             | text     | NO       | -
title          | text     | NO       | -
time_limit     | text     | NO       | '1 s'
memory_limit   | text     | NO       | '256 MB'
description    | text     | NO       | -
constraints    | text     | YES      | -
input_desc     | text     | NO       | -
output_desc    | text     | NO       | -
difficulty     | text     | NO       | -
examples       | jsonb    | YES      | []
solution       | text     | NO       | -
youtube_link   | text     | YES      | NULL
created_at     | timestamp| YES      | CURRENT_TIMESTAMP
updated_at     | timestamp| YES      | CURRENT_TIMESTAMP
```

## Testing dengan Frontend

Setelah data berhasil termigrasikan, test dengan:

```bash
npm run dev
```

Buka `/problems` page. Semua soal harus tampil dari Supabase.

## API Functions di lib/problems.ts

- `getAllProblems()` - Fetch semua problems
- `getProblemById(id)` - Fetch single problem
- `createProblem(problem)` - Tambah problem baru
- `updateProblem(id, problem)` - Update problem (termasuk youtube_link)
