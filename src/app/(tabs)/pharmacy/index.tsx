import { MaterialIcons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../../context/CartContext";
import PharmacyService from "../../../services/PharmacyService";
import {
  BorderRadius,
  Colors,
  Shadows,
  Spacing,
  Typography,
} from "../../../theme";
import { PharmacyProduct } from "../../../types";

export default function PharmacyScreen() {
  const [products, setProducts] = useState<PharmacyProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { itemCount } = useCart();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await PharmacyService.getProducts();
    setProducts(data);
  };

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (text.length > 2) {
      const results = await PharmacyService.searchProducts(text);
      setProducts(results);
    } else if (text.length === 0) {
      loadProducts();
    }
  };

  const renderProduct = ({ item }: { item: PharmacyProduct }) => (
    <Link href={`/pharmacy/${item.id}`} asChild>
      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.price}>R$ {item.price.toFixed(2)}</Text>
        </View>
        <View style={styles.addButton}>
          <MaterialIcons name="add" size={24} color={Colors.primary} />
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar medicamentos..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => router.push("/cart")}
        >
          <MaterialIcons name="shopping-cart" size={24} color={Colors.white} />
          {itemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{itemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.m,
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.m,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.m,
    paddingHorizontal: Spacing.s,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.s,
    fontSize: Typography.sizes.m,
  },
  cartButton: {
    position: "relative",
    padding: Spacing.s,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.round,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: "bold",
  },
  list: {
    padding: Spacing.s,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.m,
    width: "48%",
    marginBottom: Spacing.m,
    ...Shadows.small,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 120,
    backgroundColor: Colors.background,
  },
  cardContent: {
    padding: Spacing.s,
  },
  name: {
    fontSize: Typography.sizes.s,
    fontWeight: Typography.weights.medium,
    color: Colors.textPrimary,
    marginBottom: 4,
    height: 40,
  },
  category: {
    fontSize: Typography.sizes.xs,
    color: Colors.textLight,
    marginBottom: 4,
  },
  price: {
    fontSize: Typography.sizes.m,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  addButton: {
    position: "absolute",
    bottom: Spacing.s,
    right: Spacing.s,
    backgroundColor: Colors.primaryLight + "20",
    borderRadius: BorderRadius.round,
    padding: 4,
  },
});
