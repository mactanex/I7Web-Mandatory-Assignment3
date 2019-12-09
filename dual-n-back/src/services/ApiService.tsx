import axios from "axios";

export class ApiService {
  public login = async (username: string, password: string) =>
    await axios
      .post("http://localhost:3333/login", {
        username: username,
        password: password
      })
      .then(response => {
        // handle success
        console.log(`Token received from backend: ${response.data.token}`);
        this.setAccessTokenInLocalStorage(response.data.token);
      })
      .catch(error => {
        // handle error
        console.log(error);
      })
      .then(() => {
        // always executed
      });

  public updateHighscore = async (username: string, password: string) =>
    await axios
      .post("http://localhost:3333/login", {
        username: username,
        password: password
      })
      .then(response => {
        // handle success
        console.log(`Token received from backend: ${response.data.token}`);
        this.setAccessTokenInLocalStorage(response.data.token);
      })
      .catch(error => {
        // handle error
        console.log(error);
      })
      .then(() => {
        // always executed
      });

  public async transformOptions(options: RequestInit): Promise<RequestInit> {
    const token = this.getAccessTokenFromLocalStorage();
    const headerData = token
      ? {
          ...options.headers,
          Authorization: "Bearer " + token
        }
      : {
          ...options.headers
        };
    return Object.assign({}, options, {
      headers: headerData
    });
  }

  private setAccessTokenInLocalStorage = (token: string) => {
    return localStorage.setItem("ACCESS_TOKEN", token);
  };
  private getAccessTokenFromLocalStorage = () => {
    return localStorage.getItem("ACCESS_TOKEN");
  };
}
