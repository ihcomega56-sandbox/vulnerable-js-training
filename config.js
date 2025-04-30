// Azure設定とGitHub認証情報の構成ファイル
// 警告: このファイルには機密情報が含まれています。実際の開発では.gitignoreに追加するべきです。

const config = {
  // Azure OpenAI設定
  azure: {
    openai: {
      // Azure OpenAI API Key
      apiKey: "3bd06a5e5bfa47c795b822a4408223f5",
      endpoint: "https://your-resource-name.openai.azure.com/",
      deploymentId: "gpt-35-turbo",
      apiVersion: "2023-05-15"
    },
    
    // Azure Entra ID認証
    entraId: {
      tenantId: "72f988bf-86f1-41af-91ab-2d7cd011db47",
      clientId: "6e74172b-be56-4843-9ff4-e66a39bb12e3",
      clientSecret: "JBD8Q~abcdefghijklmnopqrstuvwxyz12345678",
      // Azure Entra ID Tokenの例
      accessToken: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiI2ZTc0MTcyYi1iZTU2LTQ4NDMtOWZmNC1lNjZhMzliYjEyZTMiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3L3YyLjAiLCJpYXQiOjE2ODQ0NzA5MDgsIm5iZiI6MTY4NDQ3MDkwOCwiZXhwIjoxNjg0NDc0ODA4LCJhaW8iOiJFMlpnWUZDdG1vWFgrZWUrVDIzZi9mc1NWSXBoQUE9PSIsImF6cCI6IjZlNzQxNzJiLWJlNTYtNDg0My05ZmY0LWU2NmEzOWJiMTJlMyIsImF6cGFjciI6IjEiLCJvaWQiOiI5YzAwODBmNS03NTM1LTRiYTgtOTI0OS1lNTYzYTI1ZTYzNDYiLCJyaCI6IjAuQVhRQWRpRUdXS1V4VTA2Ty0zaEt0Tk41c3RvWkhvZEx1dEZQdTY5WW41dHRCbkJhQUFBLiIsInN1YiI6IjljMDA4MGY1LTc1MzUtNGJhOC05MjQ5LWU1NjNhMjVlNjM0NiIsInRpZCI6IjcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0NyIsInV0aSI6ImRjUkNOOV9QY1V1eVdYS2tuU29mQUEiLCJ2ZXIiOiIyLjAifQ.Kj8d7OwcWnXKA9jpdYzEOKYJLjQT8RUmZnBIFs6N63SrJUK6DlpkeE7EkvvBiLFckJcOuHQdmGpR-XfXCrGGjd0nzxiNLHNNqpE3OjtHW-HnND9qJYhHySWZNzZhHtJbKcpG5zEpteRyVaW_kXFEQQb-yU13E9CIgjhOoL0JsgrH2vG0gPCbFV9RwN7HQC4ILAdYLMGB7PB0mBfnKBJYAMIv73tkRKWVx0Z4AlYKVxvwrUkGILm0jGM88xdM2EIzQupZ5yQFkz8Pk9h-AMaJ3Bst1HJ9r5WPxWS1KXwUQ7hP-YoJqwmyJQU52puZSvUiIQP9GyZA6dK2q7NB_nCHmw"
    }
  },
  
  // GitHub設定
  github: {
    // GitHub Personal Access Token (PAT)
    auth: {
      token: "ghp_4aBcDeFgHiJkLmNoPqRsTuVwXyZ567891d", 
      type: "oauth"
    },
    // 追加のGitHub PAT（異なる権限用）
    tokens: {
      repoAccess: "ghp_5aBcDeFgHiJkLmNoPqRsTuVwXyZ567891e",
      gistAccess: "ghp_6aBcDeFgHiJkLmNoPqRsTuVwXyZ567891f"
    },
    // GitHubのエンドポイント設定
    api: {
      baseUrl: "https://api.github.com",
      version: "2022-11-28"
    }
  }
};

// 設定のエクスポート
module.exports = config;