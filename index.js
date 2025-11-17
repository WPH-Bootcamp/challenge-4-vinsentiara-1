/**
 * Main Application - CLI Interface
 * File ini adalah entry point aplikasi
 *
 * TODO: Implementasikan CLI interface yang interaktif dengan menu:
 * 1. Tambah Siswa Baru
 * 2. Lihat Semua Siswa
 * 3. Cari Siswa (by ID)
 * 4. Update Data Siswa
 * 5. Hapus Siswa
 * 6. Tambah Nilai Siswa
 * 7. Lihat Top 3 Siswa
 * 8. Keluar
 */

import readlineSync from "readline-sync";
import Student from "./src/Student.js";
import StudentManager from "./src/StudentManager.js";

// Inisialisasi StudentManager
const manager = new StudentManager();

/**
 * Menampilkan menu utama
 */
function displayMenu() {
  console.log("\n=================================");
  console.log("SISTEM MANAJEMEN NILAI SISWA");
  console.log("=================================");
  console.log("1. Tambah Siswa Baru");
  console.log("2. Lihat Semua Siswa");
  console.log("3. Cari Siswa");
  console.log("4. Update Data Siswa");
  console.log("5. Hapus Siswa");
  console.log("6. Tambah Nilai Siswa");
  console.log("7. Lihat Top 3 Siswa");
  console.log("8. Keluar");
  console.log("=================================");
}

/**
 * Handler untuk menambah siswa baru
 * TODO: Implementasikan function ini
 * - Minta input: ID, Nama, Kelas
 * - Buat object Student baru
 * - Tambahkan ke manager
 * - Tampilkan pesan sukses/gagal
 */
function addNewStudent() {
  console.log("\n--- Tambah Siswa Baru ---");

  const id = readlineSync.question("Masukkan ID siswa: ").trim();
  if (!id) {
    console.log("ID tidak boleh kosong. Operasi dibatalkan.");
    return;
  }

  const name = readlineSync.question("Masukkan nama siswa: ").trim();
  if (!name) {
    console.log("Nama tidak boleh kosong. Operasi dibatalkan.");
    return;
  }

  const studentClass = readlineSync.question("Masukkan kelas siswa: ").trim();
  if (!studentClass) {
    console.log("Kelas tidak boleh kosong. Operasi dibatalkan.");
    return;
  }

  try {
    const student = new Student(id, name, studentClass);
    const added = manager.addStudent(student);
    if (added) {
      console.log(`Sukses: Siswa dengan ID "${id}" ditambahkan.`);
    } else {
      console.log(`Gagal: ID "${id}" sudah terdaftar.`);
    }
  } catch (err) {
    console.log("Terjadi kesalahan saat menambahkan siswa:", err.message);
  }
}

/**
 * Handler untuk melihat semua siswa
 * TODO: Implementasikan function ini
 * - Panggil method displayAllStudents dari manager
 * - Jika tidak ada siswa, tampilkan pesan
 */
function viewAllStudents() {
  console.log("\n--- Daftar Semua Siswa ---");
  manager.displayAllStudents();
}

/**
 * Handler untuk mencari siswa berdasarkan ID
 * TODO: Implementasikan function ini
 * - Minta input ID
 * - Cari siswa menggunakan manager
 * - Tampilkan info siswa jika ditemukan
 */
function searchStudent() {
  console.log("\n--- Cari Siswa ---");
  const id = readlineSync.question("Masukkan ID siswa yang dicari: ").trim();
  if (!id) {
    console.log("ID tidak boleh kosong. Operasi dibatalkan.");
    return;
  }

  const student = manager.findStudent(id);
  if (!student) {
    console.log(`Siswa dengan ID "${id}" tidak ditemukan.`);
    return;
  }

  if (typeof student.displayInfo === "function") {
    student.displayInfo();
  } else {
    console.log("Data siswa:", student);
  }
}

/**
 * Handler untuk update data siswa
 * TODO: Implementasikan function ini
 * - Minta input ID siswa
 * - Tampilkan data saat ini
 * - Minta input data baru (nama, kelas)
 * - Update menggunakan manager
 */
function updateStudent() {
  console.log("\n--- Update Data Siswa ---");
  const id = readlineSync
    .question("Masukkan ID siswa yang akan diupdate: ")
    .trim();
  if (!id) {
    console.log("ID tidak boleh kosong. Operasi dibatalkan.");
    return;
  }

  const student = manager.findStudent(id);
  if (!student) {
    console.log(`Siswa dengan ID "${id}" tidak ditemukan.`);
    return;
  }

  console.log("Data saat ini:");
  if (typeof student.displayInfo === "function") {
    student.displayInfo();
  } else {
    console.log(student);
  }

  const newName = readlineSync
    .question("Masukkan nama baru (kosongkan jika tidak ingin mengubah): ")
    .trim();
  const newClass = readlineSync
    .question("Masukkan kelas baru (kosongkan jika tidak ingin mengubah): ")
    .trim();

  const updates = {};
  if (newName) updates.name = newName;
  if (newClass) updates.class = newClass;

  if (Object.keys(updates).length === 0) {
    console.log("Tidak ada perubahan. Operasi dibatalkan.");
    return;
  }

  const updated = manager.updateStudent(id, updates);
  if (updated) {
    console.log("Sukses: Data siswa diperbarui.");
  } else {
    console.log("Gagal: Tidak dapat memperbarui data siswa.");
  }
}

