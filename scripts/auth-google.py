#!/usr/bin/env python3
"""
Script de autenticação OAuth para Google Workspace MCP
"""

import json
import os
import sys
from urllib.parse import urlencode, parse_qs, urlparse
from http.server import HTTPServer, BaseHTTPRequestHandler
import webbrowser
import threading
import requests

# Configurações
CLIENT_SECRETS_PATH = r"C:\Users\viniciuscastanho\.google\client_secret.json"
REDIRECT_URI = "http://localhost:3000/oauth2callback"
TOKEN_PATH = os.path.expanduser("~/.config/google/mcp-token.json")

# Scopes necessários
SCOPES = [
    "https://www.googleapis.com/auth/gmail.modify",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/drive.file"
]

class OAuthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        
        if parsed.path == "/oauth2callback":
            params = parse_qs(parsed.query)
            
            if "code" in params:
                self.server.auth_code = params["code"][0]
                self.send_response(200)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                self.wfile.write(b"""<html><body style="font-family: Arial; text-align: center; padding: 50px;"><h1>Autenticacao Concluida!</h1><p>Voce pode fechar esta janela e voltar ao terminal.</p></body></html>""")
            elif "error" in params:
                self.server.auth_error = params["error"][0]
                self.send_response(400)
                self.send_header("Content-type", "text/html")
                self.end_headers()
                error_msg = params["error"][0].encode()
                self.wfile.write(b"<html><body><h1>Erro na Autenticacao</h1><p>" + error_msg + b"</p></body></html>")
        else:
            self.send_response(404)
            self.end_headers()
    
    def log_message(self, format, *args):
        pass

def load_client_secrets():
    with open(CLIENT_SECRETS_PATH, "r") as f:
        return json.load(f)["web"]

def start_oauth_server():
    server = HTTPServer(("localhost", 3000), OAuthHandler)
    server.auth_code = None
    server.auth_error = None
    return server

def get_tokens(auth_code, client_id, client_secret):
    data = {
        "code": auth_code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code"
    }
    
    response = requests.post("https://oauth2.googleapis.com/token", data=data)
    return response.json()

def main():
    print("")
    print("=" * 50)
    print("Autenticacao Google Workspace MCP")
    print("=" * 50)
    print("")
    
    if not os.path.exists(CLIENT_SECRETS_PATH):
        print("Erro: client_secret.json nao encontrado em:")
        print("   " + CLIENT_SECRETS_PATH)
        sys.exit(1)
    
    secrets = load_client_secrets()
    client_id = secrets["client_id"]
    client_secret = secrets["client_secret"]
    
    print("Client secrets carregado")
    print("")
    
    server = start_oauth_server()
    server_thread = threading.Thread(target=server.serve_forever)
    server_thread.daemon = True
    server_thread.start()
    
    auth_params = {
        "client_id": client_id,
        "redirect_uri": REDIRECT_URI,
        "scope": " ".join(SCOPES),
        "response_type": "code",
        "access_type": "offline",
        "prompt": "consent"
    }
    auth_url = f"https://accounts.google.com/o/oauth2/auth?{urlencode(auth_params)}"
    
    print("URL de autorizacao:")
    print("   " + auth_url)
    print("")
    print("Servidor local iniciado em http://localhost:3000")
    print("")
    print("Abrindo navegador...")
    webbrowser.open(auth_url)
    print("")
    print("Aguardando autorizacao...")
    print("")
    
    while server.auth_code is None and server.auth_error is None:
        pass
    
    server.shutdown()
    
    if server.auth_error:
        print("Erro: " + server.auth_error)
        sys.exit(1)
    
    print("Codigo de autorizacao recebido")
    print("")
    print("Obtendo tokens de acesso...")
    tokens = get_tokens(server.auth_code, client_id, client_secret)
    
    if "error" in tokens:
        print("Erro ao obter tokens: " + tokens['error'])
        sys.exit(1)
    
    print("Tokens obtidos com sucesso")
    print("")
    
    os.makedirs(os.path.dirname(TOKEN_PATH), exist_ok=True)
    with open(TOKEN_PATH, "w") as f:
        json.dump({
            "access_token": tokens.get("access_token"),
            "refresh_token": tokens.get("refresh_token"),
            "expires_in": tokens.get("expires_in"),
            "scope": tokens.get("scope"),
            "token_type": tokens.get("token_type")
        }, f, indent=2)
    
    print("Tokens salvos em: " + TOKEN_PATH)
    print("")
    print("=" * 50)
    print("Autenticacao concluida!")
    print("=" * 50)
    print("")
    print("Voce pode agora usar o MCP Google Workspace")
    print("")

if __name__ == "__main__":
    main()
