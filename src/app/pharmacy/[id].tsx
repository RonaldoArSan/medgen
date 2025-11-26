import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCart } from "../../context/CartContext";
import PharmacyService from "../../services/PharmacyService";
import { BorderRadius, Colors, Spacing, Typography } from "../../theme";
import { PharmacyProduct } from "../../types";

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [product, setProduct] = useState<PharmacyProduct | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (typeof id === "string") {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (prodId: string) => {
    const data = await PharmacyService.getProductById(prodId);
    if (data) setProduct(data);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
      router.push("/cart");
    }
  };

  if (!product) return null;

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={{ uri: product.imageUrl }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.tags}>
            {product.requiresPrescription && (
              <View style={styles.tag}>
                <MaterialIcons
                  name="assignment"
                  size={16}
                  color={Colors.accent}
                />
                <Text style={styles.tagText}>Requer Receita</Text>
              </View>
            )}
            <View
              style={[
                styles.tag,
                { backgroundColor: Colors.secondaryLight + "20" },
              ]}
            >
              <MaterialIcons
                name="check-circle"
                size={16}
                color={Colors.secondary}
              />
              <Text style={[styles.tagText, { color: Colors.secondary }]}>
                Em Estoque
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Adicionar ao Carrinho</Text>
          <MaterialIcons name="shopping-cart" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  image: {
    width: "100%",
    height: 300,
    backgroundColor: Colors.white,
  },
  content: {
    padding: Spacing.l,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  category: {
    fontSize: Typography.sizes.s,
    color: Colors.primary,
    fontWeight: Typography.weights.medium,
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.s,
  },
  price: {
    fontSize: Typography.sizes.xxl,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginBottom: Spacing.l,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.l,
  },
  sectionTitle: {
    fontSize: Typography.sizes.m,
    fontWeight: Typography.weights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.s,
  },
  description: {
    fontSize: Typography.sizes.m,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.l,
  },
  tags: {
    flexDirection: "row",
    gap: Spacing.m,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.accent + "20",
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: BorderRadius.round,
    gap: Spacing.xs,
  },
  tagText: {
    fontSize: Typography.sizes.s,
    fontWeight: Typography.weights.medium,
    color: Colors.accent,
  },
  footer: {
    padding: Spacing.l,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  button: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.m,
    borderRadius: BorderRadius.l,
    gap: Spacing.s,
  },
  buttonText: {
    color: Colors.white,
    fontSize: Typography.sizes.m,
    fontWeight: Typography.weights.bold,
  },
});
