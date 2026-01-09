const $ = (id) => document.getElementById(id);

async function fetchList() {
  const res = await fetch('/api/hewan');
  const data = await res.json();
  const tbody = $('list');
  tbody.innerHTML = '';
  data.forEach(h => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${h.id}</td>
      <td>${h.nama}</td>
      <td>${h.jenis || ''}</td>
      <td>${h.umur ?? ''}</td>
      <td>
        <button data-id="${h.id}" class="edit">Edit</button>
        <button data-id="${h.id}" class="del">Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function createOrUpdate(e) {
  e.preventDefault();
  const id = $('id').value;
  const payload = {
    nama: $('nama').value.trim(),
    jenis: $('jenis').value.trim(),
    umur: parseInt($('umur').value) || null
  };

  if (!payload.nama) return showMsg('Nama wajib diisi');

  if (id) {
    await fetch('/api/hewan/' + id, { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    showMsg('Data diperbarui');
  } else {
    await fetch('/api/hewan', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
    showMsg('Data ditambahkan');
  }
  resetForm();
  await fetchList();
}

function resetForm() {
  $('id').value = '';
  $('nama').value = '';
  $('jenis').value = '';
  $('umur').value = '';
}

function showMsg(text) {
  const el = $('msg');
  el.textContent = text;
  setTimeout(() => el.textContent = '', 2500);
}

document.addEventListener('click', async (ev) => {
  if (ev.target.matches('.edit')) {
    const id = ev.target.dataset.id;
    const res = await fetch('/api/hewan');
    const data = await res.json();
    const h = data.find(x => String(x.id) === String(id));
    if (h) {
      $('id').value = h.id;
      $('nama').value = h.nama;
      $('jenis').value = h.jenis || '';
      $('umur').value = h.umur ?? '';
    }
  }
  if (ev.target.matches('.del')) {
    if (!confirm('Hapus data?')) return;
    const id = ev.target.dataset.id;
    await fetch('/api/hewan/' + id, { method: 'DELETE' });
    showMsg('Data dihapus');
    await fetchList();
  }
});

$('form').addEventListener('submit', createOrUpdate);
$('batal').addEventListener('click', resetForm);

fetchList();