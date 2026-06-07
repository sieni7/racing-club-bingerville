import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

interface Section {
  id: string;
  section_key: string;
  title: string;
  content: string | null;
  is_enabled: boolean;
  display_order: number;
}

const DYNAMIC_SECTIONS = ['hero', 'kpis', 'next_match', 'recent_results', 'top_scorers'];

const Skeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm animate-pulse">
    <div className="flex justify-between items-center">
      <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40" />
      <div className="h-6 w-11 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </div>
  </div>
);

export const AdminHomepage = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('site_sections')
      .select('*')
      .order('display_order')
      .then(({ data }) => {
        if (data) {
          setSections(data);
          const initialDrafts: Record<string, string> = {};
          data.forEach((s: Section) => { initialDrafts[s.id] = s.content || ''; });
          setDrafts(initialDrafts);
        }
        setLoading(false);
      });
  }, []);

  const toggleSection = async (section: Section) => {
    const next = !section.is_enabled;
    const { error } = await supabase
      .from('site_sections')
      .update({ is_enabled: next, updated_at: new Date().toISOString() })
      .eq('id', section.id);

    if (!error) {
      setSections((prev) =>
        prev.map((s) => (s.id === section.id ? { ...s, is_enabled: next } : s))
      );
      toast.success(`"${section.title}" ${next ? 'activée' : 'désactivée'}`);
    }
  };

  const saveContent = async (section: Section) => {
    setSaving(section.id);
    const { error } = await supabase
      .from('site_sections')
      .update({
        content: drafts[section.id] || null,
        updated_at: new Date().toISOString(),
        updated_by: (await supabase.auth.getUser()).data.user?.id,
      })
      .eq('id', section.id);

    if (!error) {
      setSections((prev) =>
        prev.map((s) => (s.id === section.id ? { ...s, content: drafts[section.id] } : s))
      );
      toast.success('Contenu sauvegardé');
    } else {
      toast.error('Erreur lors de la sauvegarde');
    }
    setSaving(null);
  };

  const isDirty = (section: Section) =>
    (drafts[section.id] || '') !== (section.content || '');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Gestion de la page d'accueil</h1>

      <div className="space-y-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
          : sections.map((section) => (
              <div
                key={section.id}
                className="bg-white dark:bg-gray-900 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="flex justify-between items-center px-6 py-4">
                  <div>
                    <h3 className="font-medium">{section.title}</h3>
                    {DYNAMIC_SECTIONS.includes(section.section_key) && (
                      <p className="text-xs text-gray-400 mt-0.5">Données dynamiques — non éditables ici</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleSection(section)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      section.is_enabled ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                        section.is_enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {!DYNAMIC_SECTIONS.includes(section.section_key) && (
                  <div className="px-6 pb-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                    <textarea
                      rows={3}
                      value={drafts[section.id] || ''}
                      onChange={(e) =>
                        setDrafts((prev) => ({ ...prev, [section.id]: e.target.value }))
                      }
                      placeholder="Contenu personnalisé (optionnel)"
                      className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 bg-transparent resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => saveContent(section)}
                        disabled={!isDirty(section) || saving === section.id}
                        className="flex items-center gap-2 text-sm bg-primary text-white px-4 py-1.5 rounded-lg disabled:opacity-40 transition-opacity"
                      >
                        <Save size={14} />
                        {saving === section.id ? 'Sauvegarde...' : 'Sauvegarder'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
      </div>
    </div>
  );
};

