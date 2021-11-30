import React, { Component } from "react";

import { View, Text, ActivityIndicator, Image } from "react-native";
import * as Linking from "expo-linking";
import { Button, Snackbar } from "react-native-paper";
import { NavigationProp } from "@react-navigation/native";
import { formatarData } from "../../utils/utils";
import { getRepositoriosUsuario } from "../../services/githubApi";
import { styles } from "./styles";

type User = {
  id: number;
  login: string;
  bio?: string;
  location?: string;
  email?: string;
  avatar_url: string;
  name: string;
  created_at: Date | string;
  followers: number;
  following: number;
};

type PerfilProps = {
  children: React.ReactNode;
  navigation: NavigationProp<ReactNavigation.RootParamList>;
  route: {
    params: {
      user: User;
    };
  };
};

type PerfilState = {
  loading: boolean;
  user: User;
  loadingRepositories: boolean;
  erro: string;
};

class Perfil extends Component<PerfilProps, PerfilState> {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      user: {} as User,
      loadingRepositories: false,
      erro: "",
    };

    this.onDismissSnackbar = this.onDismissSnackbar.bind(this);
    this.onPressEnviarEmail = this.onPressEnviarEmail.bind(this);
    this.onPressVerRepositoriosDoUsuario =
      this.onPressVerRepositoriosDoUsuario.bind(this);
  }

  componentDidMount() {
    if (this.props.route.params.user) {
      this.setState({ user: this.props.route.params.user, loading: false });
    }
  }

  onPressEnviarEmail(email: string) {
    return Linking.openURL(`mailto:${email}`);
  }

  onPressVerRepositoriosDoUsuario() {
    this.setState({ loadingRepositories: true });

    const { user } = this.state;
    getRepositoriosUsuario(user.login)
      .then((response) => {
        this.props.navigation.navigate("Repositories", {
          repositories: response.data,
        });
      })
      .catch((err) => {
        this.setState({ erro: "Ocorreu um erro ao buscar os repositórios" });
      })
      .finally(() => {
        this.setState({ loadingRepositories: false });
      });
  }

  onDismissSnackbar() {
    this.setState({ erro: "" });
  }

  render() {
    const { loading, user, loadingRepositories, erro } = this.state;

    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator color="red" size="large" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Image
            style={styles.avatar}
            resizeMode="cover"
            source={{ uri: user.avatar_url }}
          />
        </View>

        <Text style={styles.nome}>{user.name}</Text>
        {user.bio && <Text style={styles.descricao}>{user.bio}</Text>}
        {user.location && <Text style={styles.descricao}>{user.location}</Text>}
        <Text style={styles.descricao}>
          {formatarData(
            user.created_at,
            "'Ingressou no dia' dd 'de' MMMM 'de' yyyy"
          )}
        </Text>

        <View style={styles.actions}>
          {user.email && (
            <Button
              style={styles.action}
              icon="email"
              mode="contained"
              dark
              onPress={() => this.onPressEnviarEmail(user.email || "")}
            >
              Enviar E-mail
            </Button>
          )}

          <Button
            loading={loadingRepositories}
            style={styles.action}
            icon="send"
            mode="contained"
            dark
            onPress={this.onPressVerRepositoriosDoUsuario}
          >
            Ver Repositórios
          </Button>
        </View>

        <Snackbar
          visible={!!erro}
          onDismiss={this.onDismissSnackbar}
          action={{
            label: "Ok",
            onPress: () => {},
          }}
        >
          {erro}
        </Snackbar>
      </View>
    );
  }
}

export { Perfil };
