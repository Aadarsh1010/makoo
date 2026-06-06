const SERVER_URL = 'http://localhost:3001';

async function getData(key) {
  try {
    const res = await fetch(`${SERVER_URL}/api/data/${key}`);
    if (!res.ok) throw new Error('Server error');
    const data = await res.json();
    if (data.value !== null && data.value !== undefined) {
      localStorage.setItem(key, JSON.stringify(data.value));
      return data.value;
    }
    const local = localStorage.getItem(key);
    return local ? JSON.parse(local) : null;
  } catch {
    const local = localStorage.getItem(key);
    return local ? JSON.parse(local) : null;
  }
}

async function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  try {
    await fetch(`${SERVER_URL}/api/data/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
  } catch {
    // silent fallback
  }
}

function getDataSync(key) {
  const local = localStorage.getItem(key);
  return local ? JSON.parse(local) : null;
}

export { getData, setData, getDataSync };
