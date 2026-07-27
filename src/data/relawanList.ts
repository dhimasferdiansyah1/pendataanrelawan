export interface MasterRelawan {
  nama: string;
  jk: 'L' | 'P';
}

export const masterRelawanList: MasterRelawan[] = [
  { nama: "Siti Putri Lamsere Hasibuan", jk: "P" },
  { nama: "Hayya Hejira Fahlevi", jk: "P" },
  { nama: "Ihsan Fahrezy Matondang", jk: "L" },
  { nama: "Zuhri Ramadan", jk: "L" },
  { nama: "Alfi Syahrin", jk: "L" },
  { nama: "Yani Fadilla", jk: "P" },
  { nama: "Didi Iranda", jk: "L" },
  { nama: "Nur Ilmi Nasution", jk: "P" },
  { nama: "Intan Pandini", jk: "P" },
  { nama: "Nazla Dinar Fachira Siregar", jk: "P" },
  { nama: "Erfi Ria Reza Lubis", jk: "P" },
  { nama: "Della Anggraini Br Manurung", jk: "P" },
  { nama: "Aulia Putri", jk: "P" },
  { nama: "Melisa Sari", jk: "P" },
  { nama: "Melati Afrilly Hasibuan", jk: "P" },
  { nama: "Adrian Maulanna", jk: "L" },
  { nama: "Chairunnisah", jk: "P" },
  { nama: "Aulia Fachri", jk: "L" },
  { nama: "Siti Fatimah Nasution", jk: "P" },
  { nama: "Erlina Agustina", jk: "P" },
  { nama: "Supriana", jk: "P" },
  { nama: "Tri Agustina", jk: "P" },
  { nama: "Sri Wahyuni", jk: "P" },
  { nama: "Ika Sundari", jk: "P" },
  { nama: "Suwidyawati", jk: "P" },
  { nama: "Sri Rezeki Wahyuni", jk: "P" },
  { nama: "Ramiani", jk: "P" },
  { nama: "Nurhalila Rangkuti", jk: "P" },
  { nama: "Sri Agustinawati Harahap", jk: "P" },
  { nama: "Anisyah", jk: "P" },
  { nama: "Puspa Sari", jk: "P" },
  { nama: "Ira Juliana", jk: "P" },
  { nama: "Erdian Riza Lubis", jk: "L" },
  { nama: "Dedi Setiadi Tanjung", jk: "L" },
  { nama: "Atrik Yaherman", jk: "L" },
  { nama: "Robert Midian Sihombing", jk: "L" },
  { nama: "Ilham Arta Aulia", jk: "L" },
  { nama: "Faisal Asraf", jk: "L" },
  { nama: "Desy Ratna Sari", jk: "P" },
  { nama: "Tirta Agrawira Chaniago", jk: "L" },
  { nama: "Siti Fatimah", jk: "P" },
  { nama: "Armayanti", jk: "P" },
  { nama: "Agung Irawan", jk: "L" },
  { nama: "Rangga Hairadi", jk: "L" },
  { nama: "Muhammad Apriansyah", jk: "L" },
  { nama: "Ikhsan Fauzan Amir", jk: "L" },
];

export function getGenderByName(nama: string): 'Laki-laki' | 'Perempuan' {
  const match = masterRelawanList.find(
    (item) => item.nama.trim().toLowerCase() === nama.trim().toLowerCase()
  );
  return match ? (match.jk === 'L' ? 'Laki-laki' : 'Perempuan') : 'Laki-laki';
}
