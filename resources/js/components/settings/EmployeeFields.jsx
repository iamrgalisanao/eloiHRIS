import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { listEmployeeFields, createEmployeeField, renameEmployeeField, deleteEmployeeField } from '../../services/employeeFieldService';

const CATEGORIES = [
  // Employee taxonomy
  { key: 'department', label: 'Department' },
  { key: 'division', label: 'Division' },
  { key: 'job_title', label: 'Job Title' },
  { key: 'location', label: 'Location' },
  { key: 'employment_status', label: 'Employment Status' },
  { key: 'team', label: 'Teams' },
  // Standard fields
  { key: 'compensation_change_reason', label: 'Compensation Change Reason' },
  { key: 'degree', label: 'Degree' },
  { key: 'emergency_contact_relationship', label: 'Emergency Contact Relationship' },
  { key: 'termination_reason', label: 'Termination Reason' },
  { key: 'pay_schedule', label: 'Pay Schedule' },
];

export default function EmployeeFields() {
  const [category, setCategory] = useState('department');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newLabel, setNewLabel] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingLabel, setEditingLabel] = useState('');

  const currentCatLabel = useMemo(() => CATEGORIES.find(c => c.key === category)?.label || '', [category]);
  const filterParamKey = useMemo(() => {
    switch (category) {
      case 'department':
        return 'department';
      case 'division':
        return 'division';
      case 'job_title':
        return 'job_title';
      case 'location':
        return 'location';
      default:
        return null; // employment_status, team have no People filter yet
    }
  }, [category]);

  const refresh = async () => {
    setLoading(true); setError(null);
    try {
      const data = await listEmployeeFields(category);
      setItems(data);
    } catch (e) {
      setError('Failed to load values');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, [category]);

  const onAdd = async () => {
    const label = newLabel.trim();
    if (!label) return;
    try {
      const created = await createEmployeeField(category, label);
      setItems(prev => [...prev, created]);
      setNewLabel('');
    } catch (e) {
      alert(e?.message || 'Could not create value');
    }
  };

  const onRename = async (item) => {
    const label = editingLabel.trim();
    if (!label) { setEditingId(null); return; }
    try {
      const cascade = item.people_count > 0 ? window.confirm('Cascade rename existing employees?') : false;
      const updated = await renameEmployeeField(category, item.id, label, cascade);
      setItems(prev => prev.map(it => it.id === item.id ? updated : it));
      setEditingId(null);
      setEditingLabel('');
    } catch (e) {
      alert(e?.message || 'Could not rename value');
    }
  };

  const onDelete = async (item) => {
    try {
      await deleteEmployeeField(category, item.id);
      setItems(prev => prev.filter(it => it.id !== item.id));
    } catch (e) {
      if (e?.code === 'transfer_required') {
        const opts = e.values || [];
        if (opts.length === 0) { alert('No candidates to transfer to.'); return; }
        const chosen = window.prompt(`Value '${item.label}' is in use by ${item.people_count}. Enter target id to transfer:\n` + opts.map(o => `${o.id}: ${o.label} (${o.people_count})`).join('\n'));
        const id = parseInt(chosen, 10);
        if (!id || !opts.some(o => o.id === id)) return;
        try {
          await deleteEmployeeField(category, item.id, id);
          setItems(prev => prev.filter(it => it.id !== item.id));
        } catch (e2) {
          alert(e2?.message || 'Transfer failed');
        }
      } else {
        alert(e?.message || 'Delete failed');
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '12px' }}>
          {CATEGORIES.map(c => (
            <div key={c.key} onClick={() => setCategory(c.key)}
                 style={{ padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px',
                   background: category === c.key ? 'var(--primary)' : 'transparent', color: category === c.key ? '#fff' : 'var(--text-main)', fontWeight: 600 }}>
              {c.label}
            </div>
          ))}
        </div>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 className="font-heading" style={{ margin: 0 }}>{currentCatLabel}</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder={`New ${currentCatLabel}`}
                     style={{ padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8 }} />
              <button onClick={onAdd} className="btn-primary" style={{ padding: '8px 14px', borderRadius: 8 }}>Add</button>
            </div>
          </div>
          {loading ? <div>Loading…</div> : error ? <div style={{ color: 'crimson' }}>{error}</div> : (
            <div style={{ overflow: 'hidden', borderRadius: 8, border: '1px solid #f1f5f9' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th style={{ padding: 12, textAlign: 'left' }}>Name</th>
                    <th style={{ padding: 12, textAlign: 'right' }}>People</th>
                    <th style={{ padding: 12, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                      <td style={{ padding: 12 }}>
                        {editingId === item.id ? (
                          <input value={editingLabel} onChange={e => setEditingLabel(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') onRename(item); if (e.key === 'Escape') { setEditingId(null); setEditingLabel(''); } }}
                                 autoFocus style={{ padding: '6px 8px', border: '1px solid #e2e8f0', borderRadius: 6 }} />
                        ) : (
                          item.label
                        )}
                      </td>
                      <td style={{ padding: 12, textAlign: 'right' }}>
                        {filterParamKey ? (
                          <Link to={`/people?${filterParamKey}=${encodeURIComponent(item.label)}`} className="link-primary">
                            {item.people_count}
                          </Link>
                        ) : (
                          item.people_count
                        )}
                      </td>
                      <td style={{ padding: 12, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {editingId === item.id ? (
                          <>
                            <button onClick={() => onRename(item)} className="btn-primary" style={{ padding: '6px 10px', borderRadius: 6, marginRight: 6 }}>Save</button>
                            <button onClick={() => { setEditingId(null); setEditingLabel(''); }} style={{ padding: '6px 10px', borderRadius: 6 }}>Cancel</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { setEditingId(item.id); setEditingLabel(item.label); }} style={{ padding: '6px 10px', borderRadius: 6, marginRight: 6 }}>Rename</button>
                            <button onClick={() => onDelete(item)} style={{ padding: '6px 10px', borderRadius: 6 }}>Delete</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr><td colSpan="3" style={{ padding: 16, textAlign: 'center', color: '#64748b' }}>No values yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
