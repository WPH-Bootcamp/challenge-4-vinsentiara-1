/**
 * Class StudentManager
 * Mengelola koleksi siswa dan operasi-operasi terkait
 *
 * TODO: Implementasikan class StudentManager dengan:
 * - Constructor untuk inisialisasi array students
 * - Method addStudent(student) untuk menambah siswa
 * - Method removeStudent(id) untuk menghapus siswa
 * - Method findStudent(id) untuk mencari siswa
 * - Method updateStudent(id, data) untuk update data siswa
 * - Method getAllStudents() untuk mendapatkan semua siswa
 * - Method getTopStudents(n) untuk mendapatkan top n siswa
 * - Method displayAllStudents() untuk menampilkan semua siswa
 */

class StudentManager {
  // TODO: Implementasikan constructor
  // Properti yang dibutuhkan:
  // - students: Array untuk menyimpan semua siswa

  constructor() {
    // Implementasi constructor di sini
    this.students = []; // array menyimpan instance Student
  }

  /**
   * Menambah siswa baru ke dalam sistem
   * @param {Student} student - Object Student yang akan ditambahkan
   * @returns {boolean} true jika berhasil, false jika ID sudah ada
   * TODO: Validasi bahwa ID belum digunakan
   */
  addStudent(student) {
    if (
      !student ||
      (typeof student.id === "undefined" &&
        typeof student.id !== "string" &&
        typeof student.id !== "number")
    ) {
      throw new Error("Parameter student harus objek dengan properti id.");
    }

    const exists = this.findStudent(student.id);
    if (exists) {
      return false; // ID sudah ada
    }

    this.students.push(student);
    return true;
  }

  /**
   * Menghapus siswa berdasarkan ID
   * @param {string} id - ID siswa yang akan dihapus
   * @returns {boolean} true jika berhasil, false jika tidak ditemukan
   * TODO: Cari dan hapus siswa dari array
   */
  removeStudent(id) {
    const idx = this.students.findIndex((s) => String(s.id) === String(id));
    if (idx === -1) return false;
    this.students.splice(idx, 1);
    return true;
  }

  /**
   * Mencari siswa berdasarkan ID
   * @param {string} id - ID siswa yang dicari
   * @returns {Student|null} Object Student jika ditemukan, null jika tidak
   * TODO: Gunakan method array untuk mencari siswa
   */
  findStudent(id) {
    const student = this.students.find((s) => String(s.id) === String(id));
    return student || null;
  }

  /**
   * Update data siswa
   * @param {string} id - ID siswa yang akan diupdate
   * @param {object} data - Data baru (name, class, grades, dll)
   * @returns {boolean} true jika berhasil, false jika tidak ditemukan
   * TODO: Cari siswa dan update propertinya
   */
  updateStudent(id, data = {}) {
    const student = this.findStudent(id);
    if (!student) return false;

    // Update nama
    if (typeof data.name !== "undefined") {
      // jika Student memiliki setter name, ini akan bekerja; kalau bukan, set langsung
      try {
        student.name = data.name;
      } catch (e) {
        // fallback
        student.name = data.name;
      }
    }

    // Update class
    if (typeof data.class !== "undefined") {
      try {
        student.class = data.class;
      } catch (e) {
        student.class = data.class;
      }
    }

    // Update grades: jika diberikan object "grades", lakukan add/update tiap mapel
    if (
      data.grades &&
      typeof data.grades === "object" &&
      !Array.isArray(data.grades)
    ) {
      // prefer method addGrade jika ada
      const hasAddGrade = typeof student.addGrade === "function";
      for (const [subject, score] of Object.entries(data.grades)) {
        if (hasAddGrade) {
          try {
            student.addGrade(subject, Number(score));
          } catch (e) {
            // jika gagal validasi, lewati grade tersebut
          }
        } else {
          // langsung set ke properti grades (objek) jika ada
          if (!student.grades || typeof student.grades !== "object")
            student.grades = {};
          student.grades[subject] = Number(score);
        }
      }
    }

    return true;
  }

  /**
   * Mendapatkan semua siswa
   * @returns {Array} Array berisi semua siswa
   */
  getAllStudents() {
    // kembalikan shallow copy untuk menghindari manipulasi langsung dari luar
    return [...this.students];
  }

