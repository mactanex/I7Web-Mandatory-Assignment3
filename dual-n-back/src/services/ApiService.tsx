import axios from "axios";

export class ApiService {
  public login = async (username: string, password: string) =>
    await axios
      .post("http://localhost:3333/api/login", {
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
        window.location.href = "/";
      });


  public Opret = async (username: string, password: string) =>
    await axios
      .post("http://localhost:3333/api/signup", {
        username: username,
        password: password
      })
      .then(response => {
        // handle success
        console.log(`Response received from backend: ${response.status}`);
      })
      .catch(error => {
        // handle error
        console.log(error);
      })
      .then(() => {
        // always executed
      });


  public updateHighscore = async (score: number) =>

    await axios
      .post(
        `http://localhost:3333/api/highscore?highscore=${score}`,
        {},
        {
          headers: {
            Authorization: "Bearer " + this.getAccessTokenFromLocalStorage()
          }
        }
      )
      .then(response => {
        // handle success


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
  public getAccessTokenFromLocalStorage = () => {
    return localStorage.getItem("ACCESS_TOKEN");
  };
}
