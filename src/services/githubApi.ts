import axios from "axios";

const githubApi = axios.create({
  baseURL: "https://api.github.com/",
});

export const getUsuarioGithub = (username: string) => {
  return githubApi.get(`/users/${username}`);
};

export const getRepositoriosUsuario = (username: string) => {
  return githubApi.get(`/users/${username}/repos`);
};
