import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { toast } from 'react-hot-toast';

interface Role {
  id: string;
  name: string;
  display_name: string;
  icon: string;
  level: number;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    club_name: 'Racing Club de Bingerville',
    active_season: '2025-2026',
    competitions: ['CHAMPIONNAT', 'COUPE', 'AMICAL'],
    notifications_email: true,
    notifications_sms: false,
    notification_email_address: 'admin@racingclub.ci'
  });

  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    fetchSettings();
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoadingRoles(true);
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('level', { ascending: false });
    
    if (error) {
      console.error('Erreur chargement rôles:', error);
    } else {
      setRoles(data || []);
    }
    setLoadingRoles(false);
  };

  const fetchSettings = async () => {
    const { data } = await supabase.from('settings').select('*');
    if (data) {
      const settingsMap: Record<string, any> = {};
      data.forEach((s) => { settingsMap[s.key] = s.value; });
      setSettings({
        club_name: settingsMap.club_name || 'Racing Club de Bingerville',
        active_season: settingsMap.active_season || '2025-2026',
        competitions: settingsMap.competitions || ['CHAMPIONNAT', 'COUPE', 'AMICAL'],
        notifications_email: settingsMap.notifications_email ?? true,
        notifications_sms: settingsMap.notifications_sms ?? false,
        notification_email_address: settingsMap.notification_email_address || 'admin@racingclub.ci'
      });
    }
  };

  const fetchUsers = async () => {
    const { data } = await supabase.from('profiles').select('id, email, role').order('email');
    if (data) setUsers(data);
  };

  const updateRole = async (userId: string, newRole: string) => {
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
    toast.success('Rôle mis à jour');
    fetchUsers();
  };

  const saveSettings = async () => {
    setLoading(true);
    const updates = [
      { key: 'club_name', value: settings.club_name },
      { key: 'active_season', value: settings.active_season },
      { key: 'competitions', value: JSON.stringify(settings.competitions) },
      { key: 'notifications_email', value: JSON.stringify(settings.notifications_email) },
      { key: 'notifications_sms', value: JSON.stringify(settings.notifications_sms) },
      { key: 'notification_email_address', value: settings.notification_email_address }
    ];
    for (const u of updates) {
      await supabase.from('settings').upsert({ key: u.key, value: u.value });
    }
    toast.success('Paramètres enregistrés');
    setLoading(false);
  };

  const toggleCompetition = (comp: string) => {
    setSettings(prev => ({
      ...prev,
      competitions: prev.competitions.includes(comp)
        ? prev.competitions.filter(c => c !== comp)
        : [...prev.competitions, comp]
    }));
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">⚙️ Paramètres</h1>
        <Button onClick={saveSettings} isLoading={loading}>Enregistrer</Button>
      </div>

      <div className="space-y-6">
        {/* Général */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">📌 Général</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom du club</label>
              <input
                type="text"
                value={settings.club_name}
                onChange={(e) => setSettings({ ...settings, club_name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-white/5 border-white/10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Saison active</label>
              <select
                value={settings.active_season}
                onChange={(e) => setSettings({ ...settings, active_season: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-white/5 border-white/10"
              >
                <option>2024-2025</option>
                <option>2025-2026</option>
                <option>2026-2027</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Compétitions */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">🏆 Compétitions</h2>
          <div className="space-y-2">
            {['CHAMPIONNAT', 'COUPE', 'AMICAL'].map(comp => (
              <label key={comp} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.competitions.includes(comp)}
                  onChange={() => toggleCompetition(comp)}
                  className="w-4 h-4"
                />
                <span>{comp}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">🔔 Notifications</h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.notifications_email}
                onChange={(e) => setSettings({ ...settings, notifications_email: e.target.checked })}
                className="w-4 h-4"
              />
              <span>Email pour nouveaux matchs</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.notifications_sms}
                onChange={(e) => setSettings({ ...settings, notifications_sms: e.target.checked })}
                className="w-4 h-4"
              />
              <span>SMS pour convocations</span>
            </label>
            <div>
              <label className="block text-sm font-medium mb-1">Email de notification</label>
              <input
                type="email"
                value={settings.notification_email_address}
                onChange={(e) => setSettings({ ...settings, notification_email_address: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg bg-white/5 border-white/10"
              />
            </div>
          </div>
        </Card>

        {/* Utilisateurs */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">👥 Utilisateurs</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Rôle</th>
                  <th className="text-right py-2"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/5">
                    <td className="py-2">{u.email}</td>
                    <td className="py-2">
                      {loadingRoles ? (
                        <span className="text-gray-400">Chargement...</span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => updateRole(u.id, e.target.value)}
                          className="px-2 py-1 rounded bg-white/5 border-white/10"
                        >
                          {roles.map((role) => (
                            <option key={role.name} value={role.name}>
                              {role.display_name}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="text-right">
                      <button className="text-red-500 hover:text-red-400">❌</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button variant="secondary" className="mt-4">+ Inviter un utilisateur</Button>
        </Card>
      </div>
    </div>
  );
}

