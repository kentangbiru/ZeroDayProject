document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  const msg = document.getElementById('msg');

  if (res.ok && data.success) {
    msg.style.color = 'green';
    msg.textContent = 'Login berhasil! Mengarahkan...';


    localStorage.setItem('isLoggedIn', 'true');

    setTimeout(() => {
      window.location.href = '/index.html';
    }, 1000);
  } else {
    msg.style.color = 'red';
    msg.textContent = data.message || 'Login gagal!';
  }
});
