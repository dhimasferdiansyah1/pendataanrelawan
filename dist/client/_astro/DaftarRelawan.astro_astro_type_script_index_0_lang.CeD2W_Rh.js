var e=[],t=async()=>{let t=document.getElementById(`relawanTableBody`),r=document.getElementById(`totalRelawanCount`);try{let i=await(await fetch(`/api/relawan`)).json();i.success&&Array.isArray(i.data)?(e=i.data,r&&(r.textContent=String(e.length)),n()):t&&(t.innerHTML=`<tr><td colspan="6" class="px-4 py-8 text-center text-rose-500">Gagal memuat data relawan.</td></tr>`)}catch{t&&(t.innerHTML=`<tr><td colspan="6" class="px-4 py-8 text-center text-rose-500">Kesalahan jaringan.</td></tr>`)}},n=()=>{let t=document.getElementById(`relawanTableBody`),n=document.getElementById(`searchRelawan`)?.value.toLowerCase().trim(),i=document.getElementById(`filterJabatan`)?.value;if(!t)return;let a=e.filter(e=>{let t=!n||e.namaLengkap?.toLowerCase().includes(n)||e.nik?.includes(n)||e.email?.toLowerCase().includes(n),r=!i||e.jabatan===i;return t&&r});if(a.length===0){t.innerHTML=`
        <tr>
          <td colspan="6" class="px-4 py-12 text-center text-slate-400 font-medium">
            Tidak ada data relawan yang sesuai pencarian.
          </td>
        </tr>
      `;return}t.innerHTML=a.map(e=>`
      <tr class="hover:bg-slate-50/80 transition-colors">
        <td class="px-4 py-3.5">
          <div class="font-bold text-slate-900">${r(e.namaLengkap)}</div>
          <div class="font-mono text-xs text-slate-400">${r(e.nik)}</div>
        </td>
        <td class="px-4 py-3.5">
          <div class="text-slate-800 text-xs">${r(e.email)}</div>
          <div class="font-mono text-xs text-slate-500">${r(e.nomorHp)}</div>
        </td>
        <td class="px-4 py-3.5">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
            ${r(e.jabatan)}
          </span>
        </td>
        <td class="px-4 py-3.5 text-xs font-medium">
          <span class="inline-flex items-center gap-1 text-slate-700">
            ${e.jenisKelamin===`Laki-laki`?`<svg class="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> Laki-laki`:`<svg class="w-3.5 h-3.5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> Perempuan`}
          </span>
        </td>
        <td class="px-4 py-3.5 max-w-xs">
          <div class="text-xs font-semibold text-slate-800">${r(e.tempatLahir)}, ${r(e.tanggalLahir)}</div>
          <div class="text-xs text-slate-500 truncate" title="${r(e.alamatLengkap)}">${r(e.alamatLengkap)}</div>
        </td>
        <td class="px-4 py-3.5 text-right space-x-1">
          <button
            onclick="openEditModal(${e.id})"
            class="p-1.5 rounded-md text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            title="Edit Data"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </button>
          <button
            onclick="deleteRelawanItem(${e.id})"
            class="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Hapus Relawan"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </td>
      </tr>
    `).join(``)};function r(e){return e?String(e).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`):``}window.openEditModal=t=>{let n=e.find(e=>e.id===t);n&&(document.getElementById(`editId`).value=String(n.id),document.getElementById(`editNama`).value=n.namaLengkap||``,document.getElementById(`editNik`).value=n.nik||``,document.getElementById(`editEmail`).value=n.email||``,document.getElementById(`editJabatan`).value=n.jabatan||`Persiapan`,document.getElementById(`editHp`).value=n.nomorHp||``,document.getElementById(`editTempatLahir`).value=n.tempatLahir||``,document.getElementById(`editTanggalLahir`).value=n.tanggalLahir||``,document.getElementById(`editAlamat`).value=n.alamatLengkap||``,document.getElementById(`editModal`)?.classList.remove(`hidden`))};var i=()=>{document.getElementById(`editModal`)?.classList.add(`hidden`)};document.getElementById(`closeEditModalBtn`)?.addEventListener(`click`,i),document.getElementById(`cancelEditBtn`)?.addEventListener(`click`,i),document.getElementById(`editRelawanForm`)?.addEventListener(`submit`,async e=>{e.preventDefault();let n=e.target,r=new FormData(n),a={id:r.get(`id`),namaLengkap:r.get(`namaLengkap`),nik:r.get(`nik`),email:r.get(`email`),jabatan:r.get(`jabatan`),nomorHp:r.get(`nomorHp`),tempatLahir:r.get(`tempatLahir`),tanggalLahir:r.get(`tanggalLahir`),alamatLengkap:r.get(`alamatLengkap`)};try{let e=await(await fetch(`/api/relawan`,{method:`PUT`,headers:{"Content-Type":`application/json`},body:JSON.stringify(a)})).json();e.success?(i(),t()):alert(`Gagal memperbarui: `+e.message)}catch(e){alert(`Error: `+e.message)}}),window.deleteRelawanItem=async t=>{if(confirm(`Apakah Anda yakin ingin menghapus data relawan ini?`))try{let r=await(await fetch(`/api/relawan?id=${t}`,{method:`DELETE`})).json();if(r.success){e=e.filter(e=>e.id!==t);let r=document.getElementById(`totalRelawanCount`);r&&(r.textContent=String(e.length)),n()}else alert(`Gagal menghapus: `+r.message)}catch(e){alert(`Error: `+e.message)}},document.getElementById(`exportExcelBtn`)?.addEventListener(`click`,()=>{if(e.length===0){alert(`Tidak ada data relawan untuk diekspor.`);return}let t=[`ID`,`Nama Lengkap`,`NIK`,`Email`,`Divisi`,`Jenis Kelamin`,`Nomor HP`,`Tempat Lahir`,`Tanggal Lahir`,`Alamat Lengkap`],n=e.map(e=>[e.id,`"${(e.namaLengkap||``).replace(/"/g,`""`)}"`,`"${e.nik||``}"`,`"${e.email||``}"`,`"${e.jabatan||``}"`,`"${e.jenisKelamin||``}"`,`"${e.nomorHp||``}"`,`"${(e.tempatLahir||``).replace(/"/g,`""`)}"`,`"${e.tanggalLahir||``}"`,`"${(e.alamatLengkap||``).replace(/"/g,`""`)}"`]),r=`﻿`+[t.join(`,`),...n.map(e=>e.join(`,`))].join(`
`),i=new Blob([r],{type:`application/vnd.ms-excel;charset=utf-8;`}),a=URL.createObjectURL(i),o=document.createElement(`a`);o.setAttribute(`href`,a),o.setAttribute(`download`,`Relawan_Dapur_SPPG_Pahlawan_${new Date().toISOString().slice(0,10)}.csv`),document.body.appendChild(o),o.click(),document.body.removeChild(o)}),document.getElementById(`exportJsonBtn`)?.addEventListener(`click`,()=>{if(e.length===0){alert(`Tidak ada data relawan untuk diekspor.`);return}let t=JSON.stringify(e,null,2),n=new Blob([t],{type:`application/json`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.setAttribute(`href`,r),i.setAttribute(`download`,`Relawan_Dapur_SPPG_Pahlawan_${new Date().toISOString().slice(0,10)}.json`),document.body.appendChild(i),i.click(),document.body.removeChild(i)}),document.getElementById(`searchRelawan`)?.addEventListener(`input`,n),document.getElementById(`filterJabatan`)?.addEventListener(`change`,n),t();