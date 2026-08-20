import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  Search, 
  ChevronRight, 
  X, 
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { BlogPost } from '../types';

export const TechBlogSection: React.FC = () => {
  const { blogPosts } = useSiteData();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');

  const dynamicTags = Array.from(
    new Set(
      blogPosts
        .flatMap((p) => p.tags || [])
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
    )
  );
  const allTags = ['all', ...dynamicTags];

  const getAuthorName = (author: any): string => {
    if (!author) return 'Équipe Vitech Africa';
    if (typeof author === 'string') return author;
    if (typeof author === 'object' && author.name) return String(author.name);
    return 'Équipe Vitech Africa';
  };

  const getAuthorRole = (post: any): string => {
    if (post.authorRole) return String(post.authorRole);
    if (post.author && typeof post.author === 'object' && post.author.role) return String(post.author.role);
    return 'Expert Ingénierie & Systèmes';
  };

  const getAuthorAvatar = (post: any): string | undefined => {
    if (post.authorAvatar) return post.authorAvatar;
    if (post.author && typeof post.author === 'object' && post.author.avatar) return post.author.avatar;
    return undefined;
  };

  const filteredPosts = blogPosts.filter(post => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
                          post.title.toLowerCase().includes(q) ||
                          post.excerpt.toLowerCase().includes(q) ||
                          (post.category && post.category.toLowerCase().includes(q)) ||
                          (post.tags && post.tags.some(t => t.toLowerCase().includes(q)));
    const matchesTag = selectedTag === 'all' || post.tags?.some(t => t.toLowerCase() === selectedTag.toLowerCase());
    return matchesSearch && matchesTag;
  });

  return (
    <section id="blog" className="py-24 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              <span>Blog &amp; Analyses d'Ingénierie</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Publications &amp; Retours d'{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Expérience Terrain
              </span>
            </h2>
            <p className="text-slate-300 text-base">
              Nos ingénieurs et directeurs de projet partagent leurs analyses architecturales, bonnes pratiques de code et retours sur le déploiement de solutions panafricaines.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
                selectedTag === tag
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tag === 'all' ? 'Tous les Thèmes' : tag}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => {
            const authorName = getAuthorName(post.author);
            const authorRole = getAuthorRole(post);

            return (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-slate-900/90 rounded-3xl border border-slate-800/90 hover:border-cyan-500/50 p-6 flex flex-col justify-between space-y-6 shadow-xl hover:shadow-cyan-950/20 transition-all duration-300 cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="px-2.5 py-1 rounded-full bg-slate-950 border border-slate-800 text-cyan-400 font-mono">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-800/80">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-950 text-[11px] font-mono text-slate-400 border border-slate-800"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div>
                      <div className="font-semibold text-slate-200">{authorName}</div>
                      <div className="text-[11px] text-slate-500">{authorRole}</div>
                    </div>
                    <div className="flex items-center gap-1 text-cyan-400 font-bold group-hover:translate-x-1 transition-transform">
                      <span>Lire</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Full Article Modal Reader */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 font-bold border border-cyan-800">
                  {selectedPost.category}
                </span>
                <span>{selectedPost.date}</span>
                <span>•</span>
                <span>{selectedPost.readTime} de lecture</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                {selectedPost.title}
              </h2>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <div className="flex items-center space-x-3">
                  {getAuthorAvatar(selectedPost) && (
                    <img 
                      src={getAuthorAvatar(selectedPost)} 
                      alt={getAuthorName(selectedPost.author)}
                      className="w-10 h-10 rounded-full object-cover border border-cyan-500/40"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div>
                    <div className="font-bold text-white text-sm">{getAuthorName(selectedPost.author)}</div>
                    <div className="text-xs text-slate-400">{getAuthorRole(selectedPost)}</div>
                  </div>
                </div>
                {selectedPost.tags && selectedPost.tags.length > 0 && (
                  <div className="text-xs text-cyan-400 font-mono hidden sm:block">
                    {selectedPost.tags.join(' • ')}
                  </div>
                )}
              </div>

              <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                <p className="text-base text-slate-200 font-medium italic border-l-2 border-cyan-400 pl-4">
                  {selectedPost.excerpt}
                </p>
                <div className="pt-4 text-slate-300 space-y-4 whitespace-pre-line">
                  {selectedPost.content || selectedPost.excerpt}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-6 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Fermer la publication
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
