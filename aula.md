# Aula 07/04/2026 - Arrays no AsyncStorage, Service Layer e React Navigation

![](https://whimuc.com/JMjmdb7hg6h7cew3eo14TH/836M9N2h5JrYtL.webp)
## Objetivo da Aula

Evoluir o app de consultas médicas aplicando, na prática, os conceitos trabalhados na aula anterior \(useState, useEffect e AsyncStorage\).

**Nesta aula iremos:**

- Remover mocks e utilizar o AsyncStorage como fonte de dados
- Trabalhar com arrays de objetos no AsyncStorage
- Implementar navegação básica entre telas
- Criar uma tela administrativa para inserção de dados

## Recapitulando a Aula Passada \(31/03/2026\)

Na aula anterior aprendemos três pilares importantes:

- **useState** → gerenciamento de estado no componente
- **useEffect** → execução de código ao carregar o componente
- **AsyncStorage** → persistência de dados \(objeto único\)

**Exemplo da aula passada:**

```
const \[consulta, setConsulta\] = useState<Consulta>\(consultaInicial\);

useEffect\(\(\) => \{
  AsyncStorage.getItem\("@consulta"\).then\(\(json\) => \{
    if \(json\) setConsulta\(JSON.parse\(json\)\);
  \}\);
\}, \[\]\);
```
## O Que Vamos Adicionar Hoje

### 1. Trabalhando com Arrays no AsyncStorage

Na aula passada salvávamos apenas um objeto:

```
// Salvando um único objeto
AsyncStorage.setItem\("@consulta", JSON.stringify\(consulta\)\);
```
Agora vamos evoluir para trabalhar com listas de dados:

```
// Salvando múltiplos registros
AsyncStorage.setItem\("@consultas", JSON.stringify\(\[consulta1, consulta2\]\)\);
AsyncStorage.setItem\("@especialidades", JSON.stringify\(\[esp1, esp2\]\)\);
AsyncStorage.setItem\("@medicos", JSON.stringify\(\[med1, med2\]\)\);
```
Isso aproxima o comportamento do app ao de um sistema real.

### 2. Service Layer \(Organização do Código\)

Em vez de repetir chamadas ao AsyncStorage, vamos centralizar a lógica em funções reutilizáveis.

**Benefícios:**

- Código mais limpo
- Reutilização de lógica
- Manutenção facilitada
- Separação de responsabilidades

### 3. Navegação com React Navigation

Agora o app deixa de ter uma única tela.

**Configuração básica de navegação:**

```
import \{ NavigationContainer \} from "@react-navigation/native";
import \{ createNativeStackNavigator \} from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator\(\);

export default function App\(\) \{
  return \(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component=\{Home\} />
        <Stack.Screen name="Admin" component=\{Admin\} />
      </Stack.Navigator>
    </NavigationContainer>
  \);
\}
```
**Navegação entre telas:**

```
navigation.navigate\("Admin"\);
```
---
## Implementação Passo a Passo

![](https://whimuc.com/JMjmdb7hg6h7cew3eo14TH/6i5BFkoA85KLvp.webp)
### Passo 1 – Criando o Service Layer

**ARQUIVO NOVO: storage.ts**

Este arquivo centraliza todas as operações com AsyncStorage.

```
import AsyncStorage from "@react-native-async-storage/async-storage";
import \{ Especialidade \} from "../types/especialidade";
import \{ Medico \} from "../interfaces/medico";
import \{ Consulta \} from "../interfaces/consulta";

// Definição das chaves usadas no AsyncStorage
const KEYS = \{
  ESPECIALIDADES: "@consultas:especialidades",
  MEDICOS: "@consultas:medicos",
  CONSULTAS: "@consultas:consultas",
\};

// ========== ESPECIALIDADES ==========
// Salva array de especialidades no AsyncStorage
export async function salvarEspecialidades\(especialidades: Especialidade\[\]\) \{
  try \{
    await AsyncStorage.setItem\(
      KEYS.ESPECIALIDADES,
      JSON.stringify\(especialidades\)
    \);
  \} catch \(erro\) \{
    console.error\("Erro ao salvar:", erro\);
  \}
\}

// Busca array de especialidades do AsyncStorage
export async function obterEspecialidades\(\): Promise<Especialidade\[\]> \{
  try \{
    const dados = await AsyncStorage.getItem\(KEYS.ESPECIALIDADES\);
    return dados ? JSON.parse\(dados\) : \[\]; // Retorna array vazio se não houver dados
  \} catch \(erro\) \{
    console.error\("Erro ao obter:", erro\);
    return \[\];
  \}
\}

// ========== MÉDICOS ==========
// Salva array de médicos no AsyncStorage
export async function salvarMedicos\(medicos: Medico\[\]\) \{
  try \{
    await AsyncStorage.setItem\(KEYS.MEDICOS, JSON.stringify\(medicos\)\);
  \} catch \(erro\) \{
    console.error\("Erro ao salvar:", erro\);
  \}
\}

// Busca array de médicos do AsyncStorage
export async function obterMedicos\(\): Promise<Medico\[\]> \{
  try \{
    const dados = await AsyncStorage.getItem\(KEYS.MEDICOS\);
    return dados ? JSON.parse\(dados\) : \[\];
  \} catch \(erro\) \{
    console.error\("Erro ao obter:", erro\);
    return \[\];
  \}
\}

// ========== CONSULTAS ==========
// Salva array de consultas no AsyncStorage
export async function salvarConsultas\(consultas: Consulta\[\]\) \{
  try \{
    await AsyncStorage.setItem\(KEYS.CONSULTAS, JSON.stringify\(consultas\)\);
  \} catch \(erro\) \{
    console.error\("Erro ao salvar:", erro\);
  \}
\}

// Busca array de consultas do AsyncStorage
export async function obterConsultas\(\): Promise<Consulta\[\]> \{
  try \{
    const dados = await AsyncStorage.getItem\(KEYS.CONSULTAS\);
    if \(dados\) \{
      const consultas = JSON.parse\(dados\);
      // Reconverte strings de data para objetos Date
      return consultas.map\(\(c: any\) => \(\{
        ...c,
        data: new Date\(c.data\),
      \}\)\);
    \}
    return \[\];
  \} catch \(erro\) \{
    console.error\("Erro ao obter:", erro\);
    return \[\];
  \}
\}
```
### O que implementamos:

- **Constante KEYS**: Organiza as chaves do AsyncStorage em um só lugar
- **Funções de especialidades**: `salvarEspecialidades\(\)` e `obterEspecialidades\(\)`
- **Funções de médicos**: `salvarMedicos\(\)` e `obterMedicos\(\)`
- **Funções de consultas**: `salvarConsultas\(\)` e `obterConsultas\(\)`
- **Tratamento de erro**: Try/catch em todas as operações
- **Conversão de Date**: Reconverte strings para objetos Date ao carregar consultas

**Observação importante:**

Date não é serializável diretamente em JSON. Por isso:

- Ao salvar: `Date` é convertido automaticamente para string pelo `JSON.stringify`
- Ao carregar: Reconvertemos a string para `Date` com `new Date\(c.data\)`

---
### Passo 2 – Configurando a Navegação

**ARQUIVO: App.tsx**

**ANTES \(aula anterior\):**

```
import React from "react";
import \{ Home \} from "./src/screens";

export default function App\(\) \{
  return <Home />;
\}
```
**DEPOIS \(aula atual\):**

```
import React from "react";
// Importa componentes do React Navigation
import \{ NavigationContainer \} from "@react-navigation/native";
import \{ createNativeStackNavigator \} from "@react-navigation/native-stack";
// Importa as telas
import Home from "./src/screens/Home";
import Admin from "./src/screens/Admin";

// Cria o navegador
const Stack = createNativeStackNavigator\(\);

export default function App\(\) \{
  return \(
    // NavigationContainer envolve toda a navegação
    <NavigationContainer>
      \{/\* Stack.Navigator define a pilha de telas \*/\}
      <Stack.Navigator
        screenOptions=\{\{
          headerStyle: \{ backgroundColor: "\#2196F3" \}, // Cor do cabeçalho
          headerTintColor: "\#fff", // Cor do texto do cabeçalho
          headerTitleStyle: \{ fontWeight: "bold" \}, // Estilo do título
        \}\}
      >
        \{/\* Tela Home - tela inicial \*/\}
        <Stack.Screen 
          name="Home" 
          component=\{Home\}
          options=\{\{ title: "Minhas Consultas" \}\}
        />
        \{/\* Tela Admin - tela administrativa \*/\}
        <Stack.Screen 
          name="Admin" 
          component=\{Admin\}
          options=\{\{ title: "Painel Administrativo" \}\}
        />
      </Stack.Navigator>
    </NavigationContainer>
  \);
\}
```
### O que implementamos:

- **NavigationContainer**: Container principal que gerencia o estado de navegação
- **Stack.Navigator**: Define navegação em pilha \(uma tela sobre a outra\)
- **screenOptions**: Configurações visuais aplicadas a todas as telas
- **Stack.Screen**: Define cada tela disponível na navegação
- **name**: Nome usado para navegar \(`navigation.navigate\("Home"\)`\)
- **component**: Componente React que será renderizado
- **options**: Configurações específicas da tela \(título, ícones, etc\)

**Como funciona:**

- O usuário começa na primeira tela definida \(Home\)
- Ao navegar para Admin, a tela é empilhada sobre Home
- O botão "voltar" nativo do Android/iOS funciona automaticamente
- O header com botão de voltar é criado automaticamente

---
### Passo 3 – Atualizando a Home

**ARQUIVO: Home.tsx**

**ANTES \(aula anterior - com mock\):**

```
import React, \{ useState, useEffect \} from "react";
import \{ View, Text, ScrollView \} from "react-native";
import \{ Consulta \} from "../interfaces/consulta";

export default function Home\(\) \{
  // Mock de dados fixos
  const \[consulta, setConsulta\] = useState<Consulta>\(\{
    id: 1,
    medico: \{ id: 1, nome: "Dr. João", crm: "12345", especialidade: \{ id: 1, nome: "Cardiologia", descricao: "Coração" \}, ativo: true \},
    paciente: \{ id: 1, nome: "Maria", cpf: "123.456.789-00", email: "maria@email.com", telefone: "\(11\) 98765-4321" \},
    data: new Date\(\),
    valor: 350,
    status: "agendada",
  \}\);

  return \(
    <View>
      <Text>Consulta com \{consulta.medico.nome\}</Text>
    </View>
  \);
\}
```
**DEPOIS \(aula atual - com AsyncStorage\):**

```
import React, \{ useState, useEffect \} from "react";
import \{ View, Text, ScrollView, Button, Alert \} from "react-native";
import \{ StatusBar \} from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import \{ Consulta \} from "../interfaces/consulta";
import \{ ConsultaCard \} from "../components";
import \{ styles \} from "../styles/app.styles";
// Importa funções do service layer
import \{ obterConsultas, salvarConsultas \} from "../services/storage";

// Recebe navigation como prop \(injetado pelo React Navigation\)
export default function Home\(\{ navigation \}: any\) \{
  // Estado agora é um ARRAY de consultas
  const \[consultas, setConsultas\] = useState<Consulta\[\]>\(\[\]\);

  // Carrega dados ao montar o componente
  useEffect\(\(\) => \{
    carregarConsultas\(\);
  \}, \[\]\);

  // Função que busca consultas do AsyncStorage
  async function carregarConsultas\(\) \{
    const consultasSalvas = await obterConsultas\(\);
    setConsultas\(consultasSalvas\);
  \}

  // Atualiza status da consulta para "confirmada"
  async function confirmarConsulta\(consultaId: number\) \{
    // map cria novo array com a consulta modificada
    const consultasAtualizadas = consultas.map\(\(c\) =>
      c.id === consultaId ? \{ ...c, status: "confirmada" as const \} : c
    \);
    setConsultas\(consultasAtualizadas\); // Atualiza estado local
    await salvarConsultas\(consultasAtualizadas\); // Persiste no AsyncStorage
  \}

  // Atualiza status da consulta para "cancelada"
  async function cancelarConsulta\(consultaId: number\) \{
    const consultasAtualizadas = consultas.map\(\(c\) =>
      c.id === consultaId ? \{ ...c, status: "cancelada" as const \} : c
    \);
    setConsultas\(consultasAtualizadas\);
    await salvarConsultas\(consultasAtualizadas\);
  \}

  return \(
    <View style=\{styles.container\}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle=\{styles.scrollContent\}>
        <View style=\{styles.header\}>
          <Text style=\{styles.titulo\}>Minhas Consultas</Text>
          <Text style=\{styles.subtitulo\}>
            \{consultas.length\} consulta\(s\) agendada\(s\)
          </Text>
        </View>

        \{/\* Renderização condicional: vazio ou lista \*/\}
        \{consultas.length === 0 ? \(
          <View style=\{\{ padding: 20, alignItems: "center" \}\}>
            <Text style=\{\{ color: "\#666", marginBottom: 20 \}\}>
              Nenhuma consulta agendada ainda
            </Text>
            \{/\* Botão para navegar para Admin \*/\}
            <Button
              title="Ir para Admin"
              onPress=\{\(\) => navigation.navigate\("Admin"\)\}
            />
          </View>
        \) : \(
          // map renderiza um componente para cada consulta
          consultas.map\(\(consulta\) => \(
            <ConsultaCard
              key=\{consulta.id\}
              consulta=\{consulta\}
              onConfirmar=\{\(\) => confirmarConsulta\(consulta.id\)\}
              onCancelar=\{\(\) => cancelarConsulta\(consulta.id\)\}
            />
          \)\)
        \)\}
      </ScrollView>
    </View>
  \);
\}
```
### O que implementamos:

- **navigation prop**: Recebido automaticamente do React Navigation
- **Array de consultas**: Mudou de objeto único para array \(`Consulta\[\]`\)
- **obterConsultas\(\)**: Usa função do service layer em vez de mock
- **carregarConsultas\(\)**: Função assíncrona que busca dados persistidos
- **confirmarConsulta\(\)**: Atualiza status e salva no AsyncStorage
- **cancelarConsulta\(\)**: Atualiza status e salva no AsyncStorage
- **map\(\)**: Renderiza um ConsultaCard para cada consulta do array
- **navigation.navigate\(\)**: Navega para tela Admin quando não há consultas
- **Renderização condicional**: Mostra mensagem se lista estiver vazia

**Fluxo de dados:**

1. Componente é montado
2. `useEffect` dispara `carregarConsultas\(\)`
3. Dados são carregados do AsyncStorage via service layer
4. Estado é atualizado com `setConsultas\(\)`
5. Interface é renderizada com os dados
6. Ao confirmar/cancelar, dados são salvos novamente

---
### Passo 4 – Criando a Tela Admin

**ARQUIVO NOVO: Admin.tsx**

Este arquivo cria a tela administrativa para adicionar dados.

```
import React, \{ useState, useEffect \} from "react";
import \{
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
\} from "react-native";
import \{ StatusBar \} from "expo-status-bar";
// Importa todas as funções do service layer
import \{
  obterEspecialidades,
  obterMedicos,
  salvarEspecialidades,
  salvarMedicos,
  obterConsultas,
  salvarConsultas,
\} from "../services/storage";
import \{ Especialidade \} from "../types/especialidade";
import \{ Medico \} from "../interfaces/medico";
import \{ Paciente \} from "../types/paciente";
import \{ Consulta \} from "../interfaces/consulta";

// Recebe navigation para poder voltar para Home
export default function Admin\(\{ navigation \}: any\) \{
  // ========== ESTADOS PARA ESPECIALIDADE ==========
  const \[nomeEsp, setNomeEsp\] = useState\(""\);
  const \[descEsp, setDescEsp\] = useState\(""\);
  const \[especialidades, setEspecialidades\] = useState<Especialidade\[\]>\(\[\]\);

  // ========== ESTADOS PARA MÉDICO ==========
  const \[nomeMed, setNomeMed\] = useState\(""\);
  const \[crmMed, setCrmMed\] = useState\(""\);
  const \[medicos, setMedicos\] = useState<Medico\[\]>\(\[\]\);

  // ========== ESTADOS PARA CONSULTA DE TESTE ==========
  const \[nomePac, setNomePac\] = useState\(""\);
  const \[dataConsulta, setDataConsulta\] = useState\(""\);

  // Carrega dados existentes ao montar
  useEffect\(\(\) => \{
    carregarDados\(\);
  \}, \[\]\);

  // Busca especialidades e médicos salvos
  async function carregarDados\(\) \{
    const esps = await obterEspecialidades\(\);
    const meds = await obterMedicos\(\);
    setEspecialidades\(esps\);
    setMedicos\(meds\);
  \}

  // Adiciona nova especialidade
  function adicionarEspecialidade\(\) \{
    // Validação simples
    if \(\!nomeEsp || \!descEsp\) \{
      Alert.alert\("Erro", "Preencha nome e descrição"\);
      return;
    \}

    // Cria objeto especialidade
    const novaEsp: Especialidade = \{
      id: especialidades.length \+ 1, // ID sequencial simples
      nome: nomeEsp,
      descricao: descEsp,
    \};

    // Adiciona ao array e salva
    const novasEsps = \[...especialidades, novaEsp\];
    setEspecialidades\(novasEsps\);
    salvarEspecialidades\(novasEsps\);

    // Limpa campos
    setNomeEsp\(""\);
    setDescEsp\(""\);
    Alert.alert\("Sucesso", "Especialidade adicionada\!"\);
  \}

  // Adiciona novo médico
  function adicionarMedico\(\) \{
    if \(\!nomeMed || \!crmMed\) \{
      Alert.alert\("Erro", "Preencha nome e CRM"\);
      return;
    \}

    // Valida se há especialidade cadastrada
    if \(especialidades.length === 0\) \{
      Alert.alert\("Erro", "Adicione uma especialidade primeiro\!"\);
      return;
    \}

    // Cria objeto médico \(usa primeira especialidade por simplicidade\)
    const novoMed: Medico = \{
      id: medicos.length \+ 1,
      nome: nomeMed,
      crm: crmMed,
      especialidade: especialidades\[0\], // Simplificação: usa primeira especialidade
      ativo: true,
    \};

    const novosMeds = \[...medicos, novoMed\];
    setMedicos\(novosMeds\);
    salvarMedicos\(novosMeds\);

    setNomeMed\(""\);
    setCrmMed\(""\);
    Alert.alert\("Sucesso", "Médico adicionado\!"\);
  \}

  // Cria consulta de teste para aparecer na Home
  async function criarConsultaTeste\(\) \{
    if \(\!nomePac || \!dataConsulta\) \{
      Alert.alert\("Erro", "Preencha nome do paciente e data"\);
      return;
    \}

    if \(medicos.length === 0\) \{
      Alert.alert\("Erro", "Adicione um médico primeiro\!"\);
      return;
    \}

    // Cria paciente fictício
    const pacienteTeste: Paciente = \{
      id: 1,
      nome: nomePac,
      cpf: "123.456.789-00",
      email: "paciente@email.com",
      telefone: "\(11\) 98765-4321",
    \};

    // Converte string de data \(DD/MM/AAAA\) para objeto Date
    const \[dia, mes, ano\] = dataConsulta.split\("/"\);
    const data = new Date\(Number\(ano\), Number\(mes\) - 1, Number\(dia\)\);

    // Cria consulta \(usa primeiro médico por simplicidade\)
    const novaConsulta: Consulta = \{
      id: Date.now\(\), // ID único usando timestamp
      medico: medicos\[0\],
      paciente: pacienteTeste,
      data: data,
      valor: 350,
      status: "agendada",
      observacoes: "Consulta de teste",
    \};

    // Adiciona à lista existente
    const consultasAtuais = await obterConsultas\(\);
    await salvarConsultas\(\[...consultasAtuais, novaConsulta\]\);

    setNomePac\(""\);
    setDataConsulta\(""\);
    
    // Exibe alerta e navega de volta para Home
    Alert.alert\("Sucesso", "Consulta criada\! Volte para Home", \[
      \{ text: "OK", onPress: \(\) => navigation.navigate\("Home"\) \},
    \]\);
  \}

  return \(
    <View style=\{styles.container\}>
      <StatusBar style="light" />
      <ScrollView style=\{styles.content\}>
        \{/\* ========== SEÇÃO 1: ESPECIALIDADES ========== \*/\}
        <View style=\{styles.secao\}>
          <Text style=\{styles.titulo\}>1. Adicionar Especialidade</Text>
          <TextInput
            style=\{styles.input\}
            placeholder="Nome da especialidade"
            value=\{nomeEsp\}
            onChangeText=\{setNomeEsp\}
          />
          <TextInput
            style=\{styles.input\}
            placeholder="Descrição"
            value=\{descEsp\}
            onChangeText=\{setDescEsp\}
          />
          <Button title="Adicionar Especialidade" onPress=\{adicionarEspecialidade\} />

          \{/\* Lista de especialidades cadastradas \*/\}
          <View style=\{styles.lista\}>
            \{especialidades.map\(\(esp\) => \(
              <Text key=\{esp.id\} style=\{styles.item\}>
                • \{esp.nome\} - \{esp.descricao\}
              </Text>
            \)\)\}
          </View>
        </View>

        \{/\* ========== SEÇÃO 2: MÉDICOS ========== \*/\}
        <View style=\{styles.secao\}>
          <Text style=\{styles.titulo\}>2. Adicionar Médico</Text>
          <TextInput
            style=\{styles.input\}
            placeholder="Nome do médico"
            value=\{nomeMed\}
            onChangeText=\{setNomeMed\}
          />
          <TextInput
            style=\{styles.input\}
            placeholder="CRM"
            value=\{crmMed\}
            onChangeText=\{setCrmMed\}
          />
          <Button title="Adicionar Médico" onPress=\{adicionarMedico\} />

          \{/\* Lista de médicos cadastrados \*/\}
          <View style=\{styles.lista\}>
            \{medicos.map\(\(med\) => \(
              <Text key=\{med.id\} style=\{styles.item\}>
                • \{med.nome\} \(\{med.crm\}\) - \{med.especialidade.nome\}
              </Text>
            \)\)\}
          </View>
        </View>

        \{/\* ========== SEÇÃO 3: CONSULTA TESTE ========== \*/\}
        <View style=\{styles.secao\}>
          <Text style=\{styles.titulo\}>3. Criar Consulta de Teste</Text>
          <TextInput
            style=\{styles.input\}
            placeholder="Nome do paciente"
            value=\{nomePac\}
            onChangeText=\{setNomePac\}
          />
          <TextInput
            style=\{styles.input\}
            placeholder="Data \(DD/MM/AAAA\)"
            value=\{dataConsulta\}
            onChangeText=\{setDataConsulta\}
          />
          <Button title="Criar Consulta" onPress=\{criarConsultaTeste\} />
        </View>

        <View style=\{\{ height: 40 \}\} />
      </ScrollView>
    </View>
  \);
\}

const styles = StyleSheet.create\(\{
  container: \{
    flex: 1,
    backgroundColor: "\#f5f5f5",
  \},
  content: \{
    flex: 1,
    padding: 20,
  \},
  secao: \{
    backgroundColor: "\#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  \},
  titulo: \{
    fontSize: 18,
    fontWeight: "bold",
    color: "\#333",
    marginBottom: 15,
  \},
  input: \{
    backgroundColor: "\#f5f5f5",
    borderWidth: 1,
    borderColor: "\#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  \},
  lista: \{
    marginTop: 15,
  \},
  item: \{
    fontSize: 14,
    color: "\#666",
    marginBottom: 8,
  \},
\}\);
```
### O que implementamos:

- **3 seções independentes**: Especialidades, Médicos e Consultas
- **Estados separados**: Cada seção tem seus próprios estados de formulário
- **Validações básicas**: Verifica se campos estão preenchidos
- **IDs sequenciais**: Usa tamanho do array \+ 1 \(simplificação para teste\)
- **Listas inline**: Mostra itens cadastrados abaixo de cada formulário
- **Spread operator \(`...`\)**: Adiciona itens sem mutar o array original
- **Conversão de data**: Divide string "DD/MM/AAAA" e cria objeto Date
- **Alert com callback**: Exibe mensagem e navega para Home após criar consulta
- **TextInput controlado**: Valor vem do estado e atualiza via onChangeText

**Fluxo de cadastro:**

1. Usuário preenche campos
2. Clica no botão
3. Função valida dados
4. Cria novo objeto
5. Adiciona ao array existente
6. Salva no AsyncStorage via service layer
7. Atualiza estado local
8. Lista é atualizada automaticamente \(re-render\)
9. Campos são limpos

---
## Como Testar

**1. Executar o app:**

```
npx expo start
```
**2. Primeira execução:**

- Home aparece vazia
- Toque em "Ir para Admin"

**3. No Admin:**

- **Passo 1**: Adicione uma especialidade \(ex: "Cardiologia", "Cuida do coração"\)
- **Passo 2**: Adicione um médico \(ex: "Dr. João Silva", "12345-SP"\)
- **Passo 3**: Crie uma consulta \(ex: "Maria Santos", "30/03/2026"\)

**4. Voltar para Home:**

- Consulta criada aparece na lista
- Botões "Confirmar" e "Cancelar" funcionam
- Status é atualizado e persistido

**5. Fechar e reabrir o app:**

- Todos os dados permanecem salvos
- AsyncStorage mantém as informações

---
## Diagrama de Fluxo de Dados

```
        AsyncStorage
             ↓
      storage.ts \(Service Layer\)
             ↓
        Home  ↔  Admin
```
**Explicação:**

- **AsyncStorage**: Armazena dados persistentes no dispositivo
- **storage.ts**: Camada intermediária que encapsula operações
- **Home e Admin**: Consomem e salvam dados via service layer
- **Navegação**: Permite fluxo entre telas mantendo dados sincronizados

---
## Resumo da Evolução

**Aula 18/03 \(anterior\):**

- Estado \+ Persistência simples
- Um único objeto
- Uma única tela

**Aula 25/03 \(atual\):**

- Persistência com arrays
- Service layer \(organização\)
- Navegação entre telas
- CRUD básico

**Próximos passos:**

- Formulários completos com validação
- Integração com API real
- Autenticação de usuário
- Estados de loading e erro

---
## Arquivos Criados/Modificados

- [ ] **NOVO**: storage.ts - Service layer com 6 funções
- [ ] **MODIFICADO**: App.tsx - Adicionada navegação
- [ ] **MODIFICADO**: Home.tsx - Removidos mocks, adicionado AsyncStorage
- [ ] **NOVO**: Admin.tsx - Tela administrativa completa


![](https://whimuc.com/JMjmdb7hg6h7cew3eo14TH/BZZXQekoNCxy7z.png)
 