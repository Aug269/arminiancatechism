// App.js - Protótipo do Catecismo Arminiano de 1640 (React Native + Expo)
// Gerado por Sabiá-4 em 13/10/2026
import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, SafeAreaView,
  FlatList, Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import catecismo from './assets/catecismo.json';

// ====== Contexto de Favoritos ======
const FavoritosContext = createContext();

export function FavoritosProvider({ children }) {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    const fav = AsyncStorage.getItem('@favoritos');
    if (fav) setFavoritos(JSON.parse(fav) || []);
  }, []);

  const salvar = (arr) => {
    AsyncStorage.setItem('@favoritos', JSON.stringify(arr));
  };

  const adicionarFavorito = (id) => {
    if (!favoritos.includes(id)) {
      const newArr = [...favoritos, id];
      setFavoritos(newArr);
      salvar(newArr);
    }
  };

  const removerFavorito = (id) => {
    const newArr = favoritos.filter(fid => fid !== id);
    setFavoritos(newArr);
    salvar(newArr);
  };

  const isFavorito = (id) => favoritos.includes(id);

  return (
    <FavoritosContext.Provider value={{ favoritos, adicionarFavorito, removerFavorito, isFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}

const secoes = catecismo;

// ====== Componentes ======
function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Catecismo Arminiano de 1640</Text>
        <Text style={styles.subtitle}>Instrução da religião cristã em 148 perguntas e respostas</Text>
      </View>
      
      <View style={styles.statsCard}>
        <Text style={styles.statsText}>{secoes.length} Seções • 148 Perguntas</Text>
      </View>
      
      <Text style={styles.sectionTitle}>Seções</Text>
      <View style={styles.sectionsGrid}>
        {secoes.map((secao, idx) => {
          const total = secao.perguntas.length;
          const ids = secao.perguntas.map(p => p.id);
          const minId = Math.min(...ids);
          const maxId = Math.max(...ids);
          return (
            <TouchableOpacity 
              key={idx} 
              style={styles.sectionCard}
              onPress={() => navigation.navigate('Seção', { secaoId: idx })}
            >
              <Text style={styles.sectionCardTitle}>{secao.titulo}</Text>
              <Text style={styles.sectionCardMeta}>{total} perguntas • #{minId}-{maxId}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

function SecaoScreen({ route, navigation }) {
  const { secaoId } = route.params;
  const secao = secoes[secaoId];
  const [search, setSearch] = useState('');
  
  const perguntasFiltradas = secao.perguntas.filter(p =>
    p.pergunta.toLowerCase().includes(search.toLowerCase()) ||
    p.resposta.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#1a73e8" />
        </TouchableOpacity>
        <Text style={styles.titleSection}>{secao.titulo}</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={{ marginLeft: 12 }} />
        <TextInput
          placeholder="Buscar perguntas nesta seção..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          autoCapitalize="none"
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close" size={20} color="#888" style={{ marginRight: 12 }} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      <FlatList
        data={perguntasFiltradas}
        keyExtractor={p => p.id.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
        renderItem={({ item: p }) => <PerguntaCard pergunta={p} showSection={false} />}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <Text style={{ color: '#888', marginTop: 12 }}>Nenhuma pergunta encontrada</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

function PerguntaCard({ pergunta, showSection = true }) {
  const { isFavorito, adicionarFavorito, removerFavorito } = useContext(FavoritosContext);
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity 
        style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}
        onPress={() => setExpanded(!expanded)}
      >
        <Text style={styles.qNum}>#{pergunta.id}</Text>
        <Text style={styles.qText} numberOfLines={expanded ? undefined : 2}>
          {pergunta.pergunta || 'Pergunta não disponível'}
        </Text>
        <TouchableOpacity 
          onPress={(e) => {
            e.stopPropagation();
            if (isFavorito(pergunta.id)) {
              removerFavorito(pergunta.id);
            } else {
              adicionarFavorito(pergunta.id);
            }
          }}
          style={{ marginLeft: 8 }}
        >
          <Ionicons 
            name={isFavorito(pergunta.id) ? "star" : "star-outline"} 
            size={22} 
            color={isFavorito(pergunta.id) ? '#FFD700' : '#888'}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      
      {expanded && (
        <View style={{ marginTop: 12 }}>
          <Text style={styles.rText}>{pergunta.resposta || 'Resposta não disponível'}</Text>
        </View>
      )}
    </View>
  );
}

function BuscaScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (search.length >= 2) {
      const encontrados = [];
      secoes.forEach((secao, secaoIdx) => {
        secao.perguntas.forEach(p => {
          if (p.pergunta.toLowerCase().includes(search.toLowerCase()) ||
              p.resposta.toLowerCase().includes(search.toLowerCase())) {
            encontrados.push({ ...p, secaoTitulo: secao.titulo, secaoId: secaoIdx });
          }
        });
      });
      setResults(encontrados);
    } else {
      setResults([]);
    }
  }, [search]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#1a73e8" />
        </TouchableOpacity>
        <Text style={styles.titleSection}>Buscar no Catecismo</Text>
      </View>
      
      <View style={styles.searchContainerFull}>
        <Ionicons name="search" size={20} color="#888" style={{ marginLeft: 12 }} />
        <TextInput
          placeholder="Buscar perguntas e respostas..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInputFull}
          autoFocus={true}
          autoCapitalize="none"
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close" size={20} color="#888" style={{ marginRight: 12 }} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {search.length < 2 ? (
        <View style={{ alignItems: 'center', marginTop: 60 }}>
          <Ionicons name="search-sharp" size={48} color="#ccc" />
          <Text style={{ color: '#888', marginTop: 12 }}>Digite ao menos 2 caracteres</Text>
        </View>
      ) : results.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Ionicons name="search-outline" size={48} color="#ccc" />
          <Text style={{ color: '#888', marginTop: 12 }}>Nenhum resultado para "{search}"</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, idx) => `${item.id}-${idx}`}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.resultItem}
              onPress={() => navigation.navigate('Seção', { secaoId: item.secaoId })}
            >
              <Text style={styles.resultSection}>{item.secaoTitulo}</Text>
              <Text style={styles.resultQ}>#{item.id}. {item.pergunta || 'Sem texto'}</Text>
              <Text style={styles.resultR} numberOfLines={2}>{item.resposta.slice(0, 120)}{item.resposta.length > 120 ? '...' : ''}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

function FavoritosScreen({ navigation }) {
  const { favoritos, isFavorito, removerFavorito } = useContext(FavoritosContext);
  const [favoritosData, setFavoritosData] = useState([]);

  useEffect(() => {
    const data = [];
    secoes.forEach((secao, secaoIdx) => {
      secao.perguntas.forEach(p => {
        if (isFavorito(p.id)) {
          data.push({ ...p, secaoTitulo: secao.titulo, secaoId: secaoIdx });
        }
      });
    });
    setFavoritosData(data);
  }, [favoritos, secoes, isFavorito]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titleSection}>Favoritos</Text>
      </View>
      
      {favoritosData.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Ionicons name="star-outline" size={48} color="#ccc" />
          <Text style={{ color: '#888', marginTop: 12 }}>Nenhuma pergunta favorita ainda</Text>
        </View>
      ) : (
        <FlatList
          data={favoritosData}
          keyExtractor={p => p.id.toString()}
          contentContainerStyle={{ paddingBottom: 30 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Text style={styles.qNumFav}>#{item.id}</Text>
                <Text style={styles.qTextFav}>{item.pergunta || 'Sem texto'}</Text>
              </View>
              <Text style={styles.sectionLabel}>{item.secaoTitulo}</Text>
              <TouchableOpacity 
                style={{ marginTop: 8, alignSelf: 'flex-end' }}
                onPress={() => removerFavorito(item.id)}
              >
                <Ionicons name="star" size={20} color="#FFD700" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </ScrollView>
  );
}

// ====== Navegação ======
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          if (route.name === 'Início') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Buscar') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Favoritos') iconName = focused ? 'star' : 'star-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Buscar" component={BuscaScreen} />
      <Tab.Screen name="Favoritos" component={FavoritosScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <FavoritosProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Main" 
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Seção" 
            component={SecaoScreen}
            options={({ route }) => ({ 
              title: secoes[route.params.secaoId]?.titulo || 'Seção',
              headerBackTitle: 'Voltar'
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritosProvider>
  );
}

// ====== Estilos ======
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#fff', paddingTop: 40, paddingBottom: 18, paddingHorizontal: 16, elevation: 2, shadowColor: '#000' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1a73e8', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#666' },
  titleSection: { fontSize: 20, fontWeight: 'bold', color: '#1a73e8' },
  statsCard: { backgroundColor: '#e9f5ff', margin: 16, borderRadius: 10, padding: 14, alignItems: 'center' },
  statsText: { fontSize: 15, color: '#333' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', margin: 16, marginBottom: 8, color: '#333' },
  sectionsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 8 },
  sectionCard: { 
    backgroundColor: '#fff', 
    margin: 8, 
    padding: 16, 
    borderRadius: 10, 
    minWidth: 140, 
    maxWidth: 160, 
    minHeight: 70, 
    elevation: 2, 
    shadowColor: '#000', 
    alignItems: 'flex-start' 
  },
  sectionCardTitle: { fontSize: 14, fontWeight: '600', color: '#1a73e8', marginBottom: 4 },
  sectionCardMeta: { fontSize: 12, color: '#666' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, margin: 12, marginLeft: 16, marginRight: 16, height: 40 },
  searchContainerFull: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 8, margin: 12, height: 40 },
  searchInput: { flex: 1, fontSize: 15, marginLeft: 8 },
  searchInputFull: { flex: 1, fontSize: 15, marginLeft: 8, height: 40 },
  card: { backgroundColor: '#fff', margin: 10, marginHorizontal: 16, padding: 16, borderRadius: 10, elevation: 1, shadowColor: '#000' },
  qNum: { fontSize: 16, fontWeight: 'bold', color: '#1a73e8', marginRight: 8, minWidth: 24, textAlign: 'center' },
  qNumFav: { fontSize: 14, fontWeight: 'bold', color: '#FFD700', marginRight: 8, minWidth: 20, textAlign: 'center' },
  qText: { fontSize: 15, flex: 1, lineHeight: 22 },
  qTextFav: { fontSize: 15, fontWeight: '500', flex: 1, lineHeight: 22 },
  rText: { fontSize: 15, color: '#222', lineHeight: 24, marginTop: 4 },
  sectionLabel: { fontSize: 12, color: '#1a73e8', fontWeight: 'bold', marginTop: 6 },
  resultItem: { backgroundColor: '#fff', margin: 8, marginHorizontal: 16, padding: 14, borderRadius: 8, elevation: 1 },
  resultSection: { fontSize: 12, color: '#1a73e8', fontWeight: 'bold' },
  resultQ: { fontSize: 14, fontWeight: '600', color: '#222', marginTop: 2 },
  resultR: { fontSize: 13, color: '#555', marginTop: 2, marginBottom: 2 },
});
