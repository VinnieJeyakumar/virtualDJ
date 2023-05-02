const clientId = "dbf31f07917146e2bafd8ad02c152e46";
const clientSecret = "f52b809ac786427e89534643f441d466";

const basicAuth = btoa(`${clientId}:${clientSecret}`);

export const getAccessToken = async () => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
};
