import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BarcodeLookupService from "../services/BarcodeLookupService";
import { Colors, Spacing, Typography } from "../theme";

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Precisamos da sua permissão para usar a câmera
        </Text>
        <Button onPress={requestPermission} title="Conceder permissão" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);
    try {
      const medicationData = await BarcodeLookupService.lookupBarcode(data);
      if (medicationData) {
        // Navigate to add medication screen with data
        router.push({
          pathname: "/medication/add",
          params: {
            initialData: JSON.stringify(medicationData),
          },
        });
      } else {
        alert(`Código de barras ${data} não encontrado no banco de dados.`);
        setScanned(false);
      }
    } catch (error) {
      console.error(error);
      setScanned(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "ean13", "ean8"],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
          <Text style={styles.instructions}>
            Aponte a câmera para o código de barras do medicamento
          </Text>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: "transparent",
    marginBottom: Spacing.xl,
  },
  instructions: {
    color: Colors.white,
    fontSize: Typography.sizes.m,
    textAlign: "center",
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.l,
  },
  cancelButton: {
    padding: Spacing.m,
    backgroundColor: Colors.surface,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: Colors.textPrimary,
    fontWeight: "bold",
  },
});
