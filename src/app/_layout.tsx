import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { Colors } from "../theme";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: Colors.surface,
              },
              headerTintColor: Colors.textPrimary,
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerShadowVisible: false,
              contentStyle: {
                backgroundColor: Colors.background,
              },
            }}
          >
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="medication/[id]"
              options={{ title: "Detalhes do Medicamento" }}
            />
            <Stack.Screen
              name="medication/add"
              options={{
                title: "Novo Medicamento",
                presentation: "modal",
              }}
            />
            <Stack.Screen
              name="pharmacy/[id]"
              options={{ title: "Detalhes do Produto" }}
            />
            <Stack.Screen name="cart" options={{ title: "Carrinho" }} />
            <Stack.Screen
              name="checkout"
              options={{ title: "Finalizar Compra" }}
            />
            <Stack.Screen
              name="address/index"
              options={{ title: "Meus Endereços" }}
            />
            <Stack.Screen
              name="address/add"
              options={{ title: "Novo Endereço" }}
            />
          </Stack>
        </CartProvider>
      </AuthProvider>
      <Toast />
    </QueryClientProvider>
  );
}
