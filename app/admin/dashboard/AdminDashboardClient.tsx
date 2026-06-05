'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { SiteContent, Post, GalleryItem, Service } from '@/lib/data';

interface Props {
  initialData: SiteContent;
}

type Tab = 'shop' | 'services' | 'posts' | 'gallery';

export default function AdminDashboardClient({ initialData }: Props) {
  const [data, setData] = useState<SiteContent>(initialData);
  const [activeTab, setActiveTab] = useState<Tab>('shop');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // Post form state
  const [newPost, setNewPost] = useState({ title: '', content: '', image: '' });
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  // Gallery form state
  const [newCaption, setNewCaption] = useState('');

  // Service form state
  const [newService, setNewService] = useState({ name: '', price: '', description: '' });
  const [editingService, setEditingService] = useState<Service | null>(null);

  const postImageRef = useRef<HTMLInputElement>(null);
  const galleryImageRef = useRef<HTMLInputElement>(null);
  const heroImageRef = useRef<HTMLInputElement>(null);

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  }

  async function uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const json = await res.json();
    return json.url;
  }

  async function saveShop() {
    setSaving(true);
    const res = await fetch('/api/shop', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data.shop),
    });
    if (res.ok) {
      showMessage('✅ Đã lưu thông tin quán!');
      router.refresh();
    }
    setSaving(false);
  }

  async function handleHeroUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    setData(d => ({ ...d, shop: { ...d.shop, heroImage: url } }));
    setUploading(false);
  }

  async function savePost(post: { title: string; content: string; image: string }, id?: string) {
    setSaving(true);
    const method = id ? 'PUT' : 'POST';
    const res = await fetch('/api/posts', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(id ? { ...post, id } : post),
    });
    if (res.ok) {
      const updated = await fetch('/api/posts').then(r => r.json());
      setData(d => ({ ...d, posts: updated }));
      setNewPost({ title: '', content: '', image: '' });
      setEditingPost(null);
      showMessage('✅ Đã lưu bài viết!');
    }
    setSaving(false);
  }

  async function deletePost(id: string) {
    if (!confirm('Xóa bài viết này?')) return;
    await fetch('/api/posts', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setData(d => ({ ...d, posts: d.posts.filter(p => p.id !== id) }));
    showMessage('✅ Đã xóa bài viết!');
  }

  async function handlePostImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    if (editingPost) {
      setEditingPost(ep => ep ? { ...ep, image: url } : ep);
    } else {
      setNewPost(p => ({ ...p, image: url }));
    }
    setUploading(false);
  }

  async function addGalleryImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadImage(file);
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, caption: newCaption }),
    });
    if (res.ok) {
      const updated = await fetch('/api/gallery').then(r => r.json());
      setData(d => ({ ...d, gallery: updated }));
      setNewCaption('');
      showMessage('✅ Đã thêm ảnh vào thư viện!');
    }
    setUploading(false);
    if (galleryImageRef.current) galleryImageRef.current.value = '';
  }

  async function deleteGallery(id: string) {
    if (!confirm('Xóa ảnh này?')) return;
    await fetch('/api/gallery', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setData(d => ({ ...d, gallery: d.gallery.filter(g => g.id !== id) }));
    showMessage('✅ Đã xóa ảnh!');
  }

  async function saveService(service: { name: string; price: string; description: string }, id?: string) {
    setSaving(true);
    const method = id ? 'PUT' : 'POST';
    const res = await fetch('/api/services', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(id ? { ...service, id } : service),
    });
    if (res.ok) {
      const updated = await fetch('/api/services').then(r => r.json());
      setData(d => ({ ...d, services: updated }));
      setNewService({ name: '', price: '', description: '' });
      setEditingService(null);
      showMessage('✅ Đã lưu dịch vụ!');
    }
    setSaving(false);
  }

  async function deleteService(id: string) {
    if (!confirm('Xóa dịch vụ này?')) return;
    await fetch('/api/services', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setData(d => ({ ...d, services: d.services.filter(s => s.id !== id) }));
    showMessage('✅ Đã xóa dịch vụ!');
  }

  async function logout() {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin');
  }

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'shop', label: 'Thông tin quán', icon: '🏪' },
    { key: 'services', label: 'Dịch vụ', icon: '✂️' },
    { key: 'posts', label: 'Bài viết', icon: '📝' },
    { key: 'gallery', label: 'Thư viện ảnh', icon: '🖼️' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f4ee]">
      {/* Header */}
      <header className="bg-[#1a1a1a] shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✂️</span>
            <div>
              <h1 className="text-white font-bold">Trang Quản Trị</h1>
              <p className="text-gray-400 text-xs">Tiệm Cắt Tóc Ba</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-gray-400 hover:text-[#c9a84c] text-sm transition-colors">
              👁️ Xem trang chủ
            </a>
            <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors">
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Toast */}
      {message && (
        <div className="fixed top-20 right-4 z-50 bg-[#1a1a1a] text-white px-6 py-3 rounded-lg shadow-xl text-sm font-medium">
          {message}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-2 shadow-sm overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-[#1a1a1a] text-[#c9a84c]'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Shop Info Tab */}
        {activeTab === 'shop' && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-black text-[#1a1a1a] mb-6">Thông tin quán</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Tên quán', type: 'text' },
                { key: 'slogan', label: 'Slogan', type: 'text' },
                { key: 'phone', label: 'Số điện thoại', type: 'text' },
                { key: 'hours', label: 'Giờ mở cửa', type: 'text' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">{field.label}</label>
                  <input
                    type={field.type}
                    value={data.shop[field.key as keyof typeof data.shop]}
                    onChange={e => setData(d => ({ ...d, shop: { ...d.shop, [field.key]: e.target.value } }))}
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#c9a84c] transition-colors"
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Địa chỉ</label>
                <input
                  type="text"
                  value={data.shop.address}
                  onChange={e => setData(d => ({ ...d, shop: { ...d.shop, address: e.target.value } }))}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#c9a84c] transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Mô tả quán</label>
                <textarea
                  value={data.shop.description}
                  onChange={e => setData(d => ({ ...d, shop: { ...d.shop, description: e.target.value } }))}
                  rows={3}
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#c9a84c] transition-colors resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Ảnh nền trang chủ (Hero)</label>
                {data.shop.heroImage && (
                  <div className="relative h-40 w-full rounded-lg overflow-hidden mb-3 border-2 border-gray-200">
                    <Image src={data.shop.heroImage} alt="Hero" fill className="object-cover" />
                  </div>
                )}
                <input ref={heroImageRef} type="file" accept="image/*" onChange={handleHeroUpload} className="hidden" />
                <button
                  onClick={() => heroImageRef.current?.click()}
                  disabled={uploading}
                  className="border-2 border-dashed border-[#c9a84c] text-[#c9a84c] px-6 py-3 rounded-lg hover:bg-[#c9a84c]/10 transition-colors disabled:opacity-60"
                >
                  {uploading ? 'Đang tải...' : '📷 Chọn ảnh nền'}
                </button>
              </div>
            </div>
            <button
              onClick={saveShop}
              disabled={saving}
              className="mt-6 bg-[#c9a84c] text-[#1a1a1a] px-8 py-3 rounded-lg font-bold hover:bg-[#b8903a] transition-colors disabled:opacity-60"
            >
              {saving ? 'Đang lưu...' : '💾 Lưu thông tin'}
            </button>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#1a1a1a] mb-6">
                {editingService ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'name', label: 'Tên dịch vụ', placeholder: 'Cắt tóc nam' },
                  { key: 'price', label: 'Giá', placeholder: '50.000đ' },
                  { key: 'description', label: 'Mô tả', placeholder: 'Mô tả ngắn gọn...' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">{field.label}</label>
                    <input
                      type="text"
                      value={editingService ? editingService[field.key as keyof typeof editingService] : newService[field.key as keyof typeof newService]}
                      onChange={e => {
                        if (editingService) {
                          setEditingService(s => s ? { ...s, [field.key]: e.target.value } : s);
                        } else {
                          setNewService(s => ({ ...s, [field.key]: e.target.value }));
                        }
                      }}
                      placeholder={field.placeholder}
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#c9a84c] transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    if (editingService) {
                      saveService({ name: editingService.name, price: editingService.price, description: editingService.description }, editingService.id);
                    } else {
                      saveService(newService);
                    }
                  }}
                  disabled={saving}
                  className="bg-[#c9a84c] text-[#1a1a1a] px-6 py-3 rounded-lg font-bold hover:bg-[#b8903a] transition-colors disabled:opacity-60"
                >
                  {saving ? 'Đang lưu...' : editingService ? '💾 Cập nhật' : '➕ Thêm dịch vụ'}
                </button>
                {editingService && (
                  <button onClick={() => setEditingService(null)} className="px-6 py-3 rounded-lg border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    Hủy
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-[#1a1a1a] mb-4">Danh sách dịch vụ ({data.services.length})</h3>
              <div className="space-y-3">
                {data.services.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 bg-[#f8f4ee] rounded-lg">
                    <div>
                      <span className="font-bold text-[#1a1a1a]">{service.name}</span>
                      <span className="ml-3 text-[#c9a84c] font-semibold">{service.price}</span>
                      <p className="text-gray-500 text-sm mt-1">{service.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingService(service)} className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors">Sửa</button>
                      <button onClick={() => deleteService(service.id)} className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors">Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#1a1a1a] mb-6">
                {editingPost ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Tiêu đề</label>
                  <input
                    type="text"
                    value={editingPost ? editingPost.title : newPost.title}
                    onChange={e => editingPost ? setEditingPost(p => p ? { ...p, title: e.target.value } : p) : setNewPost(p => ({ ...p, title: e.target.value }))}
                    placeholder="Tiêu đề bài viết..."
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#c9a84c] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Nội dung</label>
                  <textarea
                    value={editingPost ? editingPost.content : newPost.content}
                    onChange={e => editingPost ? setEditingPost(p => p ? { ...p, content: e.target.value } : p) : setNewPost(p => ({ ...p, content: e.target.value }))}
                    rows={6}
                    placeholder="Nội dung bài viết..."
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#c9a84c] transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Ảnh bài viết</label>
                  {(editingPost?.image || newPost.image) && (
                    <div className="relative h-40 w-full md:w-64 rounded-lg overflow-hidden mb-3 border-2 border-gray-200">
                      <Image src={editingPost?.image || newPost.image} alt="Post" fill className="object-cover" />
                    </div>
                  )}
                  <input ref={postImageRef} type="file" accept="image/*" onChange={handlePostImageUpload} className="hidden" />
                  <button
                    onClick={() => postImageRef.current?.click()}
                    disabled={uploading}
                    className="border-2 border-dashed border-[#c9a84c] text-[#c9a84c] px-6 py-3 rounded-lg hover:bg-[#c9a84c]/10 transition-colors disabled:opacity-60"
                  >
                    {uploading ? 'Đang tải...' : '📷 Chọn ảnh'}
                  </button>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    if (editingPost) {
                      savePost({ title: editingPost.title, content: editingPost.content, image: editingPost.image }, editingPost.id);
                    } else {
                      savePost(newPost);
                    }
                  }}
                  disabled={saving}
                  className="bg-[#c9a84c] text-[#1a1a1a] px-8 py-3 rounded-lg font-bold hover:bg-[#b8903a] transition-colors disabled:opacity-60"
                >
                  {saving ? 'Đang lưu...' : editingPost ? '💾 Cập nhật' : '📝 Đăng bài'}
                </button>
                {editingPost && (
                  <button onClick={() => setEditingPost(null)} className="px-6 py-3 rounded-lg border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    Hủy
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-[#1a1a1a] mb-4">Bài viết đã đăng ({data.posts.length})</h3>
              <div className="space-y-4">
                {data.posts.map((post) => (
                  <div key={post.id} className="flex gap-4 p-4 bg-[#f8f4ee] rounded-lg">
                    {post.image && (
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                        <Image src={post.image} alt={post.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#1a1a1a] truncate">{post.title}</h4>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{post.content}</p>
                      <p className="text-[#c9a84c] text-xs mt-1">
                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={() => setEditingPost(post)} className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 rounded hover:bg-blue-50 transition-colors">Sửa</button>
                      <button onClick={() => deletePost(post.id)} className="text-red-600 hover:text-red-800 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition-colors">Xóa</button>
                    </div>
                  </div>
                ))}
                {data.posts.length === 0 && (
                  <p className="text-gray-400 text-center py-8">Chưa có bài viết nào</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-black text-[#1a1a1a] mb-6">Thêm ảnh vào thư viện</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#1a1a1a] mb-2">Chú thích ảnh (tùy chọn)</label>
                  <input
                    type="text"
                    value={newCaption}
                    onChange={e => setNewCaption(e.target.value)}
                    placeholder="Mô tả ảnh..."
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-[#c9a84c] transition-colors"
                  />
                </div>
                <div>
                  <input ref={galleryImageRef} type="file" accept="image/*" onChange={addGalleryImage} className="hidden" />
                  <button
                    onClick={() => galleryImageRef.current?.click()}
                    disabled={uploading}
                    className="border-2 border-dashed border-[#c9a84c] text-[#c9a84c] px-8 py-4 rounded-xl hover:bg-[#c9a84c]/10 transition-colors disabled:opacity-60 w-full text-center"
                  >
                    <div className="text-3xl mb-2">📷</div>
                    <div className="font-semibold">{uploading ? 'Đang tải ảnh lên...' : 'Nhấn để chọn ảnh'}</div>
                    <div className="text-sm text-gray-400 mt-1">JPG, PNG, WebP (tối đa 10MB)</div>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-[#1a1a1a] mb-4">Thư viện ảnh ({data.gallery.length} ảnh)</h3>
              {data.gallery.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Chưa có ảnh nào trong thư viện</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data.gallery.map((item) => (
                    <div key={item.id} className="relative group">
                      <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                        <Image src={item.url} alt={item.caption || ''} fill className="object-cover" />
                      </div>
                      {item.caption && (
                        <p className="text-xs text-gray-500 mt-1 truncate">{item.caption}</p>
                      )}
                      <button
                        onClick={() => deleteGallery(item.id)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
