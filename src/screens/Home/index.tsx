import React, { Component } from "react";

import { NavigationProp } from "@react-navigation/native";
import { Keyboard, KeyboardAvoidingView, Platform } from "react-native";
import { Button, Snackbar, TextInput } from "react-native-paper";
import { getUsuarioGithub } from "../../services/githubApi";
import { styles } from "./styles";

type HomeProps = {
  children: React.ReactNode;
  navigation: NavigationProp<ReactNavigation.RootParamList>;
};

type HomeState = {
  username: string;
  loadingPesquisa: boolean;
  erro: string;
};

class Home extends Component<HomeProps, HomeState> {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      loadingPesquisa: false,
      erro: "",
    };

    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onDismissSnackbar = this.onDismissSnackbar.bind(this);
    this.onPressBotaoPesquisarUsuarioGithub =
      this.onPressBotaoPesquisarUsuarioGithub.bind(this);
  }

  onUsernameChange(text: string) {
    this.setState({ username: text });
  }

  onPressBotaoPesquisarUsuarioGithub() {
    Keyboard.dismiss();
    this.setState({ loadingPesquisa: true });

    getUsuarioGithub(this.state.username)
      .then((response) => {
        this.props.navigation.navigate("Perfil", { user: response.data });
      })
      .catch((err) => {
        let mensagemErro = "Ocorreu um erro ao buscar o usuário";
        if (err.response && err.response.status == 404)
          mensagemErro = "Usuário não encontrado";

        this.setState({ erro: mensagemErro });
      })
      .finally(() => {
        this.setState({ loadingPesquisa: false });
      });
  }

  onDismissSnackbar() {
    this.setState({ erro: "" });
  }

  render() {
    const { username, loadingPesquisa, erro } = this.state;

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TextInput
          mode="outlined"
          label="Usuário do Github"
          value={username}
          onChangeText={this.onUsernameChange}
          autoComplete="off"
          autoCorrect={false}
          autoCapitalize={"none"}
        />

        <Button
          icon="magnify"
          mode="contained"
          dark
          loading={loadingPesquisa}
          onPress={this.onPressBotaoPesquisarUsuarioGithub}
          style={styles.button}
        >
          Pesquisar
        </Button>

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

        {/* {erro && <Paragraph>{erro}</Paragraph>} */}
      </KeyboardAvoidingView>
    );
  }
}

export { Home };

