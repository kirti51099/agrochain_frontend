import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../../config/firebaseconfig";

export default function AddUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [address, setAddress] = useState("");

  const handleAdd = async () => {
    if (!name || !email || !role) {
      Alert.alert("Error", "Name, email and role are required.");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), "Default123");
      await setDoc(doc(db, "users", res.user.uid), {
        name: name.trim(),
        email: email.trim(),
        role: role.trim(),
        address: address.trim(),
        uid: res.user.uid,
        createdAt: new Date(),
      });

      Alert.alert("Success", "User added successfully!\nDefault password: Default123");
      setName("");
      setEmail("");
      setRole("");
      setAddress("");
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>➕ Add New User</Text>
        <Text style={styles.subtitle}>
          Quickly create a Farmer, Buyer or Admin account from here.
        </Text>

        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Role (farmer / buyer / admin)"
          style={styles.input}
          autoCapitalize="none"
          value={role}
          onChangeText={setRole}
        />
        <TextInput
          placeholder="Address"
          style={[styles.input, { minHeight: 60 }]}
          value={address}
          onChangeText={setAddress}
          multiline
        />

        <TouchableOpacity style={styles.btn} onPress={handleAdd}>
          <Text style={styles.btnText}>Create User</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Note: A default password <Text style={{ fontWeight: "700" }}>Default123</Text> is set.
          The user should change it after first login.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f0fdf4",
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    marginTop: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#166534",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginVertical: 6,
    fontSize: 14,
    backgroundColor: "#f9fafb",
  },
  btn: {
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    borderRadius: 999,
    marginTop: 12,
    alignItems: "center",
  },
  btnText: {
    color: "#fefce8",
    fontWeight: "700",
    fontSize: 15,
  },
  note: {
    marginTop: 10,
    fontSize: 12,
    color: "#6b7280",
  },
});
