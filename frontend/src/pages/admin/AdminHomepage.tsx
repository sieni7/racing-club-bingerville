import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, AlertCircle, Layout } from 'lucide-react';

interface SiteSection {
  id: string;
  section_key: string;
  title: string;
  is_enabled: boolean;
  display_order: number;
}

export default function AdminHomepage() {
  const [sections, setSections] = useState<SiteSection[]>([]);
  const [originalSections, setOriginalSections] = useState<SiteSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('site_sections')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSections(data || []);
      setOriginalSections(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ type: 'error', text: 'Impossible de charger les sections.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (id: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, is_enabled: !s.is_enabled } : s));
  };

  const hasChanges = JSON.stringify(sections) !== JSON.stringify(originalSections);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      // Upsert sections
      const { error } = await supabase
        .from('site_sections')
        .upsert(sections.map(({ id, section_key, title, is_enabled, display_order }) => ({
          id, section_key, title, is_enabled, display_order
        })));

      if (error) throw error;
      
      setOriginalSections([...sections]);
      setMessage({ type: 'success', text: 'Les modifications ont été sauvegardées avec succès.' });
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 w-1/3 rounded mb-8"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Layout size={24} className="text-primary" />
            Gestion de l'Accueil
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Activez ou désactivez les sections visibles sur la page d'accueil publique.</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            hasChanges && !isSaving
              ? 'bg-primary hover:bg-primary-dark text-white shadow-md' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          <Save size={18} />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' 
          : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
        }`}>
          <AlertCircle size={20} />
          <p>{message.text}</p>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {sections.map((section) => (
            <li key={section.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{section.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Identifiant technique : <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded text-xs">{section.section_key}</code></p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={section.is_enabled}
                  onChange={() => handleToggle(section.id)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/40 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300 w-12 hidden sm:block">
                  {section.is_enabled ? 'Visible' : 'Masqué'}
                </span>
              </label>
            </li>
          ))}
          {sections.length === 0 && (
            <li className="p-6 text-center text-gray-500">Aucune section trouvée dans la base de données. Exécutez la migration SQL.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
