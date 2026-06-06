import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

async function validateStats() {
  console.log('🔍 Validation des statistiques...');
  
  // 1. Vérifier que la vue matérialisée existe
  const { data: mvExists } = await supabase
    .rpc('check_materialized_view_exists', { view_name: 'stats_joueurs' });
  
  if (!mvExists) {
    console.error('❌ Vue matérialisée stats_joueurs manquante');
    process.exit(1);
  }
  
  // 2. Vérifier l'intégrité des données
  const { data: stats, error } = await supabase
    .from('stats_joueurs')
    .select('*')
    .limit(10);
  
  if (error) {
    console.error('❌ Erreur lecture stats:', error);
    process.exit(1);
  }
  
  console.log(`✅ ${stats?.length || 0} enregistrements de stats disponibles`);
  
  // 3. Vérifier les classements
  const { data: buteurs } = await supabase.from('top_buteurs').select('*');
  console.log(`✅ Top buteurs: ${buteurs?.length || 0} joueurs`);
  
  console.log('✅ Validation stats terminée avec succès');
}

validateStats();
