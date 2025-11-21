// app/farmer/marketplace.tsx
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BackHeader from "../components/BackHeader";
import { useLanguage } from "./i18n/LanguageContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width / 2) - 24;
const CARD_HEIGHT = 220;

import { BACKEND_BASE } from "../constants/backend";

export default function MarketplaceScreen() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Load products from backend - ONLY real data, no fallbacks
  const loadProducts = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const response = await fetch(`${BACKEND_BASE}/api/products`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          // Use ONLY backend data with real image URLs
          const realProducts = data.map((product: any) => ({
            ...product,
            // Use imageUrl from backend, or image field if it exists
            image: product.imageUrl 
              ? { uri: product.imageUrl } 
              : product.image 
              ? (typeof product.image === 'string' ? { uri: product.image } : product.image)
              : null,
          }));
          setProducts(realProducts);
        } else {
          // No products available - show empty state
          setProducts([]);
        }
      } else {
        // API error - show empty state
        setProducts([]);
      }
    } catch (error) {
      console.warn("Failed to fetch products from backend:", error);
      // No fallback - show empty state
      setProducts([]);
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  function onRefresh() {
    loadProducts(true);
  }

  function renderCard({ item }: { item: any }) {
    return (
      <View style={styles.cardWrap}>
        <View style={styles.card}>
          <View style={styles.imageWrap}>
            {item.image ? (
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>📦</Text>
              </View>
            )}
          </View>

          <View style={styles.info}>
            <Text numberOfLines={2} style={styles.title}>{item.name}</Text>
            <Text style={styles.price}>₹{item.price} <Text style={styles.unit}>/{item.unit}</Text></Text>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push(`/farmer/product-details?productId=${item.id}`)}
            >
              <LinearGradient colors={["#2E7D32", "#4CAF50"]} style={styles.cta}>
                <Text style={styles.ctaText}>
                  {t("viewDetails") || "View Details"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <BackHeader title={t("marketplace") || "Marketplace"} />
      <FlatList
        contentContainerStyle={styles.container}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        data={products}
        keyExtractor={(p) => p.id}
        numColumns={2}
        renderItem={renderCard}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <View style={styles.headerWrap}>
            <Text style={styles.header}>
              {t("availableProducts") || "Available Products"}
            </Text>
            <Text style={styles.headerSub}>
              {t("freshFromFarmers") || "Fresh, direct from farmers — browse and view details"}
            </Text>
          </View>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyText}>
                {language === "mr" 
                  ? "कोणतेही उत्पादने उपलब्ध नाहीत" 
                  : "No products available"}
              </Text>
              <Text style={styles.emptySubText}>
                {language === "mr"
                  ? "कृपया नंतर पुन्हा तपासा"
                  : "Please check back later"}
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 40,
    backgroundColor: "#f5f7f6",
  },
  headerWrap: {
    marginBottom: 14,
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "900",
    color: "#2E7D32",
  },
  headerSub: {
    color: "#6b7280",
    marginTop: 6,
    textAlign: "center",
    maxWidth: 420,
  },

  cardWrap: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    // shadow
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  imageWrap: {
    width: "100%",
    height: CARD_HEIGHT * 0.55,
    backgroundColor: "#eef7ef",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 48,
    opacity: 0.5,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#64748B",
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
  },

  info: {
    padding: 12,
    minHeight: CARD_HEIGHT * 0.35,
    justifyContent: "space-between",
  },

  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#222",
    marginBottom: 6,
  },

  price: {
    fontSize: 14,
    color: "#2E7D32",
    fontWeight: "900",
    marginBottom: 8,
  },

  unit: { fontWeight: "600", color: "#6b7280", fontSize: 12 },

  cta: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    width: "100%",
  },
  ctaText: { color: "#fff", fontWeight: "900", fontSize: 14 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
