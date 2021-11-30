import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  avatarContainer: {
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  nome: {
    fontWeight: "500",
    fontSize: 22,
    textAlign: "center",
    marginVertical: 10,
  },
  descricao: {
    textAlign: "center",
  },
  actions: {
    flex: 1,
    justifyContent: "flex-end",
  },

  action: {
    marginVertical: 5,
  },
});
