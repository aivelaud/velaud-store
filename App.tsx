import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Tab = 'discover' | 'games' | 'community' | 'library';
type AppItem = {
  id: string;
  name: string;
  maker: string;
  category: string;
  score: string;
  size: string;
  icon: string;
  accent: string;
  description: string;
  kind: 'app' | 'game';
};

const C = {
  bg: '#101614', surface: '#18221E', surface2: '#213029', line: '#31443B',
  text: '#F0F5F1', muted: '#AAB9B0', green: '#8BF8B3', greenDark: '#0F6240',
  blue: '#9BD7FF', orange: '#FFBE87', red: '#FFB4AB',
};

const catalog: AppItem[] = [
  { id: 'orbit', name: 'Orbit Notes', maker: 'Lumen Labs', category: 'Üretkenlik', score: '4,9', size: '28 MB', icon: '✦', accent: '#7058E8', description: 'Fikirlerini, görevlerini ve günlük notlarını sade bir çalışma alanında birleştir.', kind: 'app' },
  { id: 'mellow', name: 'Mellow', maker: 'Mellow Studio', category: 'Sağlık', score: '4,8', size: '45 MB', icon: '◒', accent: '#EF7B71', description: 'Kısa nefes egzersizleri ve günlük odak seansları ile ritmini bul.', kind: 'app' },
  { id: 'frame', name: 'Frame', maker: 'Cobalt Works', category: 'Fotoğrafçılık', score: '4,7', size: '62 MB', icon: '▣', accent: '#1D9D9A', description: 'Fotoğraflarını filtrele, düzenle ve koleksiyonlarında sakla.', kind: 'app' },
  { id: 'paper', name: 'Papertrail', maker: 'Northwind', category: 'Finans', score: '4,6', size: '36 MB', icon: '⌁', accent: '#E7A54F', description: 'Harcama takibi, hedefler ve anlaşılır aylık özetler.', kind: 'app' },
  { id: 'drift', name: 'Drift Rally', maker: 'Rosewood Games', category: 'Yarış', score: '4,8', size: '410 MB', icon: '⚑', accent: '#F06A74', description: 'Kıvrımlı pistlerde hızını ve reflekslerini test et.', kind: 'game' },
  { id: 'tiles', name: 'Tiny Tiles', maker: 'Mossy Byte', category: 'Bulmaca', score: '4,9', size: '94 MB', icon: '◇', accent: '#5B9DE6', description: 'Renkli parçaları eşleştir, sakin ama zorlayıcı seviyeleri çöz.', kind: 'game' },
  { id: 'kingdom', name: 'Kingdoms', maker: 'Nook Studio', category: 'Strateji', score: '4,5', size: '283 MB', icon: '♜', accent: '#AA7ADD', description: 'Küçük krallığını kur, kaynaklarını yönet ve keşfe çık.', kind: 'game' },
  { id: 'bloom', name: 'Bloom Garden', maker: 'Common Ground', category: 'Rahatlatıcı', score: '4,7', size: '151 MB', icon: '✿', accent: '#4FBA83', description: 'Kendi cep bahçeni tasarla ve mevsimlerle büyüt.', kind: 'game' },
];

