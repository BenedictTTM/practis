import React, { useEffect, useRef, useState } from 'react';
import { MdNavigateNext } from 'react-icons/md';
import { categories } from '../../constants/categories'; // categories: string[]

interface Props {
  value?: string;
  onChange: (value: string) => void;
}

export default function CategorySelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    function onOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onOutside);
    };
  }, [open]);

  const filtered = categories.filter((c) =>
    c.toLowerCase().includes(q.trim().toLowerCase())
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className="w-full text-left px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 flex items-center justify-between"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={value ? 'text-gray-800' : 'text-gray-400'}>{value ?? 'Category'}</span>
        <MdNavigateNext className="text-gray-500" />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            className="bg-white rounded-xl w-full max-w-md p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">Choose category</h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search categories..."
              className="w-full px-3 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-orange-400"
              aria-label="Search categories"
            />

            <div className="max-h-60 overflow-auto">
              {filtered.length === 0 ? (
                <div className="text-center text-gray-400 py-6">No categories found</div>
              ) : (
                filtered.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      onChange(cat);
                      setOpen(false);
                      setQ('');
                    }}
                    className="w-full text-left px-3 py-2 mb-2 rounded-lg hover:bg-gray-100 transition flex items-center justify-between"
                  >
                    <span>{cat}</span>
                    <span className="text-gray-400">›</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}