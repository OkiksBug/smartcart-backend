import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { Button } from './index';

export default function NotificationsListModal({ show, onClose, initialItems = [], loadMoreUrl = '/admin/notifications', onLoadMore = () => {} }) {
  const [items, setItems] = useState(initialItems || []);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  if (!show) return null;

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const next = page + 1;
      const res = await axios.get(`${loadMoreUrl}?page=${next}`);
      const newItems = res.data.data || [];
      const more = res.data.meta?.hasMore ?? false;
      setItems(prev => [...prev, ...newItems]);
      setPage(next);
      setHasMore(more);
      onLoadMore(newItems, more);
    } catch (e) {
      console.error('Failed to load more notifications', e);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between bg-teal-50">
          <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
        <div className="p-4">
          <div className="max-h-80 overflow-auto">
            {items.length === 0 ? (
              <div className="text-gray-600">No notifications.</div>
            ) : (
              <ul className="space-y-3">
                {items.map((n) => (
                  <li key={n.id} className="">
                    <Link href={n.url || '#'} className={`block p-3 border rounded-md hover:bg-gray-100 ${n.is_seen ? 'bg-white text-gray-600' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-semibold flex items-center gap-3">
                            <div className="w-8 h-8 rounded flex items-center justify-center bg-white">
                              {n.type === 'order' ? (
                                <span className="text-teal-600">🧾</span>
                              ) : (
                                <span className="text-yellow-600">⚠️</span>
                              )}
                            </div>
                            <div>
                              <div>{n.title}</div>
                              <div className="text-sm text-gray-600">{n.message}</div>
                            </div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400 ml-4">{n.time}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4 text-center">
            {hasMore ? (
              <Button onClick={loadMore} className="px-4 py-2" disabled={loadingMore}>
                {loadingMore ? 'Loading...' : 'Load more'}
              </Button>
            ) : (
              <div className="text-sm text-gray-500">No more notifications.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