const community = [
  { name: 'Ece K.', badge: 'Yeni uygulama', body: 'Orbit Notes için etiket tabanlı arşivleme önerisi bıraktım. Sizce klasör mü etiket mi?', likes: 36, icon: 'E' },
  { name: 'Mert A.', badge: 'İpucu', body: 'Tiny Tiles’ın 24. bölümündeki üçlü hamle için küçük bir rehber hazırladım.', likes: 112, icon: 'M' },
  { name: 'Ada S.', badge: 'Tartışma', body: 'Mobil uygulamalarda en sevdiğiniz erişilebilirlik özelliği ne?', likes: 58, icon: 'A' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('discover');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<AppItem | null>(null);
  const [installed, setInstalled] = useState<string[]>(['orbit', 'mellow']);
  const [downloads, setDownloads] = useState<Record<string, number>>({});

  const filtered = useMemo(() => catalog.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) || item.category.toLowerCase().includes(query.toLowerCase())), [query]);
  const apps = filtered.filter((item) => item.kind === 'app');
  const games = filtered.filter((item) => item.kind === 'game');

  function install(item: AppItem) {
    if (installed.includes(item.id) || downloads[item.id] !== undefined) return;
    let progress = 4;
    setDownloads((current) => ({ ...current, [item.id]: progress }));
    const timer = setInterval(() => {
      progress = Math.min(progress + 12, 100);
      if (progress === 100) {
        clearInterval(timer);
        setInstalled((current) => [...current, item.id]);
        setDownloads((current) => {
          const { [item.id]: _complete, ...remaining } = current;
          return remaining;
        });
        return;
      }
      setDownloads((current) => ({ ...current, [item.id]: progress }));
    }, 280);
  }

  const showSection = (title: string, data: AppItem[]) => (
    <View style={styles.section}>
      <View style={styles.sectionHead}><Text style={styles.sectionTitle}>{title}</Text><Text style={styles.link}>Tümünü gör</Text></View>
      <FlatList horizontal data={data} keyExtractor={(item) => item.id} showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        renderItem={({ item }) => <AppCard item={item} onPress={() => setSelected(item)} />} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}><StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View><Text style={styles.brand}>velaud</Text><Text style={styles.subtitle}>senin uygulama alanın</Text></View>
        <View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View>
      </View>

      <View style={styles.search}><Text style={styles.searchIcon}>⌕</Text><TextInput value={query} onChangeText={setQuery} placeholder="Uygulama, oyun veya kategori ara" placeholderTextColor="#83958B" style={styles.searchInput} /></View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {tab === 'discover' && <>
          <Pressable style={styles.hero} onPress={() => setSelected(catalog[0])}>
            <View style={styles.heroCopy}><Text style={styles.eyebrow}>HAFTANIN SEÇİMİ</Text><Text style={styles.heroTitle}>Az ama öz.{`\n`}Daha iyi uygulamalar.</Text><Text style={styles.heroText}>Editörlerin özenle seçtiği yeni favoriler.</Text><View style={styles.heroButton}><Text style={styles.heroButtonText}>Keşfet</Text></View></View>
            <View style={styles.heroArt}><Text style={styles.heroMark}>✦</Text></View>
          </Pressable>
          {showSection('Senin için', apps.slice(0, 4))}
          {showSection('Şimdi oyna', games)}
        </>}
        {tab === 'games' && <>
          <View style={styles.pageTitle}><Text style={styles.title}>Oyunlar</Text><Text style={styles.body}>Yeni maceralar, sakin bulmacalar ve hızlı yarışlar.</Text></View>
          <AppRows data={games} installed={installed} downloads={downloads} onOpen={setSelected} onInstall={install} />
        </>}
        {tab === 'community' && <>
          <View style={styles.pageTitle}><Text style={styles.title}>Topluluk</Text><Text style={styles.body}>Keşiflerini paylaş, öneri iste, birlikte büyü.</Text></View>
          <Pressable style={styles.postBox}><View style={styles.smallAvatar}><Text style={styles.avatarText}>A</Text></View><Text style={styles.postPlaceholder}>Bir şey paylaş...</Text><Text style={styles.plus}>＋</Text></Pressable>
          {community.map((post) => <View key={post.name} style={styles.post}><View style={styles.postHead}><View style={[styles.smallAvatar, { backgroundColor: '#315A4A' }]}><Text style={styles.avatarText}>{post.icon}</Text></View><View><Text style={styles.postName}>{post.name}</Text><Text style={styles.badge}>{post.badge}</Text></View><Text style={styles.more}>•••</Text></View><Text style={styles.postBody}>{post.body}</Text><View style={styles.postFoot}><Text style={styles.reaction}>♡  {post.likes}</Text><Text style={styles.reaction}>◌  Yanıtla</Text></View></View>)}
        </>}
        {tab === 'library' && <>
          <View style={styles.pageTitle}><Text style={styles.title}>Kitaplığın</Text><Text style={styles.body}>{installed.length} uygulama cihazında yüklü.</Text></View>
          <View style={styles.updateBanner}><View><Text style={styles.updateTitle}>{Object.keys(downloads).length ? 'İndirmeler sürüyor' : 'Her şey güncel'}</Text><Text style={styles.updateText}>{Object.keys(downloads).length ? `${Object.keys(downloads).length} uygulama hazırlanıyor` : 'Son kontrol: şimdi'}</Text></View><Text style={styles.check}>{Object.keys(downloads).length ? '↓' : '✓'}</Text></View>
          {Object.keys(downloads).length > 0 && <DownloadQueue downloads={downloads} />}
          <AppRows data={catalog.filter((item) => installed.includes(item.id))} installed={installed} downloads={downloads} onOpen={setSelected} onInstall={install} library />
        </>}
        {(tab === 'discover' && query.length > 0) && <><Text style={styles.resultLabel}>Arama sonuçları</Text><AppRows data={filtered} installed={installed} downloads={downloads} onOpen={setSelected} onInstall={install} /></>}
      </ScrollView>

      <View style={styles.nav}>
        <NavItem active={tab === 'discover'} icon="⌂" label="Keşfet" onPress={() => setTab('discover')} />
        <NavItem active={tab === 'games'} icon="♟" label="Oyunlar" onPress={() => setTab('games')} />
        <NavItem active={tab === 'community'} icon="◎" label="Topluluk" onPress={() => setTab('community')} />
        <NavItem active={tab === 'library'} icon="▤" label="Kitaplık" onPress={() => setTab('library')} />
      </View>

      <Modal visible={selected !== null} transparent animationType="slide" onRequestClose={() => setSelected(null)}>
        <View style={styles.modalShade}><View style={styles.sheet}>
          {selected && <><View style={styles.sheetHandle} /><View style={styles.detailHead}><Icon item={selected} large /><View style={styles.detailName}><Text style={styles.detailTitle}>{selected.name}</Text><Text style={styles.maker}>{selected.maker}</Text><Text style={styles.category}>{selected.category}</Text></View></View>
          <View style={styles.metrics}><Metric value={selected.score} label="puan" /><Metric value="10B+" label="indirme" /><Metric value={selected.size} label="boyut" /></View>
          <Text style={styles.description}>{selected.description}</Text>
          <Pressable style={[styles.install, installed.includes(selected.id) && styles.installed]} onPress={() => install(selected)}><Text style={[styles.installText, installed.includes(selected.id) && styles.installedText]}>{downloads[selected.id] !== undefined ? `İndiriliyor · ${downloads[selected.id]}%` : installed.includes(selected.id) ? 'Yüklü' : 'Yükle'}</Text></Pressable>
          <Pressable onPress={() => setSelected(null)} style={styles.close}><Text style={styles.closeText}>Kapat</Text></Pressable></>}
        </View></View>
      </Modal>
    </SafeAreaView>
  );
}