/**
 * Handler untuk menghapus siswa
 * TODO: Implementasikan function ini
 * - Minta input ID siswa
 * - Konfirmasi penghapusan
 * - Hapus menggunakan manager
 */
function deleteStudent() {
  console.log("\n--- Hapus Siswa ---");
  const id = readlineSync
    .question("Masukkan ID siswa yang akan dihapus: ")
    .trim();
  if (!id) {
    console.log("ID tidak boleh kosong. Operasi dibatalkan.");
    return;
  }

  const student = manager.findStudent(id);
  if (!student) {
    console.log(`Siswa dengan ID "${id}" tidak ditemukan.`);
    return;
  }

  if (typeof student.displayInfo === "function") {
    student.displayInfo();
  } else {
    console.log(student);
  }

  const confirm = readlineSync
    .question("Yakin ingin menghapus siswa ini? (y/n): ")
    .trim()
    .toLowerCase();
  if (confirm !== "y" && confirm !== "yes") {
    console.log("Penghapusan dibatalkan.");
    return;
  }

  const removed = manager.removeStudent(id);
  if (removed) {
    console.log(`Sukses: Siswa dengan ID "${id}" dihapus.`);
  } else {
    console.log(`Gagal: Siswa dengan ID "${id}" tidak dapat dihapus.`);
  }
}

/**
 * Handler untuk menambah nilai siswa
 * TODO: Implementasikan function ini
 * - Minta input ID siswa
 * - Tampilkan data siswa
 * - Minta input mata pelajaran dan nilai
 * - Tambahkan nilai menggunakan method addGrade
 */
function addGradeToStudent() {
  console.log("\n--- Tambah Nilai Siswa ---");
  const id = readlineSync.question("Masukkan ID siswa: ").trim();
  if (!id) {
    console.log("ID tidak boleh kosong. Operasi dibatalkan.");
    return;
  }

  const student = manager.findStudent(id);
  if (!student) {
    console.log(`Siswa dengan ID "${id}" tidak ditemukan.`);
    return;
  }

  console.log("Data siswa:");
  if (typeof student.displayInfo === "function") {
    student.displayInfo();
  } else {
    console.log(student);
  }

  const subject = readlineSync
    .question("Masukkan nama mata pelajaran: ")
    .trim();
  if (!subject) {
    console.log("Nama mata pelajaran tidak boleh kosong. Operasi dibatalkan.");
    return;
  }

  const scoreInput = readlineSync.question("Masukkan nilai (0-100): ").trim();
  const score = Number(scoreInput);
  if (Number.isNaN(score) || score < 0 || score > 100) {
    console.log(
      "Nilai tidak valid. Harus angka antara 0 sampai 100. Operasi dibatalkan."
    );
    return;
  }

  try {
    if (typeof student.addGrade === "function") {
      student.addGrade(subject, score);
    } else {
      // fallback ke properti grades jika method tidak tersedia
      if (!student.grades || typeof student.grades !== "object")
        student.grades = {};
      student.grades[subject] = score;
    }
    console.log(
      `Sukses: Nilai ${subject} (${score}) ditambahkan/diupdate untuk siswa ${student.name}.`
    );
  } catch (err) {
    console.log("Gagal menambahkan nilai:", err.message);
  }
}

/**
 * Handler untuk melihat top students
 * TODO: Implementasikan function ini
 * - Panggil getTopStudents(3) dari manager
 * - Tampilkan informasi siswa
 */
function viewTopStudents() {
  console.log("\n--- Top 3 Siswa ---");
  const top = manager.getTopStudents(3);
  if (!top || top.length === 0) {
    console.log("Belum ada data siswa atau belum ada nilai.");
    return;
  }

  top.forEach((s, idx) => {
    console.log(`\n#${idx + 1}`);
    if (typeof s.displayInfo === "function") {
      s.displayInfo();
    } else {
      console.log(s);
    }
  });
}

/**
 * Main program loop
 * TODO: Implementasikan main loop
 * - Tampilkan menu
 * - Baca input pilihan
 * - Panggil handler yang sesuai
 * - Ulangi sampai user pilih keluar
 */
function main() {
  console.log("Selamat datang di Sistem Manajemen Nilai Siswa!");

  let running = true;

  while (running) {
    displayMenu();
    const choice = readlineSync.question("Pilih menu (1-8): ").trim();

    switch (choice) {
      case "1":
        addNewStudent();
        break;
      case "2":
        viewAllStudents();
        break;
      case "3":
        searchStudent();
        break;
      case "4":
        updateStudent();
        break;
      case "5":
        deleteStudent();
        break;
      case "6":
        addGradeToStudent();
        break;
      case "7":
        viewTopStudents();
        break;
      case "8":
        running = false;
        break;
      default:
        console.log("Pilihan tidak valid. Silakan pilih angka 1-8.");
    }
  }

  console.log("\nTerima kasih telah menggunakan aplikasi ini!");
}

// Jalankan aplikasi
main();
