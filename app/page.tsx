import { readData } from '@/lib/data';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const data = readData();
  const { shop, services, posts, gallery } = data;

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#1a1a1a]/95 backdrop-blur-sm shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✂️</span>
            <span className="text-white font-bold text-xl">{shop.name}</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {['Trang chủ', 'Dịch vụ', 'Tin tức', 'Thư viện', 'Liên hệ'].map((item, i) => {
              const hrefs = ['#home', '#services', '#posts', '#gallery', '#contact'];
              return (
                <a key={i} href={hrefs[i]} className="text-gray-300 hover:text-[#c9a84c] transition-colors duration-300 text-sm font-medium">
                  {item}
                </a>
              );
            })}
          </div>
          <a href="#contact" className="bg-[#c9a84c] text-[#1a1a1a] px-4 py-2 rounded text-sm font-bold hover:bg-[#b8903a] transition-colors">
            Đặt lịch
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center bg-[#1a1a1a] overflow-hidden">
        {shop.heroImage ? (
          <div className="absolute inset-0">
            <Image src={shop.heroImage} alt="Hero" fill className="object-cover opacity-40" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2d2020] to-[#1a1a1a]" />
        )}

        <div className="absolute top-20 right-20 w-64 h-64 border border-[#c9a84c]/20 rounded-full" />
        <div className="absolute top-32 right-32 w-40 h-40 border border-[#c9a84c]/10 rounded-full" />
        <div className="absolute bottom-20 left-20 w-48 h-48 border border-[#c9a84c]/15 rounded-full" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#c9a84c] rounded-full flex items-center justify-center text-3xl shadow-2xl">
              ✂️
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight">
            {shop.name}
          </h1>
          <div className="w-24 h-1 bg-[#c9a84c] mx-auto mb-6" />
          <p className="text-[#c9a84c] text-xl md:text-2xl font-light italic mb-6">
            &ldquo;{shop.slogan}&rdquo;
          </p>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            {shop.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#services" className="bg-[#c9a84c] text-[#1a1a1a] px-8 py-4 rounded font-bold text-lg hover:bg-[#b8903a] transition-all duration-300 hover:scale-105">
              Xem dịch vụ
            </a>
            <a href="#contact" className="border-2 border-[#c9a84c] text-[#c9a84c] px-8 py-4 rounded font-bold text-lg hover:bg-[#c9a84c] hover:text-[#1a1a1a] transition-all duration-300">
              Liên hệ ngay
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#c9a84c] rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-[#c9a84c] rounded-full" />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[#c9a84c] py-8">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { number: '30+', label: 'Năm kinh nghiệm' },
            { number: '5000+', label: 'Khách hàng' },
            { number: '6', label: 'Dịch vụ' },
            { number: '100%', label: 'Hài lòng' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-black text-[#1a1a1a]">{stat.number}</div>
              <div className="text-[#1a1a1a]/70 text-sm font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] font-semibold text-sm uppercase tracking-widest mb-2">Dịch vụ của chúng tôi</p>
            <h2 className="text-4xl font-black text-[#1a1a1a] mb-4">Bảng Giá Dịch Vụ</h2>
            <div className="section-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-[#f8f4ee] border border-gray-100 rounded-xl p-6 card-hover group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center text-2xl group-hover:bg-[#c9a84c] transition-colors duration-300">
                    ✂️
                  </div>
                  <span className="text-[#c9a84c] font-black text-xl">{service.price}</span>
                </div>
                <h3 className="font-bold text-[#1a1a1a] text-lg mb-2">{service.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Section */}
      {posts.length > 0 && (
        <section id="posts" className="py-20 bg-[#f8f4ee]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-[#c9a84c] font-semibold text-sm uppercase tracking-widest mb-2">Cập nhật mới nhất</p>
              <h2 className="text-4xl font-black text-[#1a1a1a] mb-4">Tin Tức & Giới Thiệu</h2>
              <div className="section-divider" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm card-hover">
                  {post.image ? (
                    <div className="relative h-48 overflow-hidden">
                      <Image src={post.image} alt={post.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-[#1a1a1a] to-[#333] flex items-center justify-center">
                      <span className="text-5xl">✂️</span>
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-[#c9a84c] text-xs font-semibold mb-2">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h3 className="font-bold text-[#1a1a1a] text-lg mb-3 leading-snug">{post.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{post.content}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {gallery.length > 0 && (
        <section id="gallery" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-[#c9a84c] font-semibold text-sm uppercase tracking-widest mb-2">Hình ảnh quán</p>
              <h2 className="text-4xl font-black text-[#1a1a1a] mb-4">Thư Viện Ảnh</h2>
              <div className="section-divider" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div key={item.id} className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer">
                  <Image src={item.url} alt={item.caption || 'Ảnh quán'} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  {item.caption && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <p className="text-white text-sm font-medium">{item.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-20 bg-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] font-semibold text-sm uppercase tracking-widest mb-2">Tại sao chọn chúng tôi</p>
            <h2 className="text-4xl font-black text-white mb-4">Cam Kết Của Chúng Tôi</h2>
            <div className="section-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '👨‍🎨', title: 'Tay nghề cao', desc: 'Hơn 30 năm kinh nghiệm trong nghề, đảm bảo mỗi kiểu tóc đều hoàn hảo.' },
              { icon: '💰', title: 'Giá cả hợp lý', desc: 'Mức giá thân thiện, phù hợp với mọi đối tượng khách hàng.' },
              { icon: '❤️', title: 'Phục vụ tận tâm', desc: 'Lắng nghe và tư vấn kiểu tóc phù hợp với từng khuôn mặt.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-8 border border-[#c9a84c]/20 rounded-xl hover:border-[#c9a84c]/60 transition-colors duration-300 group">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-[#c9a84c] transition-colors">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#f8f4ee]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <p className="text-[#c9a84c] font-semibold text-sm uppercase tracking-widest mb-2">Liên hệ</p>
            <h2 className="text-4xl font-black text-[#1a1a1a] mb-4">Tìm Chúng Tôi</h2>
            <div className="section-divider" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '📍', title: 'Địa chỉ', value: shop.address },
              { icon: '📞', title: 'Điện thoại', value: shop.phone },
              { icon: '🕐', title: 'Giờ mở cửa', value: shop.hours },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-8 text-center shadow-sm card-hover">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-[#1a1a1a] text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] py-10 border-t border-[#c9a84c]/20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-2xl">✂️</span>
            <span className="text-white font-bold text-xl">{shop.name}</span>
          </div>
          <p className="text-gray-500 text-sm mb-4">&ldquo;{shop.slogan}&rdquo;</p>
          <p className="text-gray-600 text-xs">© {new Date().getFullYear()} {shop.name}. All rights reserved.</p>
          <div className="mt-4">
            <Link href="/admin" className="text-gray-600 text-xs hover:text-[#c9a84c] transition-colors">
              Quản trị
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