function Icon({ item, large = false }: { item: AppItem; large?: boolean }) { return <View style={[styles.icon, large && styles.largeIcon, { backgroundColor: item.accent }]}><Text style={[styles.iconText, large && styles.largeIconText]}>{item.icon}</Text></View>; }
function AppCard({ item, onPress }: { item: AppItem; onPress: () => void }) { return <Pressable onPress={onPress} style={styles.card}><Icon item={item} large /><Text numberOfLines={1} style={styles.cardName}>{item.name}</Text><Text numberOfLines={1} style={styles.cardMaker}>{item.maker}</Text><Text style={styles.cardScore}>★ {item.score}</Text></Pressable>; }
function AppRows({ data, installed, downloads, onOpen, onInstall, library = false }: { data: AppItem[]; installed: string[]; downloads: Record<string, number>; onOpen: (a: AppItem) => void; onInstall: (a: AppItem) => void; library?: boolean }) { return <View style={styles.rows}>{data.map((item) => <Pressable key={item.id} style={styles.row} onPress={() => onOpen(item)}><Icon item={item} /><View style={styles.rowCopy}><Text style={styles.rowName}>{item.name}</Text><Text style={styles.rowMeta}>{library ? 'Yüklü · ' : ''}{item.category} · {item.size}</Text><Text style={styles.rowScore}>★ {item.score}</Text></View><Pressable style={styles.rowAction} onPress={() => onInstall(item)}><Text style={styles.rowActionText}>{downloads[item.id] !== undefined ? `${downloads[item.id]}%` : installed.includes(item.id) ? 'Aç' : 'Yükle'}</Text></Pressable></Pressable>)}</View>; }
function DownloadQueue({ downloads }: { downloads: Record<string, number> }) { return <View style={styles.queue}>{Object.entries(downloads).map(([id, progress]) => { const item = catalog.find((candidate) => candidate.id === id); return item ? <View key={id} style={styles.queueItem}><Icon item={item} /><View style={styles.queueCopy}><View style={styles.queueHead}><Text style={styles.queueName}>{item.name}</Text><Text style={styles.queuePercent}>{progress}%</Text></View><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View><Text style={styles.queueMeta}>İndiriliyor · {item.size}</Text></View></View> : null; })}</View>; }
function NavItem({ active, icon, label, onPress }: { active: boolean; icon: string; label: string; onPress: () => void }) { return <Pressable style={[styles.navItem, active && styles.navActive]} onPress={onPress}><Text style={[styles.navIcon, active && styles.navIconActive]}>{icon}</Text><Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text></Pressable>; }
function Metric({ value, label }: { value: string; label: string }) { return <View><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricLabel}>{label}</Text></View>; }

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg }, header: { paddingHorizontal: 22, paddingTop: 14, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, brand: { color: C.text, fontSize: 25, fontWeight: '800', letterSpacing: -1 }, subtitle: { color: C.muted, fontSize: 11, marginTop: 1 }, avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.greenDark, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: C.green, fontWeight: '800' }, search: { height: 48, marginHorizontal: 18, borderRadius: 16, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }, searchIcon: { color: C.muted, fontSize: 25, marginRight: 10, marginTop: -4 }, searchInput: { flex: 1, color: C.text, fontSize: 14 }, content: { paddingTop: 18, paddingBottom: 95 }, hero: { marginHorizontal: 18, borderRadius: 24, minHeight: 210, backgroundColor: '#294F3D', overflow: 'hidden', padding: 23, flexDirection: 'row' }, heroCopy: { flex: 1, zIndex: 1 }, eyebrow: { color: C.green, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 }, heroTitle: { color: C.text, fontSize: 26, lineHeight: 30, fontWeight: '800', letterSpacing: -0.8, marginTop: 10 }, heroText: { color: '#D2E4D9', fontSize: 12, lineHeight: 17, marginTop: 8, maxWidth: 190 }, heroButton: { alignSelf: 'flex-start', backgroundColor: C.green, paddingVertical: 9, paddingHorizontal: 15, borderRadius: 12, marginTop: 15 }, heroButtonText: { color: '#123020', fontSize: 12, fontWeight: '800' }, heroArt: { position: 'absolute', right: -15, bottom: -28, width: 155, height: 155, borderRadius: 78, backgroundColor: '#71C697', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '12deg' }] }, heroMark: { color: '#203D30', fontSize: 88 }, section: { marginTop: 29 }, sectionHead: { paddingHorizontal: 20, marginBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, sectionTitle: { color: C.text, fontSize: 19, fontWeight: '800', letterSpacing: -0.4 }, link: { color: C.green, fontSize: 12, fontWeight: '700' }, horizontalList: { paddingHorizontal: 18, gap: 14 }, card: { width: 116 }, icon: { width: 54, height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }, largeIcon: { width: 110, height: 110, borderRadius: 27 }, iconText: { color: 'white', fontSize: 26, fontWeight: '600' }, largeIconText: { fontSize: 48 }, cardName: { color: C.text, fontSize: 13, fontWeight: '700', marginTop: 9 }, cardMaker: { color: C.muted, fontSize: 11, marginTop: 3 }, cardScore: { color: C.muted, fontSize: 11, marginTop: 5 }, pageTitle: { marginHorizontal: 21, marginTop: 5, marginBottom: 20 }, title: { color: C.text, fontSize: 27, fontWeight: '800', letterSpacing: -0.8 }, body: { color: C.muted, fontSize: 13, lineHeight: 19, marginTop: 7 }, rows: { paddingHorizontal: 18, gap: 4 }, row: { minHeight: 76, flexDirection: 'row', alignItems: 'center', paddingVertical: 9 }, rowCopy: { flex: 1, marginLeft: 13 }, rowName: { color: C.text, fontSize: 14, fontWeight: '700' }, rowMeta: { color: C.muted, fontSize: 11, marginTop: 4 }, rowScore: { color: C.muted, fontSize: 11, marginTop: 3 }, rowAction: { backgroundColor: C.surface2, borderRadius: 10, minWidth: 50, alignItems: 'center', paddingVertical: 8, marginLeft: 6 }, rowActionText: { color: C.green, fontSize: 11, fontWeight: '800' }, nav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 72, paddingHorizontal: 12, backgroundColor: '#15201B', borderTopWidth: 1, borderColor: '#26372E', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }, navItem: { minWidth: 68, height: 51, alignItems: 'center', justifyContent: 'center', borderRadius: 15 }, navActive: { backgroundColor: '#284436' }, navIcon: { color: C.muted, fontSize: 20, lineHeight: 21 }, navIconActive: { color: C.green }, navLabel: { color: C.muted, fontSize: 10, marginTop: 2 }, navLabelActive: { color: C.green, fontWeight: '700' }, postBox: { marginHorizontal: 18, marginBottom: 14, backgroundColor: C.surface, borderRadius: 16, padding: 13, flexDirection: 'row', alignItems: 'center' }, smallAvatar: { width: 33, height: 33, borderRadius: 17, backgroundColor: C.greenDark, justifyContent: 'center', alignItems: 'center' }, postPlaceholder: { color: C.muted, flex: 1, marginLeft: 10, fontSize: 13 }, plus: { color: C.green, fontSize: 23 }, post: { backgroundColor: C.surface, marginHorizontal: 18, marginBottom: 11, borderRadius: 17, padding: 15 }, postHead: { flexDirection: 'row', alignItems: 'center' }, postName: { color: C.text, fontSize: 13, fontWeight: '800', marginLeft: 10 }, badge: { color: C.green, fontSize: 10, marginLeft: 10, marginTop: 3 }, more: { color: C.muted, marginLeft: 'auto', alignSelf: 'flex-start' }, postBody: { color: '#DCE7E0', fontSize: 13, lineHeight: 19, marginTop: 13 }, postFoot: { borderTopWidth: 1, borderTopColor: C.line, marginTop: 14, paddingTop: 11, flexDirection: 'row', gap: 22 }, reaction: { color: C.muted, fontSize: 11 }, updateBanner: { backgroundColor: '#163A2A', borderRadius: 17, padding: 16, marginHorizontal: 18, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, updateTitle: { color: C.text, fontSize: 14, fontWeight: '800' }, updateText: { color: '#B5D7C2', fontSize: 11, marginTop: 4 }, check: { width: 28, height: 28, borderRadius: 14, textAlign: 'center', paddingTop: 5, overflow: 'hidden', color: '#123020', backgroundColor: C.green, fontWeight: '900' }, queue: { marginHorizontal: 18, marginBottom: 8, backgroundColor: C.surface, borderRadius: 17, padding: 14 }, queueItem: { flexDirection: 'row', alignItems: 'center' }, queueCopy: { flex: 1, marginLeft: 12 }, queueHead: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 }, queueName: { color: C.text, fontSize: 13, fontWeight: '800' }, queuePercent: { color: C.green, fontSize: 12, fontWeight: '800' }, progressTrack: { height: 6, borderRadius: 4, backgroundColor: '#2C4035', overflow: 'hidden' }, progressFill: { height: '100%', borderRadius: 4, backgroundColor: C.green }, queueMeta: { color: C.muted, fontSize: 10, marginTop: 6 }, resultLabel: { color: C.text, fontWeight: '800', fontSize: 17, marginHorizontal: 20, marginTop: 29, marginBottom: 8 }, modalShade: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }, sheet: { backgroundColor: '#1A251F', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, paddingBottom: 29 }, sheetHandle: { width: 40, height: 4, borderRadius: 4, backgroundColor: '#5D7165', alignSelf: 'center', marginBottom: 21 }, detailHead: { flexDirection: 'row', alignItems: 'center' }, detailName: { marginLeft: 16, flex: 1 }, detailTitle: { color: C.text, fontSize: 22, fontWeight: '800' }, maker: { color: C.green, fontSize: 13, marginTop: 4 }, category: { color: C.muted, fontSize: 11, marginTop: 8 }, metrics: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 23, marginTop: 18, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.line }, metricValue: { color: C.text, textAlign: 'center', fontWeight: '800', fontSize: 14 }, metricLabel: { color: C.muted, textAlign: 'center', fontSize: 10, marginTop: 3 }, description: { color: '#DCE7E0', fontSize: 13, lineHeight: 19, marginTop: 20 }, install: { backgroundColor: C.green, alignItems: 'center', paddingVertical: 14, borderRadius: 14, marginTop: 22 }, installed: { backgroundColor: '#2A4133' }, installText: { color: '#153623', fontWeight: '800', fontSize: 14 }, installedText: { color: C.green }, close: { alignItems: 'center', paddingTop: 17 }, closeText: { color: C.muted, fontSize: 13, fontWeight: '700' },
});
