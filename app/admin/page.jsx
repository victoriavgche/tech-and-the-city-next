'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Edit3,
  Loader2,
  Plus,
  RefreshCcw,
  Trash2,
  Upload,
  XCircle,
} from 'lucide-react';

const TABS = [
  { id: 'articles', label: 'Articles' },
  { id: 'events', label: 'Events' },
];

const STATUS_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'published', label: 'Published' },
  { id: 'draft', label: 'Drafts' },
];

const emptyArticle = {
  title: '',
  slug: '',
  excerpt: '',
  date: new Date().toISOString().slice(0, 10),
  tags: '',
  image: '',
  body: '',
  published: false,
};

const emptyEvent = {
  ...emptyArticle,
  location: '',
  startsAt: '',
  endsAt: '',
};

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function formatDateLabel(date) {
  if (!date) return '—';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return date;
  }
  return parsed.toLocaleDateString();
}

function tagsToString(tags) {
  if (Array.isArray(tags)) {
    return tags.join(', ');
  }
  if (typeof tags === 'string') {
    return tags;
  }
  return '';
}

function normaliseBody(body) {
  return body?.replace(/\r\n/g, '\n') ?? '';
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('articles');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [articles, setArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState({ articles: false, events: false });
  const [form, setForm] = useState({
    type: 'articles',
    mode: 'create',
    values: emptyArticle,
    slugLocked: false,
    originalSlug: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadArticles();
    loadEvents();
  }, []);

  useEffect(() => {
    if (activeTab === 'articles' && form.type !== 'articles') {
      setForm({ type: 'articles', mode: 'create', values: emptyArticle, slugLocked: false, originalSlug: null });
    } else if (activeTab === 'events' && form.type !== 'events') {
      setForm({ type: 'events', mode: 'create', values: emptyEvent, slugLocked: false, originalSlug: null });
    }
  }, [activeTab]);

  const filteredArticles = useMemo(() => {
    return filterItems(articles, search, statusFilter);
  }, [articles, search, statusFilter]);

  const filteredEvents = useMemo(() => {
    return filterItems(events, search, statusFilter);
  }, [events, search, statusFilter]);

  const currentItems = activeTab === 'articles' ? filteredArticles : filteredEvents;

  const handleTitleChange = (value) => {
    setForm((prev) => {
      const nextValues = { ...prev.values, title: value };
      if (!prev.slugLocked) {
        nextValues.slug = slugify(value);
      }
      return { ...prev, values: nextValues };
    });
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [field]: value,
      },
    }));
  };

  const handleSlugChange = (value) => {
    setForm((prev) => ({
      ...prev,
      slugLocked: true,
      values: {
        ...prev.values,
        slug: value.toLowerCase(),
      },
    }));
  };

  async function loadArticles() {
    setLoading((state) => ({ ...state, articles: true }));
    try {
      const response = await fetch('/api/admin/articles');
      if (!response.ok) throw new Error('Failed to fetch articles');
      const data = await response.json();
      setArticles(Array.isArray(data) ? data.map(prepareItemForState) : []);
    } catch (error) {
      showToast('Failed to load articles', 'error');
      console.error(error);
    } finally {
      setLoading((state) => ({ ...state, articles: false }));
    }
  }

  async function loadEvents() {
    setLoading((state) => ({ ...state, events: true }));
    try {
      const response = await fetch('/api/admin/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(Array.isArray(data) ? data.map(prepareItemForState) : []);
    } catch (error) {
      showToast('Failed to load events', 'error');
      console.error(error);
    } finally {
      setLoading((state) => ({ ...state, events: false }));
    }
  }

  function prepareItemForState(item) {
    return {
      ...item,
      body: normaliseBody(item.body),
      tags: Array.isArray(item.tags) ? item.tags : tagsToString(item.tags).split(',').map((tag) => tag.trim()).filter(Boolean),
    };
  }

  function resetForm(type = activeTab) {
    if (type === 'events') {
      setForm({ type: 'events', mode: 'create', values: emptyEvent, slugLocked: false, originalSlug: null });
    } else {
      setForm({ type: 'articles', mode: 'create', values: emptyArticle, slugLocked: false, originalSlug: null });
    }
  }

  function showToast(message, variant = 'success') {
    setToast({ message, variant });
    setTimeout(() => setToast(null), 4000);
  }

  function onEdit(item) {
    if (activeTab === 'events') {
      setForm({
        type: 'events',
        mode: 'edit',
        values: {
          ...emptyEvent,
          ...item,
          tags: tagsToString(item.tags),
          body: normaliseBody(item.body),
        },
        slugLocked: true,
        originalSlug: item.slug,
      });
    } else {
      setForm({
        type: 'articles',
        mode: 'edit',
        values: {
          ...emptyArticle,
          ...item,
          tags: tagsToString(item.tags),
          body: normaliseBody(item.body),
        },
        slugLocked: true,
        originalSlug: item.slug,
      });
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const payload = buildPayload(form);
      const urlBase = form.type === 'events' ? '/api/admin/events' : '/api/admin/articles';
      let response;

      if (form.mode === 'edit') {
        response = await fetch(`${urlBase}/${encodeURIComponent(form.originalSlug ?? form.values.slug)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(urlBase, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = result?.error || 'Something went wrong';
        throw new Error(message);
      }

      showToast(form.mode === 'edit' ? 'Saved successfully' : 'Created successfully');
      resetForm(form.type);
      if (form.type === 'events') {
        await loadEvents();
      } else {
        await loadArticles();
      }
    } catch (error) {
      console.error('Save failed', error);
      showToast(error.message || 'Failed to save changes', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  async function togglePublished(item) {
    const type = activeTab === 'events' ? 'events' : 'articles';
    try {
      const response = await fetch(`/api/admin/${type}/${encodeURIComponent(item.slug)}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !item.published }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to update status');
      }
      showToast(result.published ? 'Published' : 'Unpublished');
      if (type === 'events') {
        await loadEvents();
      } else {
        await loadArticles();
      }
    } catch (error) {
      console.error('Toggle publish failed', error);
      showToast(error.message || 'Failed to update status', 'error');
    }
  }

  async function deleteItem(item) {
    if (!window.confirm(`Delete ${item.title}? This cannot be undone.`)) {
      return;
    }

    const type = activeTab === 'events' ? 'events' : 'articles';
    try {
      const response = await fetch(`/api/admin/${type}/${encodeURIComponent(item.slug)}`, {
        method: 'DELETE',
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to delete item');
      }
      showToast('Deleted successfully');
      if (type === 'events') {
        await loadEvents();
      } else {
        await loadArticles();
      }
      resetForm(type);
    } catch (error) {
      console.error('Delete failed', error);
      showToast(error.message || 'Failed to delete', 'error');
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 lg:flex-row">
        <section className="flex-1 space-y-6">
          <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Admin dashboard</h1>
              <p className="text-slate-400">Manage articles and events published on the site.</p>
            </div>
            <button
              onClick={() => resetForm(activeTab)}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-slate-900 shadow transition hover:bg-emerald-400"
            >
              <Plus className="h-4 w-4" />
              New {activeTab === 'articles' ? 'article' : 'event'}
            </button>
          </header>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-900/60 p-4 ring-1 ring-slate-800">
            <div className="flex gap-2 rounded-full bg-slate-800 p-1 text-sm">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-full px-4 py-2 font-medium transition ${
                    activeTab === tab.id ? 'bg-emerald-500 text-slate-900 shadow' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="flex flex-1 items-center gap-4 sm:flex-none">
              <div className="flex-1 sm:flex-none">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by title or tag..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 focus:ring"
                />
              </div>
              <div className="flex gap-2 rounded-full bg-slate-800 p-1 text-sm">
                {STATUS_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setStatusFilter(filter.id)}
                    className={`rounded-full px-3 py-2 transition ${
                      statusFilter === filter.id ? 'bg-slate-100 text-slate-900' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl bg-slate-900/60 ring-1 ring-slate-800">
            <div className="grid grid-cols-12 border-b border-slate-800 bg-slate-900/80 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <span className="col-span-5">Title</span>
              <span className="col-span-2">Slug</span>
              <span className="col-span-2">Date</span>
              <span className="col-span-1 text-center">Status</span>
              <span className="col-span-2 text-right">Actions</span>
            </div>
            <div className="divide-y divide-slate-800">
              {loading[activeTab] ? (
                <div className="flex items-center justify-center gap-2 py-12 text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Loading {activeTab}…
                </div>
              ) : currentItems.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-500">
                  No {activeTab} found. Try adjusting filters or create a new one.
                </div>
              ) : (
                currentItems.map((item) => (
                  <article key={item.slug} className="grid grid-cols-12 items-center gap-2 px-4 py-3 text-sm">
                    <div className="col-span-5">
                      <p className="font-medium text-slate-100">{item.title}</p>
                      <p className="text-xs text-slate-500">{tagsToString(item.tags)}</p>
                    </div>
                    <div className="col-span-2 truncate text-slate-400">{item.slug}</div>
                    <div className="col-span-2 text-slate-400">{formatDateLabel(item.date)}</div>
                    <div className="col-span-1 text-center">
                      {item.published ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-300">
                          <CheckCircle2 className="h-3 w-3" />
                          Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-300">
                          <XCircle className="h-3 w-3" />
                          Draft
                        </span>
                      )}
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-2 py-1 text-xs font-medium text-slate-200 transition hover:border-emerald-500/60 hover:text-emerald-300"
                      >
                        <Edit3 className="h-3 w-3" /> Edit
                      </button>
                      <button
                        onClick={() => togglePublished(item)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-700 px-2 py-1 text-xs font-medium text-slate-200 transition hover:border-emerald-500/60 hover:text-emerald-300"
                      >
                        {item.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => deleteItem(item)}
                        className="inline-flex items-center gap-1 rounded-lg border border-red-900/70 px-2 py-1 text-xs font-medium text-red-300 transition hover:border-red-500 hover:text-red-200"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </div>
        </section>

        <aside className="w-full max-w-xl space-y-4 rounded-2xl bg-slate-900/60 p-6 shadow-xl ring-1 ring-slate-800">
          <header className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                {form.mode === 'edit' ? 'Edit' : 'Create new'} {form.type === 'events' ? 'event' : 'article'}
              </h2>
              <p className="text-sm text-slate-400">
                {form.mode === 'edit' ? 'Update the details and save to publish changes.' : 'Fill in the form to create a new entry.'}
              </p>
            </div>
            <button
              onClick={() => resetForm(form.type)}
              className="rounded-full border border-slate-700 p-2 text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
              title="Reset form"
            >
              <RefreshCcw className="h-4 w-4" />
            </button>
          </header>

          {toast && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                toast.variant === 'error'
                  ? 'border-red-500/40 bg-red-500/10 text-red-200'
                  : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
              }`}
            >
              {toast.message}
            </div>
          )}

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">Title</label>
              <input
                required
                value={form.values.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 focus:ring"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">Slug</label>
                <input
                  required
                  value={form.values.slug}
                  onChange={(event) => handleSlugChange(slugify(event.target.value))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 focus:ring"
                />
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  <Calendar className="h-3 w-3" /> Date
                </label>
                <input
                  type="date"
                  value={form.values.date}
                  onChange={(event) => handleFieldChange('date', event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 focus:ring"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <input
                  id="published"
                  type="checkbox"
                  checked={form.values.published}
                  onChange={(event) => handleFieldChange('published', event.target.checked)}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-400"
                />
                <label htmlFor="published" className="text-sm text-slate-300">Published</label>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">Tags</label>
                <input
                  value={form.values.tags}
                  onChange={(event) => handleFieldChange('tags', event.target.value)}
                  placeholder="tech, ai"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 focus:ring"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">Excerpt</label>
              <textarea
                value={form.values.excerpt}
                onChange={(event) => handleFieldChange('excerpt', event.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 focus:ring"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">Cover image URL</label>
              <input
                value={form.values.image}
                onChange={(event) => handleFieldChange('image', event.target.value)}
                placeholder="https://…"
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 focus:ring"
              />
            </div>

            {form.type === 'events' && (
              <div className="space-y-4 rounded-lg border border-slate-800 bg-slate-950/60 p-4">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <Upload className="h-4 w-4" /> Event metadata
                </h3>
                <div className="space-y-2">
                  <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">Location</label>
                  <input
                    value={form.values.location}
                    onChange={(event) => handleFieldChange('location', event.target.value)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 focus:ring"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">Starts at</label>
                    <input
                      type="datetime-local"
                      value={form.values.startsAt}
                      onChange={(event) => handleFieldChange('startsAt', event.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 focus:ring"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">Ends at</label>
                    <input
                      type="datetime-local"
                      value={form.values.endsAt}
                      onChange={(event) => handleFieldChange('endsAt', event.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 focus:ring"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-xs font-medium uppercase tracking-wide text-slate-400">Body</label>
              <textarea
                required
                value={form.values.body}
                onChange={(event) => handleFieldChange('body', event.target.value)}
                rows={12}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-500/40 focus:ring"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              {form.mode === 'edit' && (
                <button
                  type="button"
                  onClick={() => resetForm(form.type)}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500 hover:text-slate-100"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />} {form.mode === 'edit' ? 'Save changes' : 'Create'}
              </button>
            </div>
          </form>
        </aside>
      </div>
    </main>
  );
}

function filterItems(items, search, statusFilter) {
  const text = search.trim().toLowerCase();
  return items.filter((item) => {
    const matchesSearch =
      !text ||
      item.title.toLowerCase().includes(text) ||
      tagsToString(item.tags).toLowerCase().includes(text) ||
      item.slug.toLowerCase().includes(text);
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && item.published) ||
      (statusFilter === 'draft' && !item.published);
    return matchesSearch && matchesStatus;
  });
}

function buildPayload(form) {
  const base = {
    title: form.values.title.trim(),
    slug: form.values.slug.trim(),
    excerpt: form.values.excerpt.trim(),
    date: form.values.date,
    image: form.values.image?.trim() || '',
    tags: tagsToString(form.values.tags)
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    published: Boolean(form.values.published),
    body: normaliseBody(form.values.body),
  };

  if (form.type === 'events') {
    return {
      ...base,
      location: form.values.location?.trim() || '',
      startsAt: form.values.startsAt,
      endsAt: form.values.endsAt,
    };
  }

  return base;
}
