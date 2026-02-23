export interface Problem {
  id: string;
  title: string;
  timeLimit: string;
  memoryLimit: string;
  description: string;
  constraints?: string;
  input: string;
  output: string;
  difficulty: "easy" | "medium" | "hard";
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  solution: string;
}

export const problemsData: Record<string, Problem> = {
  "01a-input-output": {
    id: "01a-input-output",
    title: "01A. Input dan Output pada C++",
    timeLimit: "1 s",
    memoryLimit: "256 MB",
    difficulty: "easy",
    description: `Bahasa Pemrograman C++, meskipun dikembangkan dari Bahasa C, memiliki pustaka dan fungsi-fungsi tersendiri yang berbeda dengan Bahasa C dalam melakukan operasi dasar untuk membantu proses input dan output (membaca masukan dan mencetak keluaran). Dalam Bahasa C, kita biasa menggunakan pustaka <stdio.h> yang memiliki fungsi scanf() untuk membaca masukan (input) dan printf() untuk mencetak keluaran (output). Kedua fungsi tersebut menggunakan penanda format yang disesuaikan dengan tipe data dan format yang diinginkan pada proses input/output, misalnya %d untuk menyatakan bilangan bulat dalam desimal, %f untuk bilangan pecahan (float) dan sebagainya.

Bahasa C++ menggantikan pustaka untuk input/output dengan menggunakan <iostream>, yang mengandung obyek bernama cin dan cout yang masing-masing digunakan untuk input dan output. Untuk menggunakan keduanya, cukup kita berikan simbol stream yang menunjukkan aliran data (simbol '>>' untuk masukan dan '<<' untuk keluaran). Misalnya:

#include <iostream> 
using namespace std;
.... 
int x;
cin >> x;
cout << x << endl;

Potongan program di atas akan membaca masukan untuk diisikan ke variabel x, lalu kemudian menampilkannya kembali dan diakhiri dengan newline (ditunjukkan dengan endl).

Untuk dapat melakukan format banyaknya digit pada desimal, dapat digunakan operasi setprecision (dari <iomanip>) yang digabungkan dengan penanda fixed, misalnya:

#include <iostream>
#include <iomanip>
...
float y;
cin >> y;
cout << fixed << setprecision(2) << y << endl;

Kode di atas memiliki efek yang sama dengan melakukan perintah printf("%.2f\\n", y) pada Bahasa C.

Pada soal ini, Anda diminta untuk mencoba input dan output pada C++ dengan membaca empat buah variabel a, b, c, dan d yang bertipe integer, lalu menghitung rataan dari keempat bilangan tersebut dan menampilkannya dengan dua angka di belakang desimal.`,
    constraints: "-100 juta < a, b, c, d < 100 juta",
    input:
      "Masukan adalah sebuah baris berisi empat buah bilangan bulat:\na b c d",
    output:
      "Keluaran adalah sebuah baris berisi rataan dari keempat bilangan masukan yang dituliskan dengan dua angka di belakang tanda desimal.",
    examples: [
      {
        input: "1 3 4 5",
        output: "3.25",
      },
    ],
    solution: `#include <iostream>
#include <iomanip>
using namespace std;

int main() {
    int a, b, c, d;
    cin >> a >> b >> c >> d;
    
    double rataan = (a + b + c + d) / 4.0;
    
    cout << fixed << setprecision(2) << rataan << endl;
    
    return 0;
}`,
  },
  "01b-vector": {
    id: "01b-vector",
    title: "01B. Vector C++",
    timeLimit: "1 s",
    memoryLimit: "256 MB",
    difficulty: "medium",
    description: `Salah satu bentuk struktur data yang paling umum dipakai adalah array. Baik Bahasa C maupun C++ mendukung penggunaan array untuk menyimpan data berupa beberapa buah nilai dengan tipe yang sama. Namun, array dalam bahasa C/C++ bersifat statis, artinya ukuran array harus ditentukan dari awal sebelum dibuat dan ketika sudah ditentukan, tidak dapat ditambah/dikurangi ukurannya.

Untuk mengatasi hal itu, pada Bahasa C++ disediakan pustaka bernama Standard Template Library (STL) yang memungkinkan kita menyimpan data dalam struktur yang serupa array, namun ukurannya bersifat dinamis (dapat menyesuaikan kebutuhan), yaitu dengan menggunakan struktur data vector (dari <vector>).

Gunakanlah vector untuk menyelesaikan soal di bawah ini.

Seorang dosen ingin menghitung rataan dan ragam dari data nilai-nilai ujian dalam kelasnya. Lebih lanjut, dosen tersebut hanya ingin menghitung rataan dan ragam dari semua nilai yang lebih besar atau sama dengan sebuah batas minimal tertentu, M. Semua nilai yang kurang dari batas minimal tersebut akan diabaikan. Bantulah dosen tersebut untuk menentukan rataan dan ragam yang diinginkan.`,
    constraints: "1 ≤ N ≤ 10000\n0 ≤ M, Ai ≤ 100",
    input: `Masukan dimulai dengan satu baris berisi satu bilangan bulat yang menunjukkan nilai minimum M yang menjadi batas yang diinginkan. Baris kedua berisi beberapa buah bilangan bulat yang merupakan kumpulan nilai-nilai (non-negatif) yang akan dihitung rataan dan ragamnya. Nilai-nilai ini diakhiri dengan sebuah nilai -1 yang menunjukkan akhir dari data (dan bukan merupakan bagian dari data yang akan dihitung rataan & ragamnya).

M
A1 A2 … AN -1`,
    output:
      "Keluaran adalah sebuah baris dengan dua buah nilai, yaitu rataan dan ragam dari semua nilai A1, A2, ... , AN yang lebih besar atau sama dengan M.",
    examples: [
      {
        input: "70\n83 65 95 45 75 -1",
        output: "84.33 101.33",
        explanation:
          "Ada 5 buah nilai, yaitu 83, 65, 95, 45 dan 75. Nilai minimum yang diinginkan adalah 70. Dari nilai-nilai tersebut, hanya 3 nilai yang memenuhi, yaitu: 83, 95 dan 75. Rataan dari ketiga nilai tersebut adalah 84.33, sedangkan ragamnya adalah 101.33.",
      },
    ],
    solution: `#include <iostream>
#include <vector>
#include <iomanip>
using namespace std;

int main() {
    int M;
    cin >> M;
    
    vector<int> validValues;
    int value;
    
    while (cin >> value && value != -1) {
        if (value >= M) {
            validValues.push_back(value);
        }
    }
    
    double sum = 0;
    for (auto x : validValues) {
        sum += x;
    }
    
    double mean = sum / validValues.size();
    
    double variance = 0;
    for (auto x : validValues) {
        variance += (x - mean) * (x - mean);
    }
    variance /= validValues.size();
    
    cout << fixed << setprecision(2) << mean << " " << variance << endl;
    
    return 0;
}`,
  },
  "01c-counter": {
    id: "01c-counter",
    title: "01C. Counter",
    timeLimit: "1 s",
    memoryLimit: "10204 KB",
    difficulty: "easy",
    description: `Rancanglah suatu pendekatan OOP untuk menyelesaikan persoalan Counter berikut: Buat program untuk membuat dan mengolah nilai sebuah counter. Nilai counter dapat dinaikkan satu satuan, diturunkan satu satuan, dan ditampilkan nilainya. Nilai awal counter dapat dibuat dengan nilai tertentu. Inisialisasi counter adalah 0 (nol), dan nilai counter paling kecil adalah 0 (nol) atau tidak pernah bernilai negatif.

Pengolahan terhadap counter tersebut menggunakan kode operasi seperti berikut:

0 n : membuat counter baru dengan nilai awal n
1 : menaikkan counter satu satuan
-1 : menurunkan counter satu satuan
9 : menampilkan nilai counter
-9 : akhir dari input data`,
    input:
      "Beberapa baris instruksi sesuai ketentuan dalam deskripsi soal, dan diakhiri dengan nilai sentinel -9.",
    output: "Hasil dari seluruh instruksi yang ada di dalam input data.",
    examples: [
      {
        input: "0 5\n1\n1\n9\n-1\n9\n0 0\n-1\n1\n9\n-9",
        output: "7\n6\n1",
      },
    ],
    solution: `#include <iostream>
using namespace std;

class Counter {
private:
    int value;
    
public:
    Counter(int initial = 0) {
        value = initial >= 0 ? initial : 0;
    }
    
    void increment() {
        value++;
    }
    
    void decrement() {
        if (value > 0) {
            value--;
        }
    }
    
    void display() {
        cout << value << endl;
    }
};

int main() {
    Counter counter;
    int operation;
    
    while (cin >> operation && operation != -9) {
        if (operation == 0) {
            int n;
            cin >> n;
            counter = Counter(n);
        } else if (operation == 1) {
            counter.increment();
        } else if (operation == -1) {
            counter.decrement();
        } else if (operation == 9) {
            counter.display();
        }
    }
    
    return 0;
}`,
  },
  "02a-bobot-ikan": {
    id: "02a-bobot-ikan",
    title: "02A. Bobot Ikan",
    timeLimit: "1 s",
    memoryLimit: "256 MB",
    difficulty: "medium",
    description: `Standard Template Library (STL) dari C++ juga menyediakan beberapa algoritme standar yang biasa diperlukan dalam pemrograman, misalnya: pencarian (searching), pengurutan (sorting), dan sebagainya. Algoritme ini biasanya dapat diterapkan pada struktur data yang ada dan disediakan dalam header file <algorithm>.

Gunakanlah algoritme yang ada pada header <algorithm> untuk menyelesaikan permasalahan berikut.

Pak Dida adalah seorang peternak ikan gurame yang sedang memanen ikan-ikannya untuk dijual. Ada N buah ikan yang siap dipanen, dengan bobot yang berbeda-beda. Seorang pembeli baru saja mengirimkan pesanan ikan untuk dibeli dengan total bobot sebesar M kilogram. Agar memudahkan pengiriman, Pak Dida dan pembeli tersebut sepakat untuk memilih ikan sedemikian rupa sehingga banyaknya ikan yang harus dikirim sesedikit mungkin.

Diberikan bobot-bobot ikan yang siap dipanen (Bi, 1 < i < N), tentukan banyaknya ikan minimal yang harus dikirimkan oleh Pak Dida untuk memenuhi pesanan yang diminta.`,
    constraints: "1 ≤ N ≤ 10000\n0 < Bi ≤ 1000000\n0 < M ≤ 1000000",
    input: `Masukan diberikan dalam format berikut: baris pertama berisi dua buah bilangan N (bulat, banyaknya ikan yang siap dipanen) dan M (mungkin pecahan, menyatakan total bobot ikan yang akan dipesan). N buah baris berikutnya berisi N buah bilangan (mungkin pecahan) yang menyatakan bobot-bobot ikan Pak Dida (dalam kilogram).

N M
B1 
B2 
… 
BN`,
    output:
      "Keluaran adalah satu baris berisi sebuah bilangan bulat, menyatakan banyaknya ikan minimal yang harus dikirim agar total bobotnya minimal sama dengan pesanan yang diinginkan. Apabila hal ini tidak mungkin dilakukan, keluarkan nilai -1.",
    examples: [
      {
        input:
          "10 100\n35.5\n16.5\n54.5\n12.8\n27.35\n15.4\n41.76\n34.56\n11.3\n9.46",
        output: "3",
        explanation:
          "Total pesanan yang diinginkan adalah 100 kg. Untuk memenuhi pesanan ini, Pak Dida dapat memilih 3 ikan dengan bobot masing-masing 54.5, 27.35 dan 34.56, sehingga total bobot ikan yang akan dikirim adalah 116.41 > 100. Hal ini tidak mungkin dilakukan dengan 2 atau kurang ikan. Oleh karena itu jawabannya adalah 3.",
      },
    ],
    solution: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    int N;
    double M;
    cin >> N >> M;
    
    vector<double> weights(N);
    for (int i = 0; i < N; i++) {
        cin >> weights[i];
    }
    
    // Sort weights in descending order
    sort(weights.begin(), weights.end(), greater<double>());
    
    double totalWeight = 0;
    int count = 0;
    
    for (int i = 0; i < N; i++) {
        totalWeight += weights[i];
        count++;
        
        if (totalWeight >= M) {
            cout << count << endl;
            return 0;
        }
    }
    
    // If we reach here, it's impossible
    cout << -1 << endl;
    
    return 0;
}`,
  },
  "02b-hitung-usia": {
    id: "02b-hitung-usia",
    title: "02B. Hitung Usia",
    timeLimit: "1 s",
    memoryLimit: "256 MB",
    difficulty: "hard",
    description: `Struktur data map atau peta adalah struktur data yang biasa digunakan untuk menyimpan pasangan key dan value (kunci dan nilai) yang sering diperlukan dalam pemrograman. Dalam C++ STL, dikenal ada dua jenis struktur data map, yaitu <map> dan <unordered_map>.

Struktur data unordered_map dan map dapat juga digunakan untuk menyimpan data yang bertipe objek dari sebuah class. Gunakan struktur data map untuk menyelesaikan permasalahan berikut:

Diberikan N buah data mahasiswa dan pegawai di IPB, kita perlu menyimpan data tersebut dalam sebuah struktur OOP berikut:

• Kelas Orang, menyimpan data jenis kelamin (char) dan usia (int)
• Kelas Pegawai, merupakan turunan dari kelas Orang, dan menambahkan data nama (string) dan NIP (string)
• Kelas Mhs, merupakan turunan dari kelas Orang, dan menambahkan data NIM (string)

Selanjutnya diberikan Q buah pertanyaan (query) yang berisi NIM/NIP dari mahasiswa. Tujuan kita adalah menghitung usia rata-rata dari Q orang (mahasiswa/pegawai) yang diberikan tersebut, dengan membedakan antara laki-laki dan perempuan (namun tidak membedakan antara mahasiswa/pegawai).`,
    constraints:
      "1 ≤ N ≤ 20000\n1 ≤ Q ≤ 5000\nSetiap usia adalah nilai bulat positif antara 1 s.d 100",
    input: `Masukan diberikan dalam format berikut: Baris pertama berisi nilai N

Selanjutnya, N buah baris berisi data pegawai atau mahasiswa. Jika baris berisi data pegawai, maka 4 nilai pada baris itu, yaitu NIP, nama, jenis kelamin dan usia. Jika baris berisi data mahasiswa, maka ada 3 nilai pada baris itu, yaitu NIM, jenis kelamin dan usia.

Selanjutnya ada satu baris berisi nilai Q. Q baris berikutnya berisi masing-masing satu buah NIM ataupun NIP.`,
    output: `Keluaran adalah dua buah bilangan pecahan (float) dengan 2 angka di belakang desimal yang berisi masing-masing rata dari semua mahasiswa/pegawai di antara Q orang tadi yang laki-laki, diikuti dengan yang perempuan. Apabila di antara Q orang tidak ada yang laki-laki, maka keluarkan nilai 0.00 untuk rataan laki-laki. Begitu juga dengan kasus apabila tidak ada yang perempuan.`,
    examples: [
      {
        input: `10
G12361538 L 23
A73615839 P 22
H32821762 L 32
198238271313 Dina P 38
G28374622 L 22
G73626183 P 27
G65452234 P 24
198118371621 Toni L 21
G64583762 L 20
B46262538 L 21
5
198238271313
G64583762
H32821762
A73615839
G73626183`,
        output: "26.00 29.00",
      },
    ],
    solution: `#include <iostream>
#include <unordered_map>
#include <iomanip>
#include <sstream>
using namespace std;

class Orang {
protected:
    char jenisKelamin;
    int usia;
public:
    Orang(char jk = 'L', int u = 0) : jenisKelamin(jk), usia(u) {}
    char getJenisKelamin() { return jenisKelamin; }
    int getUsia() { return usia; }
};

class Pegawai : public Orang {
private:
    string nip;
    string nama;
public:
    Pegawai(string n, string nm, char jk, int u) : Orang(jk, u), nip(n), nama(nm) {}
};

class Mhs : public Orang {
private:
    string nim;
public:
    Mhs(string n, char jk, int u) : Orang(jk, u), nim(n) {}
};

int main() {
    int N;
    cin >> N;
    cin.ignore();
    
    unordered_map<string, Orang*> data;
    
    for (int i = 0; i < N; i++) {
        string line;
        getline(cin, line);
        stringstream ss(line);
        
        string id1, id2, id3;
        ss >> id1 >> id2 >> id3;
        
        if (id3.length() <= 2) {
            // Mahasiswa: NIM JK Usia
            char jk = id2[0];
            int usia = stoi(id3);
            data[id1] = new Mhs(id1, jk, usia);
        } else {
            // Pegawai: NIP Nama JK Usia
            string id4;
            ss >> id4;
            char jk = id3[0];
            int usia = stoi(id4);
            data[id1] = new Pegawai(id1, id2, jk, usia);
        }
    }
    
    int Q;
    cin >> Q;
    
    int sumL = 0, countL = 0;
    int sumP = 0, countP = 0;
    
    for (int i = 0; i < Q; i++) {
        string id;
        cin >> id;
        
        if (data.find(id) != data.end()) {
            Orang* orang = data[id];
            if (orang->getJenisKelamin() == 'L') {
                sumL += orang->getUsia();
                countL++;
            } else {
                sumP += orang->getUsia();
                countP++;
            }
        }
    }
    
    double avgL = countL > 0 ? (double)sumL / countL : 0.0;
    double avgP = countP > 0 ? (double)sumP / countP : 0.0;
    
    cout << fixed << setprecision(2) << avgL << " " << avgP << endl;
    
    return 0;
}`,
  },
  "02c-ipk-mahasiswa": {
    id: "02c-ipk-mahasiswa",
    title: "02C. IPK Mahasiswa",
    timeLimit: "1 s",
    memoryLimit: "256 MB",
    difficulty: "hard",
    description: `Struktur data maupun algoritme yang disediakan oleh Standard Template Library (STL) C++ juga dapat diterapkan pada obyek yang didefinisikan menggunakan kelas.

Diberikan data N orang mahasiswa dan nilai-nilai mata kuliah yang didapatkan. Tentukan siapa saja K orang yang memiliki IPK tertinggi dari N orang mahasiswa tersebut (urutkan dari yang memiliki IPK tertinggi ke paling rendah).

Untuk mengerjakan soal ini, Anda wajib mengimplementasikan kelas Mahasiswa dengan kerangka sebagai berikut:

class Mhs
{
public:
 double get_IPK() 
 {
 // .... mendapatkan IPK 
 }
 void tambah_nilai(int sks, char N)
 {
 // ... menambah satu nilai mata kuliah (SKS & huruf mutu)
 }
private:
 string NIM;
 ...
};

Lengkapi kelas tersebut dengan semua atribut dan metode lain sesuai keperluan. Jangan lupa juga untuk mendefinisikan fungsi perbandingan antara dua obyek Mhs berdasarkan IPK nya. Apabila dua orang mahasiswa memilki IPK yang sama persis, maka kita harus tampilkan yang NIM nya lebih kecil secara alphabetic.`,
    constraints: `1 ≤ N ≤ 1000
1 ≤ K < N
Setiap mahasiswa memiliki minimal 1 nilai mata kuliah dan maksimal 50 nilai mata kuliah.
Nilai mata kuliah dinyatakan dengan huruf mutu (A = 4, B = 3, C = 2, D = 1, E = 0).
SKS mata kuliah hanya bernilai 1 s/d 6 (bulat)`,
    input: `Masukan dimulai dengan dua buah bilangan N dan K. Sebanyak N mahasiswa akan diberikan pada baris-baris selanjutnya. Untuk setiap mahasiswa, masukan dimulai dengan NIM, diikuti dengan sebuah bilangan bulat yang menyatakan banyaknya nilai mata kuliah yang sudah diambil, T (1 ≤ T ≤ 50). NIM dapat diasumsikan selalu sepanjang 10 karakter. Selanjutnya, terdapat T buah baris berisi masing-masing data nilai mata kuliah yang didapatkan. Setiap baris data nilai berisi 2 buah nilai (terpisahkan oleh spasi), yang pertama adalah sebuah bilangan bulat menyatakan SKS mata kuliah, sedangkan nilai kedua adalah huruf mutu untuk mata kuliah tersebut.

N K
NIM1 T
SKS1 H1 
SKS2 H2 
... 
SKST HT
...
NIM2 T
...`,
    output: `Keluaran adalah K buah baris berisi masing-masing NIM dan IPK dari K mahasiswa dengan IPK tertinggi, diurutkan dari yang memiliki IPK paling tinggi ke paling rendah. Jika ada dua orang mahasiswa dengan IPK yang sama, maka tampilkan yang memiliki nilai NIM lebih kecil secara alfabetik (perbandingan string). IPK dinyatakan dengan bilangan pecahan sampai dengan 2 desimal.`,
    examples: [
      {
        input: `3 2
G641112222 5 
3 A 
3 C 
2 B 
4 A 
3 C
G641234567 4
2 A
3 B
3 C
3 D
G643332221 3
3 A
3 A
2 A`,
        output: `G643332221 4.00
G641112222 3.07`,
      },
    ],
    solution: `#include <iostream>
#include <vector>
#include <algorithm>
#include <iomanip>
using namespace std;

class Mhs {
public:
    string NIM;
    int totalSKS;
    double totalNilai;
    
    Mhs(string nim) : NIM(nim), totalSKS(0), totalNilai(0) {}
    
    double get_IPK() {
        if (totalSKS == 0) return 0;
        return totalNilai / totalSKS;
    }
    
    void tambah_nilai(int sks, char N) {
        int nilai = 0;
        if (N == 'A') nilai = 4;
        else if (N == 'B') nilai = 3;
        else if (N == 'C') nilai = 2;
        else if (N == 'D') nilai = 1;
        else nilai = 0;
        
        totalNilai += sks * nilai;
        totalSKS += sks;
    }
};

bool operator<(const Mhs& a, const Mhs& b) {
    Mhs& m1 = const_cast<Mhs&>(a);
    Mhs& m2 = const_cast<Mhs&>(b);
    
    double ipk1 = m1.get_IPK();
    double ipk2 = m2.get_IPK();
    
    if (abs(ipk1 - ipk2) < 0.001) {
        return m1.NIM < m2.NIM;
    }
    return ipk1 > ipk2;
}

int main() {
    int N, K;
    cin >> N >> K;
    
    vector<Mhs> mahasiswa;
    
    for (int i = 0; i < N; i++) {
        string nim;
        int T;
        cin >> nim >> T;
        
        Mhs mhs(nim);
        
        for (int j = 0; j < T; j++) {
            int sks;
            char huruf;
            cin >> sks >> huruf;
            mhs.tambah_nilai(sks, huruf);
        }
        
        mahasiswa.push_back(mhs);
    }
    
    sort(mahasiswa.begin(), mahasiswa.end());
    
    for (int i = 0; i < K; i++) {
        cout << mahasiswa[i].NIM << " " << fixed << setprecision(2) 
             << mahasiswa[i].get_IPK() << endl;
    }
    
    return 0;
}`,
  },
  "03a-class-orang": {
    id: "03a-class-orang",
    title: "03A. Class Orang",
    timeLimit: "500 ms",
    memoryLimit: "256 MB",
    difficulty: "easy",
    description: `Diketahui class Orang dalam pemrograman C++ sebagai berikut:

class Orang {
  private:
    string nama;
    int usia;
    double tinggi, berat;
  public:
    Orang(....) { .... }  // constructor
    void show() { .....}  // menuliskan nilai semua atribut
};

Lengkapi dan gunakan class Orang tersebut untuk mengolah data nama, usia, tinggi, dan berat seseorang. Output program seperti pada contoh. Nilai tinggi dan berat disajikan dalam 2 digit di belakang tanda titik.`,
    input: `[nama orang]
[usia]
[tinggi, dalam cm]
[berat, dalam kg]`,
    output: `nama orang | usia | tinggi | berat`,
    examples: [
      {
        input: `Kim Jong Un
63
170.521
69.25`,
        output: `Kim Jong Un | 63 | 170.52 | 69.25`,
      },
    ],
    solution: `#include <iostream>
#include <iomanip>
using namespace std;

class Orang {
  private:
    string nama;
    int usia;
    double tinggi, berat;
    
  public:
    Orang(string n, int u, double t, double b) {
        nama = n;
        usia = u;
        tinggi = t;
        berat = b;
    }
    
    void show() {
        cout << nama << " | " << usia << " | " 
             << fixed << setprecision(2) << tinggi << " | " 
             << berat << endl;
    }
};

int main() {
    string nama;
    int usia;
    double tinggi, berat;
    
    getline(cin, nama);
    cin >> usia >> tinggi >> berat;
    
    Orang orang(nama, usia, tinggi, berat);
    orang.show();
    
    return 0;
}`,
  },
  "03b-akun-bank": {
    id: "03b-akun-bank",
    title: "03B. Akun Bank",
    timeLimit: "500 ms",
    memoryLimit: "256 MB",
    difficulty: "medium",
    description: `Tulislah program untuk membuat class AkunBank untuk merepresentasikan nilai tabungan seseorang dengan nilai saldo tertentu. Class AkunBank juga memiliki atribut nomor rekening berupa String dan nilai batas maksimum setiap transaksi (setor dan tarik). Gunakan tipe data int untuk nilai saldo dan nilai batas maksimum transaksi. Class AkunBank ini memiliki fungsi/metode setor() dan ambil(), yang keduanya tentu akan mengubah nilai saldo tabungan dari nomor rekening tertentu.

Gunakan class ini untuk membuat program mengolah data transaksi dengan format transaksi sebagai berikut:

• Membuka tabungan baru dengan nomor rekening a, batas transaksi b, dan saldo awal sebesar s : C a b s
• Setor n rupiah ke nomor rekening a : S a n
• Tarik n rupiah dari nomor rekening a : T a n
• Akhir dari transaksi : X

Setor dan Tarik yang melebihi batas maksimum, atau tarik yang melebihi saldo, tidak diproses dan tidak mengubah nilai saldo.

Output program berupa daftar nomor rekening dan nilai saldo setiap rekening, terurut berdasarkan nomor rekening secara ascending (menaik).`,
    input: `Beberapa baris transaksi dari beberapa nomor rekening dengan format seperti yang dijelaskan pada deskripsi.`,
    output: `Daftar nomor rekening beserta saldo akhir terurut berdasarkan nomor rekening secara menaik.`,
    examples: [
      {
        input: `C 123456 25000000 0
C 123478 50000000 10000000
C 123412 10000000 0
S 123456 10000000
S 123412 5000000
S 123412 15000000
T 123478 1000000
X`,
        output: `123412 5000000
123456 10000000
123478 9000000`,
      },
    ],
    solution: `#include <iostream>
#include <map>
using namespace std;

class AkunBank {
private:
    string noRek;
    int batasTrans;
    int saldo;
    
public:
    AkunBank() : noRek(""), batasTrans(0), saldo(0) {}
    
    AkunBank(string no, int batas, int saldoAwal) {
        noRek = no;
        batasTrans = batas;
        saldo = saldoAwal;
    }
    
    void setor(int jumlah) {
        if (jumlah <= batasTrans) {
            saldo += jumlah;
        }
    }
    
    void ambil(int jumlah) {
        if (jumlah <= batasTrans && jumlah <= saldo) {
            saldo -= jumlah;
        }
    }
    
    int getSaldo() {
        return saldo;
    }
};

int main() {
    map<string, AkunBank> akun;
    char operasi;
    
    while (cin >> operasi && operasi != 'X') {
        if (operasi == 'C') {
            string noRek;
            int batas, saldo;
            cin >> noRek >> batas >> saldo;
            akun[noRek] = AkunBank(noRek, batas, saldo);
        } else if (operasi == 'S') {
            string noRek;
            int jumlah;
            cin >> noRek >> jumlah;
            akun[noRek].setor(jumlah);
        } else if (operasi == 'T') {
            string noRek;
            int jumlah;
            cin >> noRek >> jumlah;
            akun[noRek].ambil(jumlah);
        }
    }
    
    for (auto& pair : akun) {
        cout << pair.first << " " << pair.second.getSaldo() << endl;
    }
    
    return 0;
}`,
  },
  "03c-batu-alam": {
    id: "03c-batu-alam",
    title: "03C. Batu Alam",
    timeLimit: "2 s",
    memoryLimit: "256 MB",
    difficulty: "easy",
    description: `Pak Andi akan memasang keramik batu alam di halaman belakang rumahnya. Beliau sudah membeli sebanyak N buah batu alam yang semuanya berbentuk persegi panjang. Sayangnya, masing-masing batu memiliki ukuran yang mungkin berbeda-beda. Pak Andi tidak suka dengan ukuran batu yang kecil. Bantulah Pak Andi untuk menentukan K buah batu alam dengan luas terkecil dari tumpukan batu-batu yang dimilikinya.

Pada soal ini Anda harus mengimplementasikan solusi dengan membuat minimal satu buah kelas yaitu Persegi dengan satu buah metode: hitungLuas().`,
    constraints: "1 ≤ N ≤ 1000\n1 ≤ K ≤ N",
    input: `Masukan diberikan dalam format berikut: baris pertama berisi N dan K. Setiap baris dari N baris berikutnya berisi panjang dan lebar masing-masing batu alam.

N K
P1 L1
P2 L2
...
PN KN`,
    output: `Keluarkan K buah baris menunjukkan luas dari batu alam terkecil yang ada, mulai dari yang paling kecil.`,
    examples: [
      {
        input: `8 3
51 10
43 70
35 34
64 26
99 70
60 13
58 63
33 100`,
        output: `510
780
1190`,
      },
    ],
    solution: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

class Persegi {
private:
    int panjang;
    int lebar;
    
public:
    Persegi(int p, int l) : panjang(p), lebar(l) {}
    
    int hitungLuas() {
        return panjang * lebar;
    }
};

bool operator<(const Persegi& a, const Persegi& b) {
    Persegi& p1 = const_cast<Persegi&>(a);
    Persegi& p2 = const_cast<Persegi&>(b);
    return p1.hitungLuas() < p2.hitungLuas();
}

int main() {
    int N, K;
    cin >> N >> K;
    
    vector<Persegi> batu;
    
    for (int i = 0; i < N; i++) {
        int p, l;
        cin >> p >> l;
        batu.push_back(Persegi(p, l));
    }
    
    sort(batu.begin(), batu.end());
    
    for (int i = 0; i < K; i++) {
        cout << batu[i].hitungLuas() << endl;
    }
    
    return 0;
}`,
  },
};
