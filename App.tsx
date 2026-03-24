
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ScrollView } from 'react-native';
import { Especialidade } from './src/types/espcialidade';
import { Paciente } from "./src/types/paciente";
import { Medico } from "./src/interfaces/medico";
import { Consulta } from "./src/interfaces/consulta";
import { useState } from 'react';

export default function App() {

  const cardiologia: Especialidade = {
    id: 1,
    nome: "Infectologista",
    descricao: "Especialista em doenças infecciosas e parasitárias",
  };

  const medico1: Medico = {
    id: 1,
    nome: "Wesker",
    crm: "CRM12345",
    especialidade: cardiologia,
    ativo: true,
  };

  const paciente1: Paciente = {
    id: 1,
    nome: "Lulu",
    cpf: "123.456.789-00",
    email: "chlulu@email.com",
    telefone: "(11) 98765-4321",
  };

  const [consulta, setConsulta] = useState<Consulta>({
    id: 1,
    medico: medico1,
    paciente: paciente1,
    data: new Date(2026, 2, 10),
    valor: 350,
    status: "agendada",
    observacoes: "Consulta de rotina",
  });

  function confirmarConsulta() {
    setConsulta({
      ...consulta,
      status: "confirmada",
    });
  }

  function cancelarConsulta() {
    setConsulta({
      ...consulta,
      status: "cancelada",
    });
  }

  function formatarValor(valor: number): string {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function formatarData(data: Date): string {
    return data.toLocaleDateString("pt-BR");
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Sistema de Consultas UMBRELLA CORP</Text>
          <Text style={styles.subtitulo}>Consulta N° {consulta.id}</Text>
        </View>

        {/* Card da Consulta */}
        <View style={styles.card}>
          {/* Status Badge */}
          <View style={[
            styles.statusBadge,
            consulta.status === "confirmada" && styles.statusConfirmada,
            consulta.status === "cancelada" && styles.statusCancelada,
          ]}>
            <Text style={styles.statusTexto}>{consulta.status.toUpperCase()}</Text>
          </View>

          {/* Informações do Médico */}
          <View style={styles.secao}>
            <Text style={styles.label}>👨‍⚕️ Médico</Text>
            <Text style={styles.valor}>{consulta.medico.nome}</Text>
            <Text style={styles.info}>CRM: {consulta.medico.crm}</Text>
            <Text style={styles.info}>{consulta.medico.especialidade.nome}</Text>
          </View>

          {/* Informações do Paciente */}
          <View style={styles.secao}>
            <Text style={styles.label}>👤 Paciente</Text>
            <Text style={styles.valor}>{consulta.paciente.nome}</Text>
            <Text style={styles.info}>CPF: {consulta.paciente.cpf}</Text>
            <Text style={styles.info}>Email: {consulta.paciente.email}</Text>
            {consulta.paciente.telefone && (
              <Text style={styles.info}>Tel: {consulta.paciente.telefone}</Text>
            )}
          </View>

          {/* Informações da Consulta */}
          <View style={styles.secao}>
            <Text style={styles.label}>📅 Dados da Consulta</Text>
            <Text style={styles.valor}>Data: {formatarData(consulta.data)}</Text>
            <Text style={styles.valor}>Valor: {formatarValor(consulta.valor)}</Text>
            {consulta.observacoes && (
              <Text style={styles.observacoes}>{consulta.observacoes}</Text>
            )}
          </View>

          {/* Botões de Ação */}
          <View style={styles.acoes}>
            {consulta.status === "agendada" && (
              <>
                <View style={styles.botaoContainer}>
                  <Button
                    title="Confirmar Consulta"
                    onPress={confirmarConsulta}
                    color="#4CAF50"
                  />
                </View>
                <View style={styles.botaoContainer}>
                  <Button
                    title="Cancelar Consulta"
                    onPress={cancelarConsulta}
                    color="#F44336"
                  />
                </View>
              </>
            )}
            {consulta.status === "confirmada" && (
              <View style={styles.mensagem}>
                <Text style={styles.mensagemTexto}>✓ Consulta confirmada com sucesso!</Text>
              </View>
            )}
            {consulta.status === "cancelada" && (
              <View style={styles.mensagemCancelada}>
                <Text style={styles.mensagemTexto}>✗ Consulta cancelada</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#04131f",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    fontFamily: 'DMSans_400Regular',
  },
  subtitulo: {
    fontSize: 18,
    color: "#fff",
    opacity: 0.9,
    fontFamily: 'DMSans_400Regular',
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  statusBadge: {
    backgroundColor: "#FFA500",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  statusConfirmada: {
    backgroundColor: "#4CAF50",
  },
  statusCancelada: {
    backgroundColor: "#F44336",
  },
  statusTexto: {
    fontFamily: 'DMSans_400Regular',
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  secao: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  label: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    fontWeight: "bold",
    color: "#0060b9",
    marginBottom: 8,
  },
  valor: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 18,
    color: "#333",
    marginBottom: 4,
  },
  info: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  observacoes: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
    marginTop: 8,
  },
  acoes: {
    marginTop: 10,
  },
  botaoContainer: {
    marginBottom: 12,
  },
  mensagem: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
    fontFamily: 'DMSans_400Regular',
  },
  mensagemCancelada: {
    backgroundColor: "#FFEBEE",
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#F44336",
    fontFamily: 'DMSans_400Regular',
  },
  mensagemTexto: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
  },
  rodape: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
  },
  rodapeTexto: {
    fontFamily: 'DMSans_400Regular',
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    lineHeight: 18,
  },
});
