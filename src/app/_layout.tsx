import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { CartProvider } from "../context/CartContext";
import { Colors } from "../theme";

export default function RootLayout() {
  return (
    <CartProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: Colors.background,
          },
        }}
      >
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
        <Stack.Screen name="checkout" options={{ title: "Finalizar Compra" }} />
      </Stack>
    </CartProvider>
  );
}
