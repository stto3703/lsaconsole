app.service("ConnectionsConfig", function () {

  this.version = "v1.0";

  this.hosts = [
    { env: "dev", url: "http://dev.lsa.itsfogo.com" },
    { env: "int", url: "http://integration.lsa.itsfogo.com" },
    { env: "fvt", url: "http://test.lsa.itsfogo.com" },
    { env: "beta", url: "https://beta-lsa.itsfogo.com" },
    { env: "prod", url: "https://lsa.itsfogo.com" }
  ];

  this.cultures = [
    { name: "en-US", value: 1 },
    { name: "de-DE", value: 2 },
  ];

  this.applications = [
    { name: "bwin.com", id: 1 },
    { name: "bwin.es", id: 132 },
    { name: "gamebookers.com", id: 142 }
  ];

});