  /**
   * Mendapatkan top n siswa berdasarkan rata-rata nilai
   * @param {number} n - Jumlah siswa yang ingin didapatkan
   * @returns {Array} Array berisi top n siswa
   * TODO: Sort siswa berdasarkan rata-rata (descending) dan ambil n teratas
   */
  getTopStudents(n = 3) {
    if (typeof n !== "number" || n <= 0) return [];

    // hitung average: jika student menyediakan getAverage(), gunakan itu. jika tidak, coba hitung dari student.grades
    const avgOf = (student) => {
      if (typeof student.getAverage === "function") {
        const val = student.getAverage();
        return typeof val === "number" && !Number.isNaN(val) ? val : 0;
      }
      // fallback: compute from student.grades object
      if (student.grades && typeof student.grades === "object") {
        const subs = Object.keys(student.grades);
        if (subs.length === 0) return 0;
        const total = subs.reduce(
          (acc, k) => acc + Number(student.grades[k] || 0),
          0
        );
        return total / subs.length;
      }
      return 0;
    };

    // buat salinan dan sort
    const sorted = [...this.students].sort((a, b) => {
      return avgOf(b) - avgOf(a);
    });

    return sorted.slice(0, Math.min(n, sorted.length));
  }

  /**
   * Menampilkan informasi semua siswa
   * TODO: Loop semua siswa dan panggil displayInfo() untuk masing-masing
   */
  displayAllStudents() {
    if (this.students.length === 0) {
      console.log("Belum ada siswa terdaftar.");
      return;
    }

    for (const s of this.students) {
      if (typeof s.displayInfo === "function") {
        s.displayInfo();
      } else {
        // fallback: tampilkan ringkasan manual
        const avg =
          typeof s.getAverage === "function"
            ? s.getAverage()
            : (() => {
                if (!s.grades) return 0;
                const keys = Object.keys(s.grades);
                if (keys.length === 0) return 0;
                return (
                  keys.reduce((sum, k) => sum + Number(s.grades[k] || 0), 0) /
                  keys.length
                );
              })();

        console.log("=====================================");
        console.log(`ID      : ${s.id}`);
        console.log(`Nama    : ${s.name}`);
        console.log(`Kelas   : ${s.class}`);
        console.log("Nilai   :");
        if (s.grades && Object.keys(s.grades).length > 0) {
          for (const [sub, score] of Object.entries(s.grades)) {
            console.log(`  - ${sub}: ${score}`);
          }
        } else {
          console.log("  - Belum ada nilai");
        }
        console.log(
          `Rata-rata : ${typeof avg === "number" ? avg.toFixed(2) : avg}`
        );
        if (typeof s.getGradeStatus === "function") {
          console.log(`Status     : ${s.getGradeStatus()}`);
        }
        console.log("=====================================");
      }
    }
  }

  /**
   * BONUS: Mendapatkan siswa berdasarkan kelas
   * @param {string} className - Nama kelas
   * @returns {Array} Array siswa dalam kelas tersebut
   */
  getStudentsByClass(className) {
    if (typeof className === "undefined" || className === null) return [];
    return this.students.filter((s) => String(s.class) === String(className));
  }

  /**
   * BONUS: Mendapatkan statistik kelas
   * @param {string} className - Nama kelas
   * @returns {object} Object berisi statistik (jumlah siswa, rata-rata kelas, dll)
   */
  getClassStatistics(className) {
    const group = this.getStudentsByClass(className);
    const count = group.length;
    if (count === 0)
      return { className, count: 0, average: 0, topStudent: null };

    const avgOf = (student) => {
      if (typeof student.getAverage === "function") {
        const val = student.getAverage();
        return typeof val === "number" && !Number.isNaN(val) ? val : 0;
      }
      if (student.grades && typeof student.grades === "object") {
        const keys = Object.keys(student.grades);
        if (keys.length === 0) return 0;
        return (
          keys.reduce((sum, k) => sum + Number(student.grades[k] || 0), 0) /
          keys.length
        );
      }
      return 0;
    };

    const averages = group.map((s) => ({ student: s, avg: avgOf(s) }));
    const classAverage = averages.reduce((sum, a) => sum + a.avg, 0) / count;
    averages.sort((a, b) => b.avg - a.avg);
    const top = averages[0];

    return {
      className,
      count,
      average: classAverage,
      topStudent: top ? top.student : null,
    };
  }
}

export default StudentManager;
