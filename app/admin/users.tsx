import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "../../config/firebaseconfig";

export default function UsersScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const arr: any[] = [];
      snapshot.forEach((docSnap) => arr.push({ id: docSnap.id, ...docSnap.data() }));
      setUsers(arr);
    } catch (e) {
      console.log("Users load error:", e);
      Alert.alert("Error", "Failed to load users.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id: string) => {
    Alert.alert("Confirm", "Delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteDoc(doc(db, "users", id));
          fetchUsers();
        },
      },
    ]);
  };

  const changeRole = async (id: string, newRole: string) => {
    await updateDoc(doc(db, "users", id), { role: newRole });
    fetchUsers();
  };

  const renderItem = ({ item }: any) => {
    const roleColor =
      item.role === "admin" || item.role === "Admin"
        ? "#1E40AF"
        : item.role === "farmer" || item.role === "Farmer"
        ? "#15803D"
        : "#0EA5E9";

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.name}>{item.name || "No name"}</Text>
          <View style={[styles.roleChip, { backgroundColor: roleColor }]}>
            <Text style={styles.roleChipText}>{(item.role || "N/A").toString()}</Text>
          </View>
        </View>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{item.email}</Text>

        {item.address ? (
          <>
            <Text style={styles.label}>Address</Text>
            <Text style={styles.value}>{item.address}</Text>
          </>
        ) : null}

        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.roleBtn, { borderColor: "#15803D" }]}
            onPress={() => changeRole(item.id, "farmer")}
          >
            <Text style={[styles.btnText, { color: "#15803D" }]}>Farmer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleBtn, { borderColor: "#0EA5E9" }]}
            onPress={() => changeRole(item.id, "buyer")}
          >
            <Text style={[styles.btnText, { color: "#0EA5E9" }]}>Buyer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleBtn, { borderColor: "#1E40AF" }]}
            onPress={() => changeRole(item.id, "admin")}
          >
            <Text style={[styles.btnText, { color: "#1E40AF" }]}>Admin</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteUser(item.id)}>
          <Text style={styles.deleteText}>Delete User</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      {loading && !refreshing ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Loading users...</Text>
      ) : (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 12, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchUsers();
              }}
              colors={["#2E7D32"]}
            />
          }
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 40, color: "#6b7280" }}>
              No users found.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f1f5f9",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  roleChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  roleChipText: {
    color: "#f9fafb",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  value: {
    fontSize: 14,
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  roleBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    marginHorizontal: 3,
    alignItems: "center",
  },
  btnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  deleteBtn: {
    marginTop: 10,
    backgroundColor: "#DC2626",
    paddingVertical: 8,
    borderRadius: 999,
  },
  deleteText: {
    color: "#fef2f2",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 13,
  },
});
