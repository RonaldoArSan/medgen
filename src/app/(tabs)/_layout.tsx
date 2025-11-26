import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Colors } from "../../theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: Colors.white,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="dashboard" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="medications/index"
        options={{
          title: "Medicamentos",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="medication" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pharmacy/index"
        options={{
          title: "Farmácia",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-pharmacy" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="receipt" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
