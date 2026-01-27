export async function listEmployeeFields(category) {
  const res = await fetch(`/api/employee-fields?category=${encodeURIComponent(category)}`, {
    credentials: 'include',
  });
  if (!res.ok) {
    let msg = `List failed: ${res.status}`;
    let body;
    try { body = await res.json(); } catch (_) {}
    if (body?.message) msg = body.message;
    const err = new Error(msg);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return res.json();
}

export async function createEmployeeField(category, label) {
  const res = await fetch(`/api/employee-fields/${encodeURIComponent(category)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ label }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  return res.json();
}

export async function renameEmployeeField(category, id, label, cascade) {
  const res = await fetch(`/api/employee-fields/${encodeURIComponent(category)}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ label, cascade: !!cascade }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
  return res.json();
}

export async function deleteEmployeeField(category, id, transferToId) {
  const url = transferToId
    ? `/api/employee-fields/${encodeURIComponent(category)}/${id}?transfer_to=${transferToId}`
    : `/api/employee-fields/${encodeURIComponent(category)}/${id}`;
  const res = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }
}
