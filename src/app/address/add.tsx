import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CepService from "../../services/CepService";
import UserService from "../../services/UserService";
import { BorderRadius, Colors, Spacing, Typography } from "../../theme";

export default function AddAddressScreen() {
  const router = useRouter();
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCepChange = async (text: string) => {
    const formattedCep = text.replace(/\D/g, "");
    setCep(formattedCep);

    if (formattedCep.length === 8) {
      setLoading(true);
      const addressData = await CepService.getAddressByCep(formattedCep);
      setLoading(false);

      if (addressData) {
        setStreet(addressData.logradouro);
        setNeighborhood(addressData.bairro);
        setCity(addressData.localidade);
        setState(addressData.uf);
      } else {
        Alert.alert("Erro", "CEP não encontrado.");
      }
    }
  };

  const handleSave = async () => {
    if (!cep || !street || !number || !neighborhood || !city || !state) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const fullAddress = `${street}, ${number} - ${neighborhood}, ${city} - ${state}, ${cep}`;

    try {
      await UserService.addSavedAddress(fullAddress);
      await UserService.updateAddress(fullAddress);
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar o endereço.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>CEP</Text>
        <View style={styles.cepContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={cep}
            onChangeText={handleCepChange}
            placeholder="00000-000"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="numeric"
            maxLength={8}
          />
          {loading && (
            <ActivityIndicator
              size="small"
              color={Colors.primary}
              style={styles.loader}
            />
          )}
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, { flex: 3, marginRight: Spacing.s }]}>
          <Text style={styles.label}>Rua</Text>
          <TextInput
            style={styles.input}
            value={street}
            onChangeText={setStreet}
            placeholder="Nome da rua"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>
        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={styles.label}>Número</Text>
          <TextInput
            style={styles.input}
            value={number}
            onChangeText={setNumber}
            placeholder="Nº"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Bairro</Text>
        <TextInput
          style={styles.input}
          value={neighborhood}
          onChangeText={setNeighborhood}
          placeholder="Bairro"
          placeholderTextColor={Colors.textSecondary}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, { flex: 3, marginRight: Spacing.s }]}>
          <Text style={styles.label}>Cidade</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Cidade"
            placeholderTextColor={Colors.textSecondary}
          />
        </View>
        <View style={[styles.formGroup, { flex: 1 }]}>
          <Text style={styles.label}>UF</Text>
          <TextInput
            style={styles.input}
            value={state}
            onChangeText={setState}
            placeholder="UF"
            placeholderTextColor={Colors.textSecondary}
            maxLength={2}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Salvar Endereço</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.m,
  },
  formGroup: {
    marginBottom: Spacing.l,
  },
  label: {
    fontSize: Typography.sizes.m,
    color: Colors.textPrimary,
    marginBottom: Spacing.s,
    fontWeight: Typography.weights.medium,
  },
  input: {
    backgroundColor: Colors.surface,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.m,
    padding: Spacing.m,
    fontSize: Typography.sizes.m,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.m,
    borderRadius: BorderRadius.l,
    alignItems: "center",
    marginTop: Spacing.l,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: Typography.sizes.m,
    fontWeight: Typography.weights.bold,
  },
  cepContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loader: {
    marginLeft: Spacing.s,
  },
  row: {
    flexDirection: "row",
  },
});
