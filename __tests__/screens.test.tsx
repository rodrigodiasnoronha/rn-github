import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";
import { PaperProvider } from "react-native-paper";
import * as Linking from "expo-linking";
import { Home } from "../src/screens/Home";
import { Perfil } from "../src/screens/Perfil";
import { Repositories } from "../src/screens/Repositories";
import { Routes } from "../src/routes";
import { getUsuarioGithub, getRepositoriosUsuario } from "../src/services/githubApi";

jest.mock("../src/services/githubApi");
jest.mock("expo-linking", () => ({ openURL: jest.fn() }));

const user = {
    id: 1,
    login: "octocat",
    name: "The Octocat",
    bio: "minha bio",
    location: "SF",
    email: "o@c.at",
    avatar_url: "https://x/a.png",
    created_at: "2011-01-25T18:44:36Z",
    followers: 1,
    following: 1,
};
const repos = [{ id: 1, name: "repo-a", html_url: "https://github.com/octocat/repo-a", owner: { login: "octocat" } }];

const wrap = (ui: React.ReactElement) => render(<PaperProvider>{ui}</PaperProvider>);
const nav = () => ({ navigate: jest.fn() }) as any;

beforeEach(() => jest.clearAllMocks());

describe("Home", () => {
    it("navega para Perfil quando o usuário existe", async () => {
        (getUsuarioGithub as jest.Mock).mockResolvedValue({ data: user });
        const navigation = nav();
        wrap(<Home navigation={navigation} children={null} />);
        fireEvent.changeText(screen.getByDisplayValue(""), "octocat");
        fireEvent.press(screen.getByText("Pesquisar"));
        await waitFor(() => expect(navigation.navigate).toHaveBeenCalledWith("Perfil", { user }));
        expect(getUsuarioGithub).toHaveBeenCalledWith("octocat");
    });

    it("mostra erro 404", async () => {
        (getUsuarioGithub as jest.Mock).mockRejectedValue({ response: { status: 404 } });
        wrap(<Home navigation={nav()} children={null} />);
        fireEvent.press(screen.getByText("Pesquisar"));
        expect(await screen.findByText("Usuário não encontrado")).toBeTruthy();
    });

    it("mostra erro genérico", async () => {
        (getUsuarioGithub as jest.Mock).mockRejectedValue(new Error("rede"));
        wrap(<Home navigation={nav()} children={null} />);
        fireEvent.press(screen.getByText("Pesquisar"));
        expect(await screen.findByText("Ocorreu um erro ao buscar o usuário")).toBeTruthy();
    });
});

describe("Perfil", () => {
    const route = { params: { user } };

    it("renderiza dados do usuário e abre e-mail", async () => {
        wrap(<Perfil navigation={nav()} route={route} children={null} />);
        expect(await screen.findByText("The Octocat")).toBeTruthy();
        expect(screen.getByText("minha bio")).toBeTruthy();
        expect(screen.getByText(/Ingressou no dia 25 de janeiro de 2011/)).toBeTruthy();
        fireEvent.press(screen.getByText("Enviar E-mail"));
        expect(Linking.openURL).toHaveBeenCalledWith("mailto:o@c.at");
    });

    it("não mostra botão de e-mail sem e-mail", async () => {
        wrap(<Perfil navigation={nav()} route={{ params: { user: { ...user, email: undefined } } }} children={null} />);
        await screen.findByText("The Octocat");
        expect(screen.queryByText("Enviar E-mail")).toBeNull();
    });

    it("navega para Repositories", async () => {
        (getRepositoriosUsuario as jest.Mock).mockResolvedValue({ data: repos });
        const navigation = nav();
        wrap(<Perfil navigation={navigation} route={route} children={null} />);
        fireEvent.press(await screen.findByText("Ver Repositórios"));
        await waitFor(() =>
            expect(navigation.navigate).toHaveBeenCalledWith("Repositories", { repositories: repos }),
        );
    });

    it("mostra erro ao falhar busca de repositórios", async () => {
        (getRepositoriosUsuario as jest.Mock).mockRejectedValue(new Error("x"));
        wrap(<Perfil navigation={nav()} route={route} children={null} />);
        fireEvent.press(await screen.findByText("Ver Repositórios"));
        expect(await screen.findByText("Ocorreu um erro ao buscar os repositórios")).toBeTruthy();
    });
});

describe("Repositories", () => {
    it("lista repositórios e abre o link", async () => {
        wrap(<Repositories navigation={nav()} route={{ params: { repositories: repos } }} children={null} />);
        fireEvent.press(await screen.findByText("repo-a"));
        expect(Linking.openURL).toHaveBeenCalledWith(repos[0].html_url);
    });
});

describe("Routes", () => {
    it("abre na Home", async () => {
        wrap(<Routes />);
        expect(await screen.findByText("Pesquisar")).toBeTruthy();
    });
});
