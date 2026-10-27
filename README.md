# Protótipo do Catecismo Arminiano de 1640

Este protótipo foi gerado a partir do texto completo do **Catecismo Arminiano de 1640** (148 perguntas e respostas), extraído do PDF anexado.

---

## 📱 Estrutura do App

**Stack:** React Native + Expo (compatível Android/iOS)

### Telas
| Tela | Descrição |
|---|---|
| **Início** | Visão geral com as 11 seções e estatísticas (148 perguntas) |
| **Seção** | Lista de perguntas/respostas de cada seção, com busca local |
| **Buscar** | Busca global por palavra-chave em perguntas e respostas |
| **Favoritos** | Perguntas marcadas pelo usuário |

### Funcionalidades
- ✅ Navegação por tabs (Início • Buscar • Favoritos)
- ✅ Busca em tempo real (mínimo 2 caracteres)
- ✅ Marcar/desmarcar favoritos (estrela)
- ✅ Expansão de respostas (tocar na pergunta)
- ✅ Navegação entre seções

---

## 🛠️ Como rodar

1. Instale o Expo CLI:
```bash
npm install -g expo-cli
```

2. Crie um projeto:
```bash
expo init CatecismoArminiano
```

3. Substitua o conteúdo de `App.js` pelo arquivo gerado (`App.js`)

4. Instale as dependências:
```bash
expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/stack @expo/vector-icons
```

5. Execute:
```bash
expo start
```

> **Dica:** Você pode rodar em um emulador Android/iOS ou no dispositivo físico via app Expo Go.

---

## 📄 Sobre o conteúdo

O JSON com as **11 seções** e **148 perguntas** está embutido no `App.js` na variável `secoes`. Em produção, recomenda-se separar em um arquivo `catecismo.json` e importar dinamicamente.

As seções são:
1. Da Religião Cristã (2 perguntas)
2. Da Bíblia Sagrada (24 perguntas)
3. De Deus (8 perguntas)
4. Da Divina Providência (8 perguntas)
5. Do Pecado (2 perguntas)
6. Da Obra Da Redenção (4 perguntas)
7. Da Vontade Divina: Eleição e Reprovação (4 perguntas)
8. Da Salvação (34 perguntas)
9. Da Verdadeira Adoração (11 perguntas)
10. Do Mundo Vindouro (3 perguntas)
11. Da Igreja Cristã (12 perguntas)

---

## 🚀 Próximos passos sugeridos

- [ ] Migrar o JSON para um arquivo separado (`catecismo.json`)
- [ ] Adicionar modo escuro
- [ ] Implementar compartilhamento de perguntas via WhatsApp/Email
- [ ] Adicionar referências bíblicas clicáveis
- [ ] Criar versão web (Next.js) a partir da mesma estrutura de dados
