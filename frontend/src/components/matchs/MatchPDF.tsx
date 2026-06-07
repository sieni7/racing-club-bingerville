import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10 },
  title: { fontSize: 18, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  section: { marginBottom: 15 },
  sectionTitle: { fontSize: 14, marginBottom: 8, backgroundColor: '#e5e7eb', padding: 4, fontWeight: 'bold' },
  row: { flexDirection: 'row', marginBottom: 4 },
  label: { width: 100, fontWeight: 'bold' },
  value: { flex: 1 },
  table: { marginTop: 10 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ccc', paddingVertical: 4 },
  tableHeader: { fontWeight: 'bold', backgroundColor: '#f3f4f6' },
  colNumero: { width: 40 },
  colNom: { width: 120 },
  colRole: { width: 80 },
});

export const MatchPDF = ({ match, titulaires, remplacants, events }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Feuille de match</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>
        <View style={styles.row}><Text style={styles.label}>Adversaire:</Text><Text style={styles.value}>{match.adversaire}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Date:</Text><Text style={styles.value}>{new Date(match.date_heure).toLocaleDateString('fr-FR')}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Heure:</Text><Text style={styles.value}>{new Date(match.date_heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</Text></View>
        <View style={styles.row}><Text style={styles.label}>Lieu:</Text><Text style={styles.value}>{match.lieu === 'DOMICILE' ? 'Domicile' : 'Extérieur'}</Text></View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Composition</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.colNumero}>N°</Text>
            <Text style={styles.colNom}>Joueur</Text>
            <Text style={styles.colRole}>Statut</Text>
          </View>
          {[...titulaires, ...remplacants].map((c: any) => (
            <View key={c.id} style={styles.tableRow}>
              <Text style={styles.colNumero}>{c.numero}</Text>
              <Text style={styles.colNom}>{c.prenom} {c.nom}</Text>
              <Text style={styles.colRole}>{c.composition_role}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Événements</Text>
        {events.map((e: any, idx: number) => (
          <View key={idx} style={styles.row}>
            <Text style={styles.label}>{e.minute}'</Text>
            <Text style={styles.value}>{e.joueur_nom} - {e.type_evenement}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);